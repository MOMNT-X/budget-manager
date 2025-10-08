import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Clock, CreditCard, Building, Zap, Car, Home, Phone, Wifi, Loader2, Plus, X, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Custom Notification Modal Component
export const  NotificationModal = ({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}) => {
  const icons = {
    success: <CheckCircle className="h-16 w-16 text-green-500" />,
    error: <XCircle className="h-16 w-16 text-red-500" />,
    info: <AlertCircle className="h-16 w-16 text-blue-500" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const buttonColors = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          <div className={`p-4 rounded-full ${colors[type]}`}>
            {icons[type]}
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {message}
            </DialogDescription>
          </div>
          <Button 
            onClick={onClose}
            className={`w-full ${buttonColors[type]} text-white`}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced Toast Notification (Fixed Position)
export const EnhancedToast = ({ 
  isVisible, 
  onClose, 
  type, 
  title, 
  message 
}: { 
  isVisible: boolean; 
  onClose: () => void; 
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="h-6 w-6 text-green-500" />,
    error: <XCircle className="h-6 w-6 text-red-500" />,
    info: <AlertCircle className="h-6 w-6 text-blue-500" />
  };

  const colors = {
    success: 'bg-green-50 border-green-500 shadow-green-200',
    error: 'bg-red-50 border-red-500 shadow-red-200',
    info: 'bg-blue-50 border-blue-500 shadow-blue-200'
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 fade-in">
      <div className={`flex items-start space-x-4 p-4 rounded-lg border-l-4 shadow-lg ${colors[type]} min-w-[350px] max-w-md`}>
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Demo Component
function PayBillsDemo() {
  const [modalNotification, setModalNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const [toastNotification, setToastNotification] = useState<{
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isVisible: false,
    type: 'success',
    title: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  // Show Modal Notification
  const showModalNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setModalNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };

  // Show Toast Notification
  const showToastNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToastNotification({
      isVisible: true,
      type,
      title,
      message
    });
  };

  // Simulate Payment Success
  const handleSuccessPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Choose one: Modal or Toast
      showModalNotification(
        'success',
        'Payment Successful!',
        'Your bill payment of ₦5,000 has been processed successfully. Transaction ID: TXN123456789'
      );
    }, 1500);
  };

  // Simulate Payment Failure
  const handleFailurePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showModalNotification(
        'error',
        'Payment Failed',
        'Insufficient funds in your wallet. Please top up your wallet and try again.'
      );
    }, 1500);
  };

  // Simulate Toast Success
  const handleToastSuccess = () => {
    showToastNotification(
      'success',
      'Transfer Successful',
      'Your transfer of ₦10,000 to John Doe has been completed.'
    );
  };

  // Simulate Toast Error
  const handleToastError = () => {
    showToastNotification(
      'error',
      'Transfer Failed',
      'Unable to verify account number. Please check and try again.'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Enhanced Notification System</h1>
          <p className="text-muted-foreground">
            Choose between Modal dialogs for critical actions or Toast notifications for quick feedback
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Modal Notifications Demo */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Modal Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Perfect for critical actions that require user acknowledgment. Blocks interaction until dismissed.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleSuccessPayment}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Simulate Success
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleFailurePayment}
                  disabled={loading}
                  variant="destructive"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Simulate Failure
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Toast Notifications Demo */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Toast Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Great for quick feedback and non-critical updates. Auto-dismisses after 5 seconds.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleToastSuccess}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Show Success Toast
                </Button>
                <Button 
                  onClick={handleToastError}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Show Error Toast
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Guide */}
        <Card className="shadow-lg border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              How to Implement in Your PayBills Page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-semibold text-green-900 mb-1">✓ For Successful Payments:</p>
                <code className="text-xs text-green-800">
                  showModalNotification('success', 'Payment Successful!', 'Your bill has been paid...')
                </code>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold text-red-900 mb-1">✗ For Failed Payments:</p>
                <code className="text-xs text-red-800">
                  showModalNotification('error', 'Payment Failed', error.message)
                </code>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-blue-900 mb-1">ℹ For Quick Updates:</p>
                <code className="text-xs text-blue-800">
                  showToastNotification('info', 'Account Verified', 'Ready to proceed')
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Components */}
      <NotificationModal
        isOpen={modalNotification.isOpen}
        onClose={() => setModalNotification({ ...modalNotification, isOpen: false })}
        type={modalNotification.type}
        title={modalNotification.title}
        message={modalNotification.message}
      />

      <EnhancedToast
        isVisible={toastNotification.isVisible}
        onClose={() => setToastNotification({ ...toastNotification, isVisible: false })}
        type={toastNotification.type}
        title={toastNotification.title}
        message={toastNotification.message}
      />
    </div>
  );
}