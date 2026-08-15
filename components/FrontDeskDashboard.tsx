'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, UserCheck, Calendar, Phone, Globe, FileText } from 'lucide-react';

export default function FrontDeskDashboard() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sync/guest');
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error('Failed to fetch PMS registry:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter((reg) => {
    const name = reg.primaryGuest?.fullName || '';
    const mobile = reg.primaryGuest?.contact?.mobileNumber || '';
    const id = reg.registrationId || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || mobile.includes(query) || id.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Front Desk PMS Registry</CardTitle>
              <CardDescription>
                Reception intake log ({registrations.length} total synced)
              </CardDescription>
            </div>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={fetchRegistrations} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Log
          </Button>
        </CardHeader>

        <div className="relative">
          <Input
            type="text"
            placeholder="Search by Guest Name, Mobile Number, or Registration ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-text-muted pointer-events-none" />
        </div>
      </Card>

      {filteredRegistrations.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-40" />
          <h3 className="text-lg font-bold text-text-main font-heading mb-1">No PMS intake records found</h3>
          <p className="text-sm text-text-muted font-body">
            {searchQuery ? 'No registrations match your search query.' : 'Submitted kiosk forms will automatically appear here.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistrations.map((reg) => {
            const isForeigner = reg.primaryGuest?.nationality?.toLowerCase() !== 'indian';
            return (
              <Card key={reg.registrationId} className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-primary bg-background px-2.5 py-1 rounded border border-gray-200">
                    {reg.registrationId}
                  </span>
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                      isForeigner ? 'bg-secondary/15 text-secondary border border-secondary/30' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {reg.primaryGuest?.nationality || 'Indian'}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-text-main font-heading">{reg.primaryGuest?.fullName}</h4>

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

                {reg.signatureDataUrl && (
                  <div className="bg-background rounded-lg p-2 text-center border border-gray-200 mt-2">
                    <span className="text-[9px] uppercase font-bold text-text-muted block mb-1 font-body">Digital Signature</span>
                    <img src={reg.signatureDataUrl} alt="Signature" className="max-h-12 mx-auto object-contain" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
