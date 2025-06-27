const express = require('express');
const router = express.Router();

// Mock analytics data (in production, this would come from a database)
let analyticsData = {
  totalUsers: 0,
  totalConnections: 0,
  totalPitchReviews: 0,
  activeFunders: 5,
  successStories: 12,
  monthlyStats: {
    newUsers: 0,
    newConnections: 0,
    pitchReviews: 0
  }
};

// GET /api/analytics/dashboard - Get dashboard analytics
router.get('/dashboard', (req, res) => {
  try {
    res.json({
      success: true,
      analytics: analyticsData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Unable to fetch analytics'
    });
  }
});

// POST /api/analytics/track - Track user activity
router.post('/track', (req, res) => {
  try {
    const { event, userId, data } = req.body;
    
    // In a real application, you would save this to a database
    console.log('Analytics event:', { event, userId, data, timestamp: new Date() });
    
    // Update mock data based on events
    switch (event) {
      case 'user_registered':
        analyticsData.totalUsers++;
        analyticsData.monthlyStats.newUsers++;
        break;
      case 'connection_requested':
        analyticsData.totalConnections++;
        analyticsData.monthlyStats.newConnections++;
        break;
      case 'pitch_reviewed':
        analyticsData.totalPitchReviews++;
        analyticsData.monthlyStats.pitchReviews++;
        break;
    }
    
    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Unable to track event'
    });
  }
});

// GET /api/analytics/health
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Analytics Service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 