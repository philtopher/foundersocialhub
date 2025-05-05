import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        setLoading(true);
        
        const response = await apiRequest("GET", "/api/payments/status");
        const data = await response.json();
        
        setPaymentStatus(data.paymentStatus);
        // Clear any previous errors
        setError(null);
        
        // Invalidate user query to refresh user data
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      } catch (error: any) {
        console.error("Error checking payment status:", error);
        setError(error.message || "Failed to check payment status");
      } finally {
        setLoading(false);
      }
    };
    
    // Check status on initial load
    checkPaymentStatus();
    
    // Poll every 5 seconds to check for updates
    const intervalId = setInterval(checkPaymentStatus, 5000);
    
    // Clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);
  
  const getStatusMessage = () => {
    if (loading) {
      return "Checking payment status...";
    }
    
    if (error) {
      return `Error: ${error}`;
    }
    
    switch (paymentStatus) {
      case "completed":
        return "Your payment has been successfully processed!";
      case "pending":
        return "Your payment is being processed. This may take a moment.";
      case "failed":
        return "There was an issue processing your payment. Please try again.";
      default:
        return "Unknown payment status. Please contact support if this persists.";
    }
  };
  
  const getCardContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <p className="text-xl">Processing payment...</p>
        </div>
      );
    }
    
    if (paymentStatus === "completed") {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <p className="text-muted-foreground">Your account has been upgraded to premium.</p>
          </div>
          <div className="space-y-2 text-center">
            <p>You now have access to all premium features:</p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>Create unlimited communities</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
              <li>Ad-free experience</li>
            </ul>
          </div>
        </div>
      );
    }
    
    if (paymentStatus === "pending") {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Payment Processing</h2>
            <p className="text-muted-foreground">Your payment is being processed. This page will update automatically.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-6">
        <AlertCircle className="w-16 h-16 text-destructive" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Payment Issue</h2>
          <p className="text-muted-foreground">{getStatusMessage()}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container max-w-3xl py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>
            Check the status of your subscription payment
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {getCardContent()}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/">
                Go to Home
              </Link>
            </Button>
            {paymentStatus !== "completed" && (
              <Button variant="outline" asChild>
                <Link to="/payment">
                  Try Again
                </Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
