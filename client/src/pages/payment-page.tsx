import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { PaymentForm } from "@/components/payment/payment-form";
import { useToast } from "@/hooks/use-toast";

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    toast({
      title: "Payment Successful",
      description: "Your premium subscription has been activated.",
    });
    
    // Give time for the success message to display
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };
  
  const handlePaymentCancel = () => {
    navigate("/");
  };
  
  // Redirect if user is not logged in
  if (!user && !isProcessing) {
    navigate("/auth");
    return null;
  }
  
  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Premium Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Upgrade your account to access premium features
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold flex items-center">
              <span className="bg-indigo-100 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-indigo-600"><path d="M2 20h.01"></path><path d="M7 20v-4"></path><path d="M12 20v-8"></path><path d="M17 20V8"></path><path d="M22 4v16"></path></svg>
              </span>
              Premium Benefits
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-green-600 mr-2 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Create private communities</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-green-600 mr-2 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Enhanced profile customization</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-green-600 mr-2 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Advanced community analytics</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-green-600 mr-2 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Priority customer support</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-green-600 mr-2 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>No ads or restrictions</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold flex items-center">
              <span className="bg-amber-100 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-amber-600"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
              </span>
              Subscription Details
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-amber-600 mr-2 mt-0.5"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
                <span>$19.99 per month</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-amber-600 mr-2 mt-0.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M21 14H3"></path></svg>
                <span>Cancel anytime</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-amber-600 mr-2 mt-0.5"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <span>Money-back guarantee</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          <PaymentForm
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      </div>
    </div>
  );
}
