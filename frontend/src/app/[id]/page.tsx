'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from 'qrcode';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { IDevice, IReading } from '@/types';
import Image from 'next/image';

export default function DeviceDetailPage() {
  const { id } = useParams();
  const [device, setDevice] = useState<IDevice>();
  const [readings, setReadings] = useState<IReading[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchDevice = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/devices/${id}`);
      if (!res.ok) throw new Error('Failed to fetch device');
      const data = await res.json();
      setDevice(data);
    } catch (error) {
      toast('Error', { description: 'Failed to fetch device info.' });
      console.error(error);
    }
  };

  const fetchReadings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/readings/${id}`);
      if (!res.ok) throw new Error('Failed to fetch readings');
      const data = await res.json();
      setReadings(data.readings);
    } catch (error) {
      toast('Error', { description: 'Failed to fetch readings.' });
      console.error(error);
    }
  };

  const generateQRCode = async () => {
    try {
      const qr = await QRCode.toDataURL(id as string);
      setQrDataUrl(qr);
      setOpen(true);
    } catch (error) {
      toast('Error', { description: 'QR code generation failed.' });
      console.error(error);
    }
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `device-${id}-qr.png`;
    a.click();
  };

  useEffect(() => {
    fetchDevice();
    fetchReadings();
    const interval = setInterval(fetchReadings, 5000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="p-6 space-y-6 text-zinc-900 mx-48 text-xs">
      <div className="bg-zinc-100 p-6 rounded-md shadow">
        <h1 className="text-3xl font-semibold text-green-500">Device Details</h1>
        {device ? (
          <div className="mt-4 space-y-2">
            <p><strong>ID:</strong> {device._id}</p>
            <p><strong>Name:</strong> {device.name}</p>
            <p><strong>Status:</strong> {device.status ?? 'Active'}</p>
            <p><strong>API key:</strong> {process.env.NEXT_PUBLIC_API_URL}/api/readings/{device._id}</p>
          </div>
        ) : (
          <p className="text-zinc-400">Loading device info...</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button className="bg-zinc-200 hover:bg-zinc-300 text-zinc-900" onClick={fetchReadings}>Refresh Now</Button>
        <Button className="bg-green-100 hover:bg-green-200 text-green-700" onClick={generateQRCode}>Generate QR Code</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm text-center p-4 rounded-lg shadow-lg bg-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-900">Device QR Code</DialogTitle>
          </DialogHeader>
          {qrDataUrl && (
            <>
              <Image src={qrDataUrl} alt="QR Code" className="mx-auto w-48 h-48 rounded-md shadow-lg" />
              <Button 
                onClick={downloadQRCode} 
                className="mt-4 w-full bg-green-100 hover:bg-green-200 text-green-700"
              >
                Download QR Code
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="bg-zinc-100 rounded-md shadow p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4 text-center text-green-600">📈 Sensor Readings Over Time</h2>
        {readings.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
                stroke="#555"
              />
              <YAxis stroke="#555" />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
              <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity (%)" />
              <Line type="monotone" dataKey="airQuality" stroke="#ff7300" name="Air Quality (AQI)" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-zinc-400 text-center">No data to display.</p>
        )}
      </div>

      <div className="bg-zinc-100 text-zinc-900 p-6 rounded-md font-mono shadow mt-6">
        <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
          $ Live Readings
        </h2>
        {readings.length > 0 ? (
          <div className="space-y-3">
            {readings.map((reading: IReading, index: number) => (
              <div
                key={index}
                className="bg-zinc-200 p-3 rounded-md shadow-sm min-w-max flex flex-wrap gap-6 items-start"
              >
                <p>
                  <span className="text-zinc-900">[Time]</span>{' '}
                  {new Date(reading.timestamp).toLocaleString()}
                </p>
                <p>
                  <span className="text-zinc-900">[Temperature]</span> {reading.temperature}°C
                </p>
                <p>
                  <span className="text-zinc-900">[Humidity]</span> {reading.humidity}%
                </p>
                <p>
                  <span className="text-zinc-900">[Air Quality]</span> {reading.airQuality} AQI
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-center">No readings available...</p>
        )}
      </div>
    </div>
  );
}
