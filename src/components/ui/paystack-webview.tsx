import React, { useEffect, useState, useRef } from "react";
import { X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface PaystackWebviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorizationUrl: string | null;
  onSuccess?: () => void;
  onClose?: () => void;
  onError?: (error: string) => void;
}

export function PaystackWebview({
  open,
  onOpenChange,
  authorizationUrl,
  onSuccess,
  onClose,
  onError,
}: PaystackWebviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const paymentReferenceRef = useRef<string | null>(null);

  useEffect(() => {
    if (open && authorizationUrl) {
      setLoading(true);
      setError(null);
      // Extract reference from URL if available
      const urlParams = new URLSearchParams(authorizationUrl.split('?')[1]);
      paymentReferenceRef.current = urlParams.get('reference') || localStorage.getItem('depositRef');
    }
  }, [open, authorizationUrl]);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setError(null);
    }
  }, [open]);

  // Listen for postMessage from Paystack
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process messages from Paystack domain
      if (!event.origin.includes('paystack')) {
        return;
      }

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        if (data.status === 'success' || data.event === 'success') {
          setLoading(false);
          if (onSuccess) {
            onSuccess();
          }
          // Close after a short delay to show success
          setTimeout(() => {
            onOpenChange(false);
            if (onClose) onClose();
          }, 1000);
        } else if (data.status === 'error' || data.event === 'error') {
          setError(data.message || 'Payment failed');
          setLoading(false);
          if (onError) {
            onError(data.message || 'Payment failed');
          }
        }
      } catch (err) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSuccess, onError, onClose, onOpenChange]);

  // Monitor iframe load
  const handleIframeLoad = () => {
    setLoading(false);
    // Check if we're on a success/error page by checking the URL
    if (iframeRef.current?.contentWindow) {
      try {
        const iframeUrl = iframeRef.current.contentWindow.location.href;
        if (iframeUrl.includes('success') || iframeUrl.includes('callback')) {
          // Payment might be successful, trigger success handler
          if (onSuccess) {
            setTimeout(() => {
              onSuccess();
              onOpenChange(false);
              if (onClose) onClose();
            }, 500);
          }
        }
      } catch (e) {
        // Cross-origin restrictions, ignore
      }
    }
  };

  const handleClose = () => {
    // Store reference to allow reopening
    if (paymentReferenceRef.current) {
      localStorage.setItem('depositRef', paymentReferenceRef.current);
    }
    onOpenChange(false);
    if (onClose) onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background">
      {/* Header with close button */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background border-b px-4 py-3 shadow-sm">
        <h2 className="text-lg font-semibold">Complete Payment</h2>
        <div className="flex items-center gap-2">
          {authorizationUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (authorizationUrl) {
                  window.open(authorizationUrl, '_blank');
                }
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-9 w-9"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-sm text-muted-foreground">Loading payment page...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-destructive text-destructive-foreground px-4 py-2 rounded-md shadow-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Iframe */}
      {authorizationUrl && (
        <iframe
          ref={iframeRef}
          src={authorizationUrl}
          className="w-full h-[calc(100vh-4rem)] border-0"
          title="Paystack Payment"
          onLoad={handleIframeLoad}
          allow="payment"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation"
        />
      )}

      {!authorizationUrl && (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No payment URL available</p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

