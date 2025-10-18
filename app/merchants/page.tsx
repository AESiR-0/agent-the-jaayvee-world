'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import MerchantTable from '@/components/MerchantTable';

interface Merchant {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive';
  activationDate: string;
  qrCode: string;
}

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const agentId = localStorage.getItem('agentId');
    if (!agentId) {
      router.push('/login');
      return;
    }

    fetchMerchants();
  }, [router]);

  const fetchMerchants = async () => {
    try {
      const agentId = localStorage.getItem('agentId');
      const response = await fetch(`https://talaash.thejaayveeworld.com/api/agents/merchants?agentId=${agentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch merchants');
      }

      const data = await response.json();
      setMerchants(data.data || []);
    } catch (error) {
      console.error('Error fetching merchants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-foreground/70">Loading merchants...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Merchants</h1>
          <p className="text-foreground/70 mt-2">Manage your onboarded merchants</p>
        </div>

        <MerchantTable merchants={merchants} />
      </main>
    </div>
  );
}
