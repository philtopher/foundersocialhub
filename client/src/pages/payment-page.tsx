import { useState } from "react";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, Zap, Crown, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PaymentPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "founder">("standard");

  const createStripeSubscriptionMutation = useMutation({
    mutationFn: async (planType: "standard" | "founder") => {
      const response = await apiRequest("POST", "/api/payments/stripe/create-subscription", {
        planType,
        successUrl: window.location.origin + "/payment/success",
        cancelUrl: window.location.origin + "/payment",
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({
        title: "Payment Error",
        description: `Failed to create subscription: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const createPaypalSubscriptionMutation = useMutation({
    mutationFn: async (planType: "standard" | "founder") => {
      const response = await apiRequest("POST", "/api/payments/paypal/create-subscription", {
        planType,
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    },
    onError: (error) => {
      toast({
        title: "Payment Error",
        description: `Failed to create PayPal subscription: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const plans = [
    {
      id: "standard",
      name: "Standard Plan",
      price: "£3",
      period: "month",
      description: "Perfect for active community builders",
      features: [
        "Unlimited AI-powered comment responses",
        "Enhanced profile customization",
        "Priority community support",
        "Access to premium communities",
        "Advanced post analytics",
        "Free TaskFlowPro access",
      ],
      icon: <Star className="h-6 w-6" />,
      color: "bg-blue-600",
      popular: true,
    },
    {
      id: "founder",
      name: "Founder Plan",
      price: "£7",
      period: "month",
      description: "For serious entrepreneurs and business leaders",
      features: [
        "Everything in Standard",
        "Unlimited AI workflow generation",
        "Direct comment posting (bypass AI)",
        "Founder badge and priority visibility",
        "Advanced community moderation tools",
        "1-on-1 platform consultation",
        "Early access to new features",
        "Premium external integrations",
      ],
      icon: <Crown className="h-6 w-6" />,
      color: "bg-purple-600",
      popular: false,
    },
  ];

  const handleStripeCheckout = (planType: "standard" | "founder") => {
    createStripeSubscriptionMutation.mutate(planType);
  };

  const handlePaypalCheckout = (planType: "standard" | "founder") => {
    createPaypalSubscriptionMutation.mutate(planType);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-light-background">
        <div className="flex">
          <LeftSidebar />
          <div className="flex-1 max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">
                {user?.subscriptionPlan === "standard" 
                  ? "Upgrade to Founder Plan" 
                  : user?.subscriptionPlan === "founder"
                  ? "You're on the Founder Plan"
                  : "Upgrade to Premium"
                }
              </h1>
              <p className="text-neutral-dark text-lg max-w-2xl mx-auto">
                {user?.subscriptionPlan === "founder"
                  ? "You have access to all premium features. Manage your subscription in account settings."
                  : "Unlock advanced features and take your founder journey to the next level"
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {plans
                .filter((plan) => {
                  // Show plans based on user's current subscription
                  if (!user || !user.subscriptionPlan || user.subscriptionPlan === "free") {
                    return true; // Show all plans for free users
                  }
                  if (user.subscriptionPlan === "standard") {
                    return plan.id === "founder"; // Only show Founder plan for Standard users
                  }
                  if (user.subscriptionPlan === "founder") {
                    return false; // Show no plans for Founder users (they have the highest tier)
                  }
                  return true;
                })
                .map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative ${
                    plan.popular ? "border-primary shadow-lg" : "border-light-border"
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className={`${plan.color} text-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center`}>
                      {plan.icon}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-neutral">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        onClick={() => handleStripeCheckout(plan.id as "standard" | "founder")}
                        disabled={createStripeSubscriptionMutation.isPending || user?.subscriptionPlan === plan.id}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        {user?.subscriptionPlan === plan.id ? "Current Plan" : "Pay with Stripe"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handlePaypalCheckout(plan.id as "standard" | "founder")}
                        disabled={createPaypalSubscriptionMutation.isPending || user?.subscriptionPlan === plan.id}
                      >
                        {user?.subscriptionPlan === plan.id ? "Current Plan" : "Pay with PayPal"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {user?.subscriptionPlan === "founder" && (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">You're all set!</h3>
                <p className="text-neutral">You have access to all premium features.</p>
                <p className="text-sm text-neutral mt-4">
                  To manage your subscription or billing, visit your{" "}
                  <Link href="/settings" className="text-primary hover:underline">
                    account settings
                  </Link>
                  .
                </p>
              </div>
            )}

            {user?.subscriptionPlan !== "founder" && (
              <div className="text-center text-sm text-neutral">
                <p>All plans include a 7-day free trial. Cancel anytime.</p>
                <p className="mt-2">
                  Questions? Contact us at{" "}
                  <a href="mailto:support@foundersocials.com" className="text-primary hover:underline">
                    support@foundersocials.com
                  </a>
                </p>
              </div>
            )}
          </div>
          <RightSidebar />
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}