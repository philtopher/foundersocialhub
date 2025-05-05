import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, CreditCard } from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// PayPal integration will be added later
// import PayPalButton from "./paypal-button";

// We use the public key safely from environment variables
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface PaymentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Stripe Payment Form
function StripePaymentForm({ onSuccess, onCancel }: PaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const stripe = useStripe();
  const elements = useElements();
  
  // Create Stripe subscription when component mounts
  useEffect(() => {
    const createSubscription = async () => {
      try {
        setIsLoading(true);
        
        const response = await apiRequest("POST", "/api/payments/stripe/create-subscription", {});
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to create subscription");
        }
        
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        console.error("Subscription error:", error);
        toast({
          title: "Payment Error",
          description: error.message || "Failed to set up payment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      createSubscription();
    }
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/payment-success",
        },
      });
      
      if (error) {
        throw new Error(error.message || "Payment failed");
      } else {
        // Successfully confirmed payment on client-side
        // The webhook will handle the server-side status update
        queryClient.invalidateQueries({ queryKey: ["/api/payments/status"] });
        
        toast({
          title: "Payment Processing",
          description: "Your payment is being processed.",
        });
        
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Payment could not be processed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full space-y-4">
      {!clientSecret ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="text-sm text-muted-foreground">Preparing payment...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

// PayPal Payment Form
function PayPalPaymentForm({ onSuccess, onCancel }: PaymentProps) {
  return (
    <div className="w-full space-y-4">
      <div className="min-h-[150px] flex flex-col items-center justify-center">
        <div className="p-4 bg-blue-50 rounded-lg mb-4 flex items-center justify-center w-full">
          <PayPalButton 
            amount="19.99" 
            currency="USD" 
            intent="CAPTURE" 
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Main Payment Form with Stripe only
export function PaymentForm({ onSuccess, onCancel }: PaymentProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Secure payment with Stripe
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <StripePaymentForm onSuccess={onSuccess} onCancel={onCancel} />
          </Elements>
        ) : (
          <div className="text-center py-8 space-y-4">
            <p className="text-destructive">Stripe payment is not configured</p>
            <p className="text-sm text-muted-foreground">
              Please contact support to enable payment functionality
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
          <p>Your payment is secure and encrypted</p>
          <p>You will be charged $19.99/month for the premium subscription</p>
        </div>
      </CardFooter>
    </Card>
  );
}
