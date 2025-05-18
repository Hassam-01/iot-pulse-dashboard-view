
import React, { useState } from "react";
import { useDeviceData } from "@/contexts/DeviceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const DeviceDataForm: React.FC = () => {
  const { addData } = useDeviceData();
  
  const [formState, setFormState] = useState({
    deviceId: "",
    temperature: "",
    humidity: "",
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formState.deviceId.trim()) {
      toast({
        title: "Validation Error",
        description: "Device ID is required",
        variant: "destructive",
      });
      return;
    }
    
    const temperature = parseFloat(formState.temperature);
    const humidity = parseFloat(formState.humidity);
    
    if (isNaN(temperature) || isNaN(humidity)) {
      toast({
        title: "Validation Error",
        description: "Temperature and humidity must be valid numbers",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await addData({
        deviceId: formState.deviceId,
        temperature,
        humidity,
      });
      
      // Clear form after successful submission
      setFormState({
        deviceId: "",
        temperature: "",
        humidity: "",
      });
    } catch (error) {
      console.error("Failed to submit device data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Device Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deviceId">Device ID</Label>
            <Input
              id="deviceId"
              name="deviceId"
              placeholder="Enter device ID"
              value={formState.deviceId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              placeholder="Enter temperature"
              value={formState.temperature}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="humidity">Humidity (%)</Label>
            <Input
              id="humidity"
              name="humidity"
              type="number"
              step="0.1"
              placeholder="Enter humidity"
              value={formState.humidity}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Data"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeviceDataForm;
