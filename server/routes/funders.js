const express = require('express');
const router = express.Router();

// Mock funders data (in production, this would come from a database)
const funders = [
  {
    id: 1,
    name: 'Jane Capital',
    type: 'Angel Investor',
    description: 'Invests in early-stage women-led startups.',
    focus: ['Technology', 'Healthcare', 'Education'],
    investmentRange: '$50K - $500K',
    stage: ['idea', 'mvp', 'early-traction'],
    website: 'https://janecapital.com',
    contactEmail: 'hello@janecapital.com'
  },
  {
    id: 2,
    name: 'GrowthX Fund',
    type: 'Venture Capital',
    description: 'Focus on tech and social impact.',
    focus: ['Technology', 'Social Impact', 'Sustainability'],
    investmentRange: '$100K - $2M',
    stage: ['mvp', 'early-traction', 'scaling'],
    website: 'https://growthxfund.com',
    contactEmail: 'partners@growthxfund.com'
  },
  {
    id: 3,
    name: 'Empower Grants',
    type: 'Grant Program',
    description: 'Non-dilutive funding for women entrepreneurs.',
    focus: ['All Industries'],
    investmentRange: '$5K - $50K',
    stage: ['idea', 'mvp'],
    website: 'https://empowergrants.org',
    contactEmail: 'apply@empowergrants.org'
  },
  {
    id: 4,
    name: 'Women First Ventures',
    type: 'Venture Capital',
    description: 'Dedicated to funding women-led businesses.',
    focus: ['Technology', 'Consumer', 'Healthcare'],
    investmentRange: '$250K - $1M',
    stage: ['early-traction', 'scaling'],
    website: 'https://womenfirst.vc',
    contactEmail: 'hello@womenfirst.vc'
  },
  {
    id: 5,
    name: 'StartHer Fund',
    type: 'Angel Network',
    description: 'Angel investors supporting women entrepreneurs.',
    focus: ['Technology', 'E-commerce', 'Services'],
    investmentRange: '$25K - $200K',
    stage: ['idea', 'mvp', 'early-traction'],
    website: 'https://startherfund.com',
    contactEmail: 'invest@startherfund.com'
  }
];

// GET /api/funders - Get all funders
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      funders: funders,
      count: funders.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get funders error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Unable to fetch funders'
    });
  }
});

// GET /api/funders/:id - Get specific funder
router.get('/:id', (req, res) => {
  try {
    const funderId = parseInt(req.params.id);
    const funder = funders.find(f => f.id === funderId);
    
    if (!funder) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Funder not found'
      });
    }
    
    res.json({
      success: true,
      funder: funder,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get funder error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Unable to fetch funder'
    });
  }
});

// POST /api/funders/connect - Request connection with funder
router.post('/connect', (req, res) => {
  try {
    const { funderId, entrepreneurName, email, businessIdea, stage } = req.body;
    
    if (!funderId || !entrepreneurName || !email || !businessIdea) {
      return res.status(400).json({
        error: 'Missing Required Fields',
        message: 'Please provide funderId, entrepreneurName, email, and businessIdea'
      });
    }
    
    // In a real application, you would save this to a database
    console.log('Connection request:', {
      funderId,
      entrepreneurName,
      email,
      businessIdea,
      stage,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      message: 'Connection request submitted successfully',
      funderId: funderId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Connection request error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Unable to submit connection request'
    });
  }
});

module.exports = router; 