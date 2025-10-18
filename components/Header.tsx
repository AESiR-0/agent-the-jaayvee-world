'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from '@/lib/firebaseClient';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ displayName?: string; agentId?: string } | null>(null);

  useEffect(() => {
    const agentId = localStorage.getItem('agentId');
    const displayName = localStorage.getItem('displayName');
    if (agentId && displayName) {
      setUser({ displayName, agentId });
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut();
      
      // Clear local storage
      localStorage.removeItem('agentId');
      localStorage.removeItem('userId');
      localStorage.removeItem('displayName');
      localStorage.removeItem('firebaseToken');
      
      console.log('✅ User logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear local storage and redirect even if Firebase signout fails
      localStorage.removeItem('agentId');
      localStorage.removeItem('userId');
      localStorage.removeItem('displayName');
      localStorage.removeItem('firebaseToken');
      router.push('/login');
    }
  };

  return (
    <header className="bg-white border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">
              The Jaayvee World
            </h1>
            <span className="ml-4 text-sm text-accent">Agents Dashboard</span>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-foreground">
                Welcome, {user.displayName}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-accent text-accent rounded-xl hover:bg-accent hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
