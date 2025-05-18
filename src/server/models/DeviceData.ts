
import mongoose from 'mongoose';

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
export const DeviceData = mongoose.model('DeviceData', DeviceDataSchema);
