const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const OpenAI = require('openai');
const Joi = require('joi');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

// Validation schemas
const pitchFeedbackSchema = Joi.object({
  businessIdea: Joi.string().min(10).max(2000).required(),
  targetMarket: Joi.string().min(5).max(500).optional(),
  fundingNeeds: Joi.string().min(5).max(500).optional(),
  stage: Joi.string().valid('idea', 'mvp', 'early-traction', 'scaling').optional()
});

const businessAdviceSchema = Joi.object({
  question: Joi.string().min(10).max(1000).required(),
  context: Joi.string().max(1000).optional(),
  industry: Joi.string().max(100).optional()
});

// Helper function to generate AI prompt for women entrepreneurs
const generatePitchPrompt = (data) => {
  return `You are an expert business mentor specializing in helping women entrepreneurs. 
  
Please provide constructive feedback on this business pitch:

Business Idea: ${data.businessIdea}
Target Market: ${data.targetMarket || 'Not specified'}
Funding Needs: ${data.fundingNeeds || 'Not specified'}
Stage: ${data.stage || 'Not specified'}

Please provide feedback in the following format:
1. **Strengths** (2-3 points)
2. **Areas for Improvement** (3-4 specific, actionable points)
3. **Market Validation Suggestions** (2-3 ideas)
4. **Funding Strategy Recommendations** (2-3 suggestions)
5. **Next Steps** (3-4 actionable items)

Keep the tone encouraging but honest. Focus on practical, actionable advice that empowers the entrepreneur.`;
};

// POST /api/ai/pitch-feedback
router.post('/pitch-feedback', async (req, res) => {
  try {
    // Validate input
    const { error, value } = pitchFeedbackSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    const prompt = generatePitchPrompt(value);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert business mentor specializing in helping women entrepreneurs. Provide constructive, actionable feedback that empowers and guides them toward success."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const feedback = completion.choices[0].message.content;

    res.json({
      success: true,
      feedback: feedback,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Pitch feedback error:', error);
    res.status(500).json({
      error: 'AI Service Error',
      message: 'Unable to generate pitch feedback at this time'
    });
  }
});

// POST /api/ai/pitch-feedback-file
router.post('/pitch-feedback-file', upload.single('pitchFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'File Required',
        message: 'Please upload a pitch document'
      });
    }

    // Read the uploaded file
    const fileContent = await fs.readFile(req.file.path, 'utf8');
    
    // Clean up the file after reading
    await fs.unlink(req.file.path);

    const prompt = `You are an expert business mentor specializing in helping women entrepreneurs. 
    
Please analyze this pitch document and provide constructive feedback:

${fileContent}

Please provide feedback in the following format:
1. **Document Strengths** (2-3 points)
2. **Areas for Improvement** (3-4 specific, actionable points)
3. **Clarity & Structure** (2-3 suggestions)
4. **Market Positioning** (2-3 recommendations)
5. **Next Steps** (3-4 actionable items)

Keep the tone encouraging but honest. Focus on practical, actionable advice.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert business mentor specializing in helping women entrepreneurs. Provide constructive, actionable feedback that empowers and guides them toward success."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const feedback = completion.choices[0].message.content;

    res.json({
      success: true,
      feedback: feedback,
      originalFilename: req.file.originalname,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('File pitch feedback error:', error);
    
    // Clean up file if it exists
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(500).json({
      error: 'AI Service Error',
      message: 'Unable to analyze pitch document at this time'
    });
  }
});

// POST /api/ai/business-advice
router.post('/business-advice', async (req, res) => {
  try {
    // Validate input
    const { error, value } = businessAdviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    const prompt = `You are an expert business mentor specializing in helping women entrepreneurs. 
    
Please provide advice on this question:

Question: ${value.question}
Context: ${value.context || 'No additional context provided'}
Industry: ${value.industry || 'Not specified'}

Provide practical, actionable advice that empowers the entrepreneur. Include specific steps or strategies when possible.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert business mentor specializing in helping women entrepreneurs. Provide practical, actionable advice that empowers and guides them toward success."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const advice = completion.choices[0].message.content;

    res.json({
      success: true,
      advice: advice,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Business advice error:', error);
    res.status(500).json({
      error: 'AI Service Error',
      message: 'Unable to provide business advice at this time'
    });
  }
});

// GET /api/ai/health
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AI Service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 