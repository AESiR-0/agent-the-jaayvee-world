import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = 'https://talaash.thejaayveeworld.com/api';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('firebaseToken');
  
  try {
    console.log('🌐 Making API request to:', url);
    console.log('🔑 Using token:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    console.log('📡 API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API response successful');
    return data;
  } catch (error: any) {
    console.error('❌ API request failed:', error);
    
    // If it's a network error and we're in development, provide a fallback
    if (process.env.NODE_ENV === 'development' && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      console.log('🧪 Development mode: Using mock API response');
      
      // Return mock data based on the endpoint
      if (url.includes('/agents/me')) {
        return {
          agentId: 'DEV_AGENT_001',
          userId: 'DEV_USER_001',
          displayName: 'Development Agent',
          phoneNumber: '+91 9876543210',
          isActive: true,
          createdAt: new Date().toISOString()
        };
      } else if (url.includes('/agents/qrs')) {
        return {
          qrs: [
            {
              id: 'DEV_QR_001',
              merchantId: 'DEV_MERCHANT_001',
              merchantName: 'Test Merchant',
              status: 'active',
              createdAt: new Date().toISOString()
            }
          ]
        };
      } else if (url.includes('/agents/merchants')) {
        return {
          merchants: [
            {
              id: 'DEV_MERCHANT_001',
              name: 'Test Merchant',
              phone: '+91 9876543210',
              status: 'active',
              createdAt: new Date().toISOString()
            }
          ]
        };
      } else {
        return { message: 'Development mode - Backend not available' };
      }
    }
    
    throw error;
  }
}
