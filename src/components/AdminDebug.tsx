import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../services/adminService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface AdminDebugProps {
  onNavigate: (page: string) => void;
}

export function AdminDebug({ onNavigate }: AdminDebugProps) {
  const { currentUser } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-[#1a1a1a] border-[#CBA135]/40 text-[#F5F5F5] w-80">
        <CardHeader>
          <CardTitle className="text-[#CBA135] text-sm">🔍 Admin Debug Panel</CardTitle>
          <CardDescription className="text-xs text-[#F5F5F5]/60">
            Debugging admin access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <strong className="text-[#CBA135]">Login Status:</strong>
            <div className="mt-1 p-2 bg-[#121212] rounded">
              {currentUser ? '✅ Logged In' : '❌ Not Logged In'}
            </div>
          </div>

          {currentUser && (
            <>
              <div>
                <strong className="text-[#CBA135]">User Email:</strong>
                <div className="mt-1 p-2 bg-[#121212] rounded break-all">
                  {currentUser.email}
                </div>
              </div>

              <div>
                <strong className="text-[#CBA135]">User ID (UID):</strong>
                <div className="mt-1 p-2 bg-[#121212] rounded break-all font-mono text-[10px]">
                  {currentUser.uid}
                </div>
              </div>

              <div>
                <strong className="text-[#CBA135]">Expected UID:</strong>
                <div className="mt-1 p-2 bg-[#121212] rounded break-all font-mono text-[10px]">
                  iHnO8vOgbWUqvglNJioU5KMH6IB3
                </div>
              </div>

              <div>
                <strong className="text-[#CBA135]">UIDs Match:</strong>
                <div className="mt-1 p-2 bg-[#121212] rounded">
                  {currentUser.uid === 'iHnO8vOgbWUqvglNJioU5KMH6IB3' ? '✅ Yes' : '❌ No'}
                </div>
              </div>

              <div>
                <strong className="text-[#CBA135]">Admin Status:</strong>
                <div className="mt-1 p-2 bg-[#121212] rounded">
                  {isAdmin(currentUser.uid) ? '✅ IS ADMIN' : '❌ NOT ADMIN'}
                </div>
              </div>

              {isAdmin(currentUser.uid) && (
                <Button
                  onClick={() => onNavigate('admin')}
                  className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] text-[#121212] mt-2"
                >
                  Go to Admin Dashboard
                </Button>
              )}
            </>
          )}

          {!currentUser && (
            <Button
              onClick={() => onNavigate('login')}
              className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] text-[#121212] mt-2"
            >
              Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
