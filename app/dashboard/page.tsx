'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import { UpdatesPanel } from '@/components/UpdatesPanel';
import { fetchWithAuth, API_BASE_URL } from '@/lib/utils';
import { QrCode, Users, DollarSign } from 'lucide-react';

interface DashboardData {
  qrCount: number;
  merchantCount: number;
  commission: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({ qrCount: 0, merchantCount: 0, commission: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const agentId = localStorage.getItem('agentId');
    if (!agentId) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const agentId = localStorage.getItem('agentId');
      
      const [qrResponse, merchantsResponse, commissionsResponse] = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/agents/qr/list?agentId=${agentId}`),
        fetchWithAuth(`${API_BASE_URL}/agents/merchants?agentId=${agentId}`),
        fetchWithAuth(`${API_BASE_URL}/agents/commissions?agentId=${agentId}`)
      ]);

      setData({
        qrCount: qrResponse.data?.length || 0,
        merchantCount: merchantsResponse.data?.length || 0,
        commission: commissionsResponse.data?.totalCommission || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-foreground/70">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-foreground/70 mt-2">Overview of your agent performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total QRs"
            value={data.qrCount}
            icon={<QrCode className="h-8 w-8" />}
          />
          <StatCard
            title="Merchants Onboarded"
            value={data.merchantCount}
            icon={<Users className="h-8 w-8" />}
          />
          <StatCard
            title="Commission Earned"
            value={`₹${data.commission.toLocaleString()}`}
            icon={<DollarSign className="h-8 w-8" />}
          />
        </div>

        {/* Updates Panel */}
        <div className="mb-8">
          <UpdatesPanel 
            audience="agent" 
            apiBaseUrl="https://thejaayveeworld.com"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-border shadow-soft p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/qrs')}
                className="w-full px-4 py-3 border border-accent text-accent rounded-xl hover:bg-accent hover:text-white transition-colors text-left"
              >
                View QR Codes
              </button>
              <button
                onClick={() => router.push('/merchants')}
                className="w-full px-4 py-3 border border-accent text-accent rounded-xl hover:bg-accent hover:text-white transition-colors text-left"
              >
                Manage Merchants
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="w-full px-4 py-3 border border-accent text-accent rounded-xl hover:bg-accent hover:text-white transition-colors text-left"
              >
                View Profile
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-soft p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="text-sm text-foreground/70">
                No recent activity to display
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
