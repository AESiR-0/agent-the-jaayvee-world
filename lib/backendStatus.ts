// Backend API status checker
export const checkBackendStatus = async (): Promise<{ isOnline: boolean; error?: string }> => {
  try {
    const response = await fetch('https://talaash.thejaayveeworld.com/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      return { isOnline: true };
    } else {
      return { isOnline: false, error: `HTTP ${response.status}` };
    }
  } catch (error: any) {
    return { 
      isOnline: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Test the auth endpoint specifically
export const testAuthEndpoint = async (): Promise<{ isAvailable: boolean; error?: string }> => {
  try {
    const response = await fetch('https://talaash.thejaayveeworld.com/api/agents/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: 'test_token' }),
    });
    
    // Even if it returns an error, if we get a response, the endpoint exists
    return { isAvailable: true };
  } catch (error: any) {
    return { 
      isAvailable: false, 
      error: error.message || 'Network error' 
    };
  }
};
