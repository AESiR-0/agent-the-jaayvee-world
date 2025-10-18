'use client';

import { useState } from 'react';

export default function DevHelper() {
  const [showHelper, setShowHelper] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowHelper(!showHelper)}
        className="bg-accent text-white p-3 rounded-full shadow-lg hover:bg-accent/90 transition-colors"
        title="Development Helper"
      >
        🧪
      </button>
      
      {showHelper && (
        <div className="absolute bottom-16 right-0 bg-white border border-border rounded-xl shadow-lg p-4 w-80">
          <h3 className="font-semibold text-foreground mb-3">Development Helper</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <strong>Test Phone Numbers:</strong>
              <ul className="mt-1 space-y-1 text-foreground/70">
                <li>• <code>+91 9876543210</code> (OTP: 123456)</li>
                <li>• <code>+91 9876543211</code> (OTP: 123456)</li>
                <li>• <code>+91 9876543212</code> (OTP: 123456)</li>
                <li>• <code>+91 9999999999</code> (OTP: 123456)</li>
                <li>• <code>+91 8888888888</code> (OTP: 123456)</li>
              </ul>
            </div>
            
            <div>
              <strong>Rate Limit Solutions:</strong>
              <ul className="mt-1 space-y-1 text-foreground/70">
                <li>• Wait 1-2 hours</li>
                <li>• Use different phone number</li>
                <li>• Clear browser cache</li>
                <li>• Use test numbers above</li>
              </ul>
            </div>
            
            <div>
              <strong>Backend API:</strong>
              <p className="mt-1 text-foreground/70">
                Backend at <code>https://talaash.thejaayveeworld.com/api</code> may not be available. 
                Development mode uses mock responses.
              </p>
            </div>
            
            <div>
              <strong>Firebase Console:</strong>
              <p className="mt-1 text-foreground/70">
                Make sure Phone Authentication is enabled and your domain is authorized.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowHelper(false)}
            className="mt-3 w-full px-3 py-1 text-xs bg-accent-light text-accent rounded hover:bg-accent hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
