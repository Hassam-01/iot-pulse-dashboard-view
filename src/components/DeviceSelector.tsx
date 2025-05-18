
import React from "react";
import { useDeviceData } from "@/contexts/DeviceContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const DeviceSelector: React.FC = () => {
  const { devices, selectedDevice, setSelectedDevice, refreshData } = useDeviceData();

  const handleDeviceChange = (value: string) => {
    setSelectedDevice(value === "all" ? null : value);
  };

  return (
    <div className="flex items-center space-x-2">
      <Select 
        value={selectedDevice || "all"} 
        onValueChange={handleDeviceChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Device" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Devices</SelectItem>
          {devices.map((device) => (
            <SelectItem key={device} value={device}>
              Device {device}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        variant="outline" 
        onClick={() => refreshData()}
        className="flex items-center gap-1"
      >
        Refresh
      </Button>
    </div>
  );
};

export default DeviceSelector;
