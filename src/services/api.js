
import { toast } from "@/hooks/use-toast";

// Base URL can be changed based on environment
const API_BASE_URL = "/api";

export const api = {
  // Fetch latest data for all devices or a specific device
  getLatestData: async (deviceId) => {
    try {
      const endpoint = deviceId 
        ? `${API_BASE_URL}/data/latest/${deviceId}` 
        : `${API_BASE_URL}/data/latest`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching latest data:", error);
      toast({
        title: "Data retrieval failed",
        description: "Could not fetch latest device data",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Post new device data
  addDeviceData: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      toast({
        title: "Data submitted",
        description: "Device data successfully recorded",
      });
      
      return result;
    } catch (error) {
      console.error("Error adding device data:", error);
      toast({
        title: "Data submission failed",
        description: "Could not record device data",
        variant: "destructive"
      });
      throw error;
    }
  },
  
  // Get historical data for a specific device
  getDeviceHistory: async (deviceId, limit = 20) => {
    try {
      const response = await fetch(`${API_BASE_URL}/data/history/${deviceId}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching device history:", error);
      toast({
        title: "Data retrieval failed",
        description: "Could not fetch device history",
        variant: "destructive"
      });
      throw error;
    }
  },
};
