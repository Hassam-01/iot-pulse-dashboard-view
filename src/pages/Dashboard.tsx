
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeviceStatusCard from "@/components/DeviceStatusCard";
import DeviceDataChart from "@/components/DeviceDataChart";
import DeviceSelector from "@/components/DeviceSelector";
import { useDeviceData } from "@/contexts/DeviceContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gauge, Settings, User } from "lucide-react";

const Dashboard: React.FC = () => {
  const { deviceData, loading, error, refreshData } = useDeviceData();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Gauge className="h-6 w-6 text-iot-blue" />
          <h1 className="text-2xl font-bold">IoT Pulse Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link to="/admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Admin Console</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <DeviceSelector />
        <div className="text-sm text-muted-foreground">
          {loading ? "Updating data..." : "Data up to date"}
        </div>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
          <Button variant="outline" size="sm" onClick={refreshData} className="ml-2">
            Try Again
          </Button>
        </div>
      ) : loading && deviceData.length === 0 ? (
        <div className="flex justify-center py-12">
          <p>Loading device data...</p>
        </div>
      ) : deviceData.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <p className="mb-4">No device data available</p>
          <Button onClick={refreshData}>Refresh Data</Button>
        </div>
      ) : (
        <>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deviceData.map((device) => (
                  <DeviceStatusCard
                    key={device._id || device.deviceId}
                    deviceId={device.deviceId}
                    temperature={device.temperature}
                    humidity={device.humidity}
                    timestamp={device.timestamp}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <DeviceDataChart />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
