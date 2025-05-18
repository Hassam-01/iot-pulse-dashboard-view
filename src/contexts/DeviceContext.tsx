
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface DeviceData {
  _id?: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  timestamp?: string;
}

interface DeviceContextType {
  devices: string[];
  deviceData: DeviceData[];
  loading: boolean;
  error: string | null;
  selectedDevice: string | null;
  setSelectedDevice: (deviceId: string | null) => void;
  refreshData: () => Promise<void>;
  addData: (data: DeviceData) => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<string[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  // Function to fetch latest data
  const refreshData = async () => {
    try {
      const endpoint = selectedDevice 
        ? `/api/data/latest/${selectedDevice}` 
        : "/api/data/latest";
        
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setDeviceData(data);
      
      // Extract unique device IDs
      const uniqueDevices = Array.from(
        new Set(data.map((item: DeviceData) => item.deviceId))
      );
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
  const addData = async (data: DeviceData) => {
    try {
      const response = await fetch("/api/data", {
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

  const contextValue: DeviceContextType = {
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

export const useDeviceData = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDeviceData must be used within a DeviceProvider");
  }
  return context;
};
