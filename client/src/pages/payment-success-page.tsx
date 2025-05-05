import { useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  
  // Check payment status on component mount
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Update the payment status cache
        queryClient.invalidateQueries({ queryKey: ["/api/payments/status"] });
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };
    
    if (user) {
      verifyPayment();
    }
  }, [user]);
  
  const handleContinue = () => {
    navigate("/");
  };
  
  return (
    <div className="container max-w-md mx-auto py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for subscribing to FounderSocials Premium.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Your account has been upgraded and you now have access to all premium features. 
            You will receive a confirmation email shortly.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">What's next?</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2 mt-0.5"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
                <span>Create your first private community</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2 mt-0.5"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
                <span>Customize your profile with premium options</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2 mt-0.5"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
                <span>Explore community analytics dashboard</span>
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={handleContinue} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
