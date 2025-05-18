
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Thermometer } from "lucide-react";

interface DeviceStatusCardProps {
  deviceId: string;
  temperature: number;
  humidity: number;
  timestamp?: string;
}

const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({
  deviceId,
  temperature,
  humidity,
  timestamp,
}) => {
  // Determine temperature status
  const getTempStatus = () => {
    if (temperature > 30) return "status-warning";
    if (temperature < 10) return "status-warning";
    return "status-online";
  };

  // Determine humidity status
  const getHumidityStatus = () => {
    if (humidity > 80) return "status-warning";
    if (humidity < 20) return "status-warning";
    return "status-online";
  };

  // Format timestamp
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString() 
    : 'No timestamp';
  
  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString()
    : '';

  return (
    <Card className="animate-fade-in data-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Device {deviceId}</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="status-indicator status-online mr-2"></span>
            Online
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Last updated: {formattedTime} {formattedDate}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Thermometer size={20} className="text-iot-orange" />
            <div>
              <div className="text-sm font-medium">Temperature</div>
              <div className="flex items-center">
                <span className={`animated-value text-xl font-bold`}>
                  {temperature}°C
                </span>
                <span className={`status-indicator ${getTempStatus()} ml-2`}></span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge size={20} className="text-iot-blue" />
            <div>
              <div className="text-sm font-medium">Humidity</div>
              <div className="flex items-center">
                <span className={`animated-value text-xl font-bold`}>
                  {humidity}%
                </span>
                <span className={`status-indicator ${getHumidityStatus()} ml-2`}></span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatusCard;
