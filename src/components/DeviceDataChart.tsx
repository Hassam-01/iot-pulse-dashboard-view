
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { api } from "@/services/api";
import { useDeviceData } from "@/contexts/DeviceContext";

interface ChartData {
  name: string;
  temperature: number;
  humidity: number;
}

const DeviceDataChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const { selectedDevice, deviceData } = useDeviceData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!selectedDevice) {
        // If no device is selected, use latest data for all devices
        const formattedData = deviceData.map(data => ({
          name: data.deviceId,
          temperature: data.temperature,
          humidity: data.humidity
        }));
        setChartData(formattedData);
        return;
      }

      setLoading(true);
      try {
        const historyData = await api.getDeviceHistory(selectedDevice, 10);
        
        // Format data for chart
        const formattedData = historyData.map((item: any) => ({
          name: new Date(item.timestamp).toLocaleTimeString(),
          temperature: item.temperature,
          humidity: item.humidity,
        })).reverse(); // Reverse to show oldest to newest
        
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [selectedDevice, deviceData]);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>
          {selectedDevice ? `Device ${selectedDevice} Data` : "All Devices Overview"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line">
          <TabsList className="mb-4">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="line">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p>Loading chart data...</p>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    activeDot={{ r: 8 }}
                    name="Temperature (°C)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    name="Humidity (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p>No data available for selected device</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="comparison">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Temperature (°C)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ef4444"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-medium mb-2">Humidity (%)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeviceDataChart;
