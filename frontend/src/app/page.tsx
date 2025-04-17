'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { EyeIcon, TrashIcon } from 'lucide-react';
import { IDevice } from '@/types';

export default function Home() {
  const [devices, setDevices] = useState([]);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleGetDevices = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/devices`);
      if (!res.ok) throw new Error('Failed to fetch devices');
      const data = await res.json();
      setDevices(data);
    } catch (error) {
      toast('No Device Found', {
        description: 'Failed to fetch devices.',
      });
      console.error('Failed to fetch devices', error);
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDeviceName }),
      });

      if (res.ok) {
        setNewDeviceName('');
        handleGetDevices();
        setIsModalOpen(false);
        toast('Success', {
          description: 'Device added successfully.',
        });
      } else {
        throw new Error('Failed to add device');
      }
    } catch (error) {
      toast('Error', {
        description: 'Failed to add device.',
      });
      console.error('Failed to add device', error);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/devices/${deviceId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        handleGetDevices();
        toast('Success', {
          description: 'Device deleted successfully.',
        });
      } else {
        throw new Error('Failed to delete device');
      }
    } catch (error) {
      toast('Error', {
        description: 'Failed to delete device.',
      });
      console.error('Failed to delete device', error);
    }
  };

  useEffect(() => {
    handleGetDevices();
  }, []);

  return (
    <div className="p-6 space-y-8 bg-white text-zinc-800">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-green-600">Bugs & Glitches</h1>
          <p className="text-gray-500">Manage your devices.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-100 text-green-600 hover:bg-green-200">
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Add New Device</DialogTitle>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="device-name" className="text-sm font-medium text-gray-700">
                  Device Name
                </label>
                <input
                  id="device-name"
                  type="text"
                  placeholder="Enter Device Name"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="border px-4 py-2 rounded bg-zinc-50"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-100 text-green-600 hover:bg-green-200">
                  Add Device
                </Button>
                <DialogClose asChild>
                  <Button type="button" className="text-gray-600 hover:text-gray-800">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full table-auto border border-gray-200 rounded-lg shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left">Device Name</TableHead>
              <TableHead className="px-4 py-2 text-left">Status</TableHead>
              <TableHead className="px-4 py-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.length > 0 ? (
              devices.map((device: IDevice) => (
                <TableRow key={device._id} className="border-t">
                  <TableCell className="px-4 py-2">{device.name}</TableCell>
                  <TableCell className="px-4 py-2">{device.status ?? 'Active'}</TableCell>
                  <TableCell className="px-4 py-2 flex justify-end items-center space-x-4">
                    <Button variant="outline" onClick={() => router.push(`/${device._id}`)}>
                      <EyeIcon className="h-6 w-6 text-green-600" />
                    </Button>
                    <Button variant="outline" onClick={() => handleDeleteDevice(device._id)}>
                      <TrashIcon className="h-6 w-6 text-red-600 hover:text-red-700" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 px-4 py-6">
                  No devices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
