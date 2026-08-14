'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GuestDetailModal from '@/components/GuestDetailModal';
import {
  UserCheck,
  RefreshCw,
  Download,
  Search,
  LogOut,
  Calendar,
  Phone,
  Globe,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Eye,
  PieChart,
  Key,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'synced' | 'failed'>('all');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/registrations');
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      } else if (res.status === 401) {
        router.push('/login?callbackUrl=/admin');
      }
    } catch (err) {
      console.error('Failed to fetch admin registry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleRetrySync = async (registrationId: string) => {
    setRetryingId(registrationId);
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry', registrationId }),
      });

      if (res.ok) {
        await fetchRegistrations();
        if (selectedRecord && selectedRecord.registrationId === registrationId) {
          setSelectedRecord((prev: any) => (prev ? { ...prev, syncStatus: 'synced' } : null));
        }
      } else {
        alert('Failed to retry PMS sync');
      }
    } catch (err) {
      alert('Error triggering PMS retry');
    } finally {
      setRetryingId(null);
    }
  };

  const handleUpdateRoomNumber = async (registrationId: string, roomNumber: string) => {
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateRoomNumber', registrationId, roomNumber }),
      });

      if (res.ok) {
        await fetchRegistrations();
        if (selectedRecord && selectedRecord.registrationId === registrationId) {
          setSelectedRecord((prev: any) =>
            prev
              ? {
                  ...prev,
                  roomNumber,
                  primaryGuest: { ...prev.primaryGuest, roomNumber },
                }
              : null
          );
        }
      } else {
        alert('Failed to update room number');
      }
    } catch (err) {
      alert('Error updating room number');
    }
  };

  const syncedCount = registrations.filter((r) => r.syncStatus === 'synced').length;
  const failedCount = registrations.filter((r) => r.syncStatus === 'failed').length;

  // Channel Analytics Breakdown
  const channelBreakdown = registrations.reduce((acc: Record<string, number>, reg) => {
    const channel = reg.primaryGuest?.travel?.referralChannel || 'Google Search / Maps';
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {});

  const filteredRegistrations = registrations.filter((reg) => {
    const name = reg.primaryGuest?.fullName || '';
    const mobile = reg.primaryGuest?.contact?.mobileNumber || '';
    const id = reg.registrationId || '';
    const room = reg.roomNumber || reg.primaryGuest?.roomNumber || '';
    const channel = reg.primaryGuest?.travel?.referralChannel || 'Google Search / Maps';
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      name.toLowerCase().includes(query) ||
      mobile.includes(query) ||
      id.toLowerCase().includes(query) ||
      room.toLowerCase().includes(query);

    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'synced'
        ? reg.syncStatus === 'synced'
        : reg.syncStatus === 'failed';

    const matchesChannel = selectedChannelFilter === 'all' || channel === selectedChannelFilter;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = ["Registration ID", "Date", "Time", "Full Name", "Mobile", "Nationality", "Room Number", "Status", "Total Co-Guests"];
    const rows = registrations.map(reg => {
      const g = reg.primaryGuest || { contact: {} };
      const d = new Date(reg.createdAt);
      return [
        reg.registrationId,
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
        `"${g.fullName || ''}"`,
        g.contact?.mobileNumber || '',
        g.nationality || '',
        reg.roomNumber || '',
        reg.syncStatus || '',
        reg.coGuests ? reg.coGuests.length : 0
      ].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hotel_guests_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getChannelBadgeColor = (channel?: string) => {
    if (!channel) return 'bg-gray-100 text-gray-800';
    if (channel.includes('Cab') || channel.includes('Auto')) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (channel.includes('Google')) return 'bg-blue-100 text-blue-900 border-blue-300';
    if (channel.includes('Recommendation')) return 'bg-purple-100 text-purple-900 border-purple-300';
    if (channel.includes('OTA') || channel.includes('Booking')) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (channel.includes('Social')) return 'bg-pink-100 text-pink-900 border-pink-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="no-print">
      {/* Top Admin Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-surface border border-gray-200 p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-main">
            Front Desk Portal & PMS Gateway
          </h1>
          <p className="text-sm text-text-muted font-body mt-0.5">
            Protected Staff Dashboard • Room Assignment & Police Form-C Printable Generator
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <Button type="button" variant="outline" size="sm" onClick={handleExportCSV} className="bg-white">
            <Download className="w-4 h-4 mr-1.5 text-gray-700" /> Export CSV
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={fetchRegistrations} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-1.5 text-red-600" /> Logout
          </Button>
        </div>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Total Intakes</p>
            <h3 className="text-2xl font-extrabold text-text-main mt-1 font-heading">{registrations.length}</h3>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <UserCheck className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-green-200 bg-green-50/30">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Synced to PMS</p>
            <h3 className="text-2xl font-extrabold text-green-700 mt-1 font-heading">{syncedCount}</h3>
          </div>
          <div className="p-3 bg-green-100 rounded-lg text-green-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-amber-200 bg-amber-50/30">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">PMS Offline / Failed</p>
            <h3 className="text-2xl font-extrabold text-amber-700 mt-1 font-heading">{failedCount}</h3>
          </div>
          <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* How Guests Found Us (Referral Breakdown Card) */}
      <Card className="mb-8 border border-gray-200 shadow-md">
        <CardHeader className="border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary flex-shrink-0">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>How Guests Found Us</CardTitle>
              <CardDescription>Referral source analytics & channel breakdown</CardDescription>
            </div>
          </div>

          {selectedChannelFilter !== 'all' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedChannelFilter('all')}
              className="text-xs text-secondary border-secondary/30 hover:bg-secondary/10 mt-2 sm:mt-0"
            >
              Show All Channels ({registrations.length})
            </Button>
          )}
        </CardHeader>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Cab / Auto Drivers */}
          <div
            onClick={() =>
              setSelectedChannelFilter(
                selectedChannelFilter === 'Cab / Auto / Rickshaw Driver' ? 'all' : 'Cab / Auto / Rickshaw Driver'
              )
            }
            className={`p-3.5 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedChannelFilter === 'Cab / Auto / Rickshaw Driver'
                ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                : 'bg-amber-50/50 border-amber-200/80 hover:border-amber-400 hover:bg-amber-50'
            }`}
          >
            <span className="text-amber-900 font-bold block uppercase tracking-wider text-[10px] sm:text-[11px] truncate">
              🚖 Cab / Auto Drivers
            </span>
            <span className="text-2xl font-extrabold font-heading text-amber-950 mt-1 block">
              {channelBreakdown['Cab / Auto / Rickshaw Driver'] || 0}
            </span>
          </div>

          {/* Google Search / Maps */}
          <div
            onClick={() =>
              setSelectedChannelFilter(
                selectedChannelFilter === 'Google Search / Maps' ? 'all' : 'Google Search / Maps'
              )
            }
            className={`p-3.5 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedChannelFilter === 'Google Search / Maps'
                ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                : 'bg-blue-50/50 border-blue-200/80 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <span className="text-blue-900 font-bold block uppercase tracking-wider text-[10px] sm:text-[11px] truncate">
              🔍 Google Search / Maps
            </span>
            <span className="text-2xl font-extrabold font-heading text-blue-950 mt-1 block">
              {channelBreakdown['Google Search / Maps'] || 0}
            </span>
          </div>

          {/* Recommendation / Word of Mouth */}
          <div
            onClick={() =>
              setSelectedChannelFilter(
                selectedChannelFilter === 'Recommendation / Word of Mouth' ? 'all' : 'Recommendation / Word of Mouth'
              )
            }
            className={`p-3.5 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedChannelFilter === 'Recommendation / Word of Mouth'
                ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                : 'bg-purple-50/50 border-purple-200/80 hover:border-purple-400 hover:bg-purple-50'
            }`}
          >
            <span className="text-purple-900 font-bold block uppercase tracking-wider text-[10px] sm:text-[11px] truncate">
              🤝 Word of Mouth
            </span>
            <span className="text-2xl font-extrabold font-heading text-purple-950 mt-1 block">
              {channelBreakdown['Recommendation / Word of Mouth'] || 0}
            </span>
          </div>

          {/* Hotel Booking Website (OTA) */}
          <div
            onClick={() =>
              setSelectedChannelFilter(
                selectedChannelFilter === 'Hotel Booking Website (OTA)' ? 'all' : 'Hotel Booking Website (OTA)'
              )
            }
            className={`p-3.5 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedChannelFilter === 'Hotel Booking Website (OTA)'
                ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                : 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-400 hover:bg-emerald-50'
            }`}
          >
            <span className="text-emerald-900 font-bold block uppercase tracking-wider text-[10px] sm:text-[11px] truncate">
              🏨 OTA / Booking Site
            </span>
            <span className="text-2xl font-extrabold font-heading text-emerald-950 mt-1 block">
              {channelBreakdown['Hotel Booking Website (OTA)'] || 0}
            </span>
          </div>
        </div>
      </Card>

      {/* Search & Filter Controls */}
      <Card className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by Guest Name, Mobile, Room No, or Reg ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-text-muted pointer-events-none" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={filterStatus === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All ({registrations.length})
            </Button>
            <Button
              type="button"
              variant={filterStatus === 'synced' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('synced')}
            >
              Synced ({syncedCount})
            </Button>
            <Button
              type="button"
              variant={filterStatus === 'failed' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('failed')}
            >
              Failed ({failedCount})
            </Button>
          </div>
        </div>
      </Card>

      {/* Registrations List */}
      {filteredRegistrations.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-40" />
          <h3 className="text-lg font-bold text-text-main font-heading mb-1">No intake records found</h3>
          <p className="text-sm text-text-muted font-body">
            {searchQuery || selectedChannelFilter !== 'all'
              ? 'No registrations match your search or acquisition channel filter'
              : 'New guest check-ins from /check-in will appear here.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistrations.map((reg) => {
            const isForeigner = reg.primaryGuest?.nationality?.toLowerCase() !== 'indian';
            const isFailed = reg.syncStatus === 'failed';
            const roomNum = reg.roomNumber || reg.primaryGuest?.roomNumber;
            const channel = reg.primaryGuest?.travel?.referralChannel || 'Google Search / Maps';
            const referralDetails = reg.primaryGuest?.travel?.referralDetails;

            return (
              <Card
                key={reg.registrationId}
                className="space-y-3 relative cursor-pointer hover:border-primary/40 transition-all flex flex-col justify-between"
                onClick={() => setSelectedRecord(reg)}
              >
                <div className="space-y-3">
                  {/* Header Badges */}
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-xs text-primary bg-background px-2.5 py-1 rounded border border-gray-200">
                      {reg.registrationId}
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                          isFailed
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}
                      >
                        {isFailed ? 'Failed Sync' : 'Synced'}
                      </span>

                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                          isForeigner ? 'bg-secondary/15 text-secondary border border-secondary/30' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {reg.primaryGuest?.nationality || 'Indian'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-lg font-bold text-text-main font-heading">{reg.primaryGuest?.fullName}</h4>

                    <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded border ${roomNum ? 'bg-secondary/15 text-secondary border-secondary/30' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {roomNum ? `ROOM #${roomNum}` : 'UNASSIGNED'}
                    </span>
                  </div>

                  {/* Referral Source Tag */}
                  <div className="inline-block">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${getChannelBadgeColor(channel)}`}>
                      {channel} {referralDetails ? `(${referralDetails})` : ''}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-text-muted font-body">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Check-in: {reg.primaryGuest?.arrivalDateTime || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{reg.primaryGuest?.contact?.mobileNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <span>Co-Guests: {reg.coGuests?.length || 0} pax</span>
                    </div>
                  </div>

                  {/* Digital Signature Preview */}
                  {reg.signatureDataUrl && (
                    <div className="bg-background rounded-lg p-2 text-center border border-gray-200 mt-2">
                      <span className="text-[9px] uppercase font-bold text-text-muted block mb-1 font-body">Digital Signature</span>
                      <img src={reg.signatureDataUrl} alt="Signature" className="max-h-10 mx-auto object-contain" />
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setSelectedRecord(reg)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" /> View & Print Form-C
                  </Button>

                  {isFailed && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRetrySync(reg.registrationId)}
                      disabled={retryingId === reg.registrationId}
                      title="Retry PMS Sync"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${retryingId === reg.registrationId ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      </div>

      {/* Guest Full Detail & Print Modal */}
      {selectedRecord && (
        <GuestDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onRetrySync={handleRetrySync}
          onUpdateRoomNumber={handleUpdateRoomNumber}
          isRetrying={retryingId === selectedRecord.registrationId}
        />
      )}
    </main>
  );
}
