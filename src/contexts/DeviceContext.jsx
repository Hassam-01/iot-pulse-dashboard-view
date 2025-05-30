
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "../services/api";

const DeviceContext = createContext(undefined);

export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Function to fetch latest data
  const refreshData = async () => {
  try {
    const data = await api.getLatestData(selectedDevice);
    setDeviceData(data);

    const uniqueDevices = Array.from(new Set(data.map(item => item.deviceId)));
    setDevices(uniqueDevices);

    setError(null);
  } catch (err) {
    console.error("Error fetching device data:", err);
    setError("Failed to load device data. Please try again later.");
    toast({
      title: "Error fetching data",
      description: "Could not retrieve device data from server",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
  // Function to add new data 
  const addData = async (data) => {
    try {
      const response = await fetch(`http://localhost:5000/api/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      toast({
        title: "Data added",
        description: `New data for device ${data.deviceId} saved successfully`,
      });
      
      // Refresh data after adding new entry
      await refreshData();
    } catch (err) {
      console.error("Error adding device data:", err);
      toast({
        title: "Error adding data",
        description: "Could not save device data to server",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Initial data fetch and polling setup
  useEffect(() => {
    refreshData();

    // Poll for new data every 5 seconds
    const intervalId = setInterval(refreshData, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedDevice]);

  const contextValue = {
    devices,
    deviceData,
    loading,
    error,
    selectedDevice,
    setSelectedDevice,
    refreshData,
    addData,
  };

  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceData = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDeviceData must be used within a DeviceProvider");
  }
  return context;
};
