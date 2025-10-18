'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import QRCard from '@/components/QRCard';

interface QRCode {
  id: string;
  code: string;
  status: 'assigned' | 'activated';
  merchantName?: string;
  activationDate?: string;
}

export default function QRsPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const agentId = localStorage.getItem('agentId');
    if (!agentId) {
      router.push('/login');
      return;
    }

    fetchQRCodes();
  }, [router]);

  const fetchQRCodes = async () => {
    try {
      const agentId = localStorage.getItem('agentId');
      const response = await fetch(`https://talaash.thejaayveeworld.com/api/agents/qr/list?agentId=${agentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch QR codes');
      }

      const data = await response.json();
      setQrCodes(data.data || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-foreground/70">Loading QR codes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">QR Codes</h1>
          <p className="text-foreground/70 mt-2">Manage your assigned QR codes</p>
        </div>

        {qrCodes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-foreground/70 mb-4">No QR codes assigned yet</div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 border border-accent text-accent rounded-xl hover:bg-accent hover:text-white transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qr) => (
              <QRCard
                key={qr.id}
                code={qr.code}
                status={qr.status}
                merchantName={qr.merchantName}
                activationDate={qr.activationDate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
