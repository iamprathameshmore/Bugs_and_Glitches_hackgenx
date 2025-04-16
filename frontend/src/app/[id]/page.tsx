'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner'
import { Button } from '@/components/ui/button';

export default function DeviceDetailPage() {
  const { id } = useParams();

  const [device, setDevice] = useState<any>(null);
  const [readings, setReadings] = useState<any[]>([]);

  const fetchDevice = async () => {
    try {
      const res = await fetch(`http://localhost:4213/devices/${id}`);
      if (!res.ok) throw new Error('Failed to fetch device');
      const data = await res.json();
      setDevice(data);
    } catch (error) {
      toast('Error',{
        
        description: 'Failed to fetch device info.',
      });
      console.error(error);
    }
  };

  const fetchReadings = async () => {
    try {
      const res = await fetch(`http://localhost:4213/devices/${id}/readings`);
      if (!res.ok) throw new Error('Failed to fetch readings');
      const data = await res.json();
      setReadings(data);
    } catch (error) {
      toast('Error',{
        description: 'Failed to fetch readings.',
      });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDevice();
    fetchReadings();
    const interval = setInterval(fetchReadings, 3000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Device Details</h1>
        {device ? (
          <div className="mt-4 space-y-2">
            <p><strong>ID:</strong> {device.id}</p>
            <p><strong>Name:</strong> {device.name}</p>
            <p><strong>Status:</strong> {device.status ?? 'Active'}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading device info...</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">Live Readings</h2>
        {readings.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {readings.map((reading: any, index: number) => (
              <li
                key={index}
                className="border p-3 rounded-md shadow-sm bg-white"
              >
                <p><strong>Time:</strong> {new Date(reading.timestamp).toLocaleString()}</p>
                <p><strong>Value:</strong> {reading.value}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No readings available.</p>
        )}
      </div>

      <Button onClick={fetchReadings}>Refresh Now</Button>
    </div>
  );
}
