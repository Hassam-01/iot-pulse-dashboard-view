
// This file is for running the Express server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// MongoDB connection URI
const MONGODB_URI = 'mongodb+srv://alihassam1:JgfXZHLnio1Jp10s@cluster0.cyicnky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define the schema for device data
const DeviceDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    trim: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better query performance
DeviceDataSchema.index({ deviceId: 1, timestamp: -1 });

// Create and export the model
const DeviceData = mongoose.model('DeviceData', DeviceDataSchema);

// API Routes
const router = express.Router();

// POST /api/data - Add new device data
router.post('/', async (req, res) => {
  try {
    const { deviceId, temperature, humidity } = req.body;

    // Validate required fields
    if (!deviceId || temperature === undefined || humidity === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields: deviceId, temperature, and humidity are required' 
      });
    }

    // Create new data entry
    const newData = new DeviceData({
      deviceId,
      temperature,
      humidity,
    });

    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error creating device data:', error);
    res.status(500).json({ message: 'Failed to save device data', error });
  }
});

// GET /api/data/latest - Get latest data for all devices
router.get('/latest', async (req, res) => {
  try {
    // Get distinct deviceIds
    const distinctDevices = await DeviceData.distinct('deviceId');
    
    // Get latest reading for each device
    const latestData = await Promise.all(
      distinctDevices.map(async (deviceId) => {
        return await DeviceData.findOne({ deviceId })
          .sort({ timestamp: -1 })
          .exec();
      })
    );
    
    res.json(latestData.filter(Boolean));
  } catch (error) {
    console.error('Error fetching latest device data:', error);
    res.status(500).json({ message: 'Failed to fetch latest device data', error });
  }
});

// GET /api/data/latest/:deviceId - Get latest data for specific device
router.get('/latest/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    const latestData = await DeviceData.findOne({ deviceId })
      .sort({ timestamp: -1 })
      .exec();
      
    if (!latestData) {
      return res.status(404).json({ message: 'No data found for this device' });
    }
    
    res.json([latestData]);
  } catch (error) {
    console.error('Error fetching device data:', error);
    res.status(500).json({ message: 'Failed to fetch device data', error });
  }
});

// GET /api/data/history/:deviceId - Get historical data for a device
router.get('/history/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const history = await DeviceData.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
      
    if (!history.length) {
      return res.status(404).json({ message: 'No history found for this device' });
    }
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching device history:', error);
    res.status(500).json({ message: 'Failed to fetch device history', error });
  }
});

// Setup routes
app.use('/api/data', router);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
