
import { Router } from 'express';
const router = Router();
import DeviceData from '../models/DeviceData.js';

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

export default router;
