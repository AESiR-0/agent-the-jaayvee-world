'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';

interface ProfileData {
  walletBalance: number;
  referralLink: string;
  level: string;
  totalCommission: number;
  displayName: string;
  agentId: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const agentId = localStorage.getItem('agentId');
    const userId = localStorage.getItem('userId');
    const displayName = localStorage.getItem('displayName');
    
    if (!agentId || !userId || !displayName) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const agentId = localStorage.getItem('agentId');
      
      const [profileResponse, referralResponse] = await Promise.all([
        fetch(`https://talaash.thejaayveeworld.com/api/agents/profile?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`,
          },
        }),
        fetch(`https://talaash.thejaayveeworld.com/api/agents/referral?agentId=${agentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`,
          },
        })
      ]);

      if (!profileResponse.ok || !referralResponse.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const profileData = await profileResponse.json();
      const referralData = await referralResponse.json();

      setProfile({
        walletBalance: profileData.data?.walletBalance || 0,
        referralLink: referralData.data?.referralLink || '',
        level: profileData.data?.level || 'Bronze',
        totalCommission: profileData.data?.totalCommission || 0,
        displayName: localStorage.getItem('displayName') || '',
        agentId: localStorage.getItem('agentId') || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-foreground/70">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-foreground/70">Failed to load profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-foreground/70 mt-2">Manage your account and view earnings</p>
        </div>

        <ProfileCard profile={profile} />
      </main>
    </div>
  );
}
