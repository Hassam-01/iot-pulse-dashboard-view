
import React, { useState } from "react";
import { useDeviceData } from "@/contexts/DeviceContext";
import { Link } from "react-router-dom";
import DeviceDataForm from "@/components/DeviceDataForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Database, Settings } from "lucide-react";

const AdminConsole: React.FC = () => {
  const { devices, deviceData } = useDeviceData();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-iot-teal" />
          <h1 className="text-2xl font-bold">Admin Console</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DeviceDataForm />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span>System Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Registered Devices</div>
                <div className="text-2xl font-bold">{devices.length}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Records</div>
                <div className="text-2xl font-bold">{deviceData.length}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Latest Update</div>
                <div className="text-base">
                  {deviceData.length > 0 && deviceData[0].timestamp 
                    ? new Date(deviceData[0].timestamp).toLocaleString() 
                    : 'No data available'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
