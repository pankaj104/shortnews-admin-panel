import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { auth } from '@/lib/firebase';

const FirebaseCheck = ({ children }: { children: React.ReactNode }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if Firebase is properly initialized
    try {
      // If we can access the auth object and it has a valid config, Firebase is configured
      if (auth && auth.app && auth.app.options) {
        const config = auth.app.options;
        
        // Check if essential Firebase config properties exist and are not placeholder values
        const hasValidConfig = 
          config.apiKey && 
          config.authDomain && 
          config.projectId &&
          config.apiKey !== 'your-api-key-here' &&
          config.authDomain !== 'your-project.firebaseapp.com' &&
          config.projectId !== 'your-project-id';
        
        setIsConfigured(hasValidConfig);
      } else {
        setIsConfigured(false);
      }
    } catch (error) {
      console.error('Firebase configuration error:', error);
      setIsConfigured(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p className="font-semibold">Firebase Configuration Error</p>
              <p>
                There seems to be an issue with your Firebase configuration. 
                Please check that your Firebase project is properly set up.
              </p>
              <p>
                Make sure you have:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Created a Firebase project</li>
                <li>Enabled Authentication with Email/Password</li>
                <li>Added your web app to the Firebase project</li>
                <li>Updated the configuration in <code>src/lib/firebase.ts</code></li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default FirebaseCheck; 