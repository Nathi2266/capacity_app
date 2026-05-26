import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-sm p-8 text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">User not registered</h1>
          <p className="text-sm text-muted-foreground">
            This account is not registered for this app yet.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link to="/register">Go to registration</Link>
        </Button>
      </div>
    </div>
  );
}
