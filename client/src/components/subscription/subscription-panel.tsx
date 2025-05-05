import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export function SubscriptionPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/payments/cancel-subscription");
    },
    onSuccess: () => {
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to cancel subscription: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/account/delete");
    },
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      });
      // Redirect to home after account deletion
      navigate("/");
      // Force refresh to ensure user is logged out
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete account: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  if (!user) return null;
  
  // Free Plan UI
  if (!user.subscriptionPlan || user.subscriptionPlan === "free") {
    return (
      <Card className="w-full shadow-md border-border/40">
        <CardHeader>
          <CardTitle>Upgrade Your Experience</CardTitle>
          <CardDescription>Get access to premium features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Standard Plan</h3>
            <p className="text-sm text-muted-foreground">£7/month</p>
            <ul className="text-sm space-y-1">
              <li>✓ 3 AI prompts per day</li>
              <li>✓ AI-enhanced comments</li>
              <li>✓ Priority support</li>
            </ul>
            <Button 
              className="w-full mt-2" 
              onClick={() => navigate("/payment?plan=standard")}
            >
              Upgrade to Standard
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Founder Plan</h3>
            <p className="text-sm text-muted-foreground">£15/month</p>
            <ul className="text-sm space-y-1">
              <li>✓ 10 AI prompts per day</li>
              <li>✓ Unlimited AI-enhanced comments</li>
              <li>✓ Process flow generation</li>
              <li>✓ Priority support</li>
              <li>✓ Early access to new features</li>
            </ul>
            <Button 
              className="w-full mt-2" 
              variant="default"
              onClick={() => navigate("/payment?plan=founder")}
            >
              Upgrade to Founder
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t border-border/40 flex flex-col items-start">
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                deleteAccountMutation.mutate();
              }
            }}
          >
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Standard Plan UI
  if (user.subscriptionPlan === "standard") {
    return (
      <Card className="w-full shadow-md border-border/40">
        <CardHeader>
          <CardTitle>Standard Plan</CardTitle>
          <CardDescription>Your current subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">£7/month</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>✓ 3 AI prompts per day</li>
              <li>✓ AI-enhanced comments</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
          
          <div className="space-y-2 pt-4 border-t border-border/40 mt-4">
            <h3 className="font-semibold">Upgrade to Founder Plan</h3>
            <p className="text-sm text-muted-foreground">£15/month</p>
            <ul className="text-sm space-y-1">
              <li>✓ 10 AI prompts per day</li>
              <li>✓ Unlimited AI-enhanced comments</li>
              <li>✓ Process flow generation</li>
              <li>✓ Priority support</li>
              <li>✓ Early access to new features</li>
            </ul>
            <Button 
              className="w-full mt-2" 
              onClick={() => navigate("/payment?plan=founder")}
            >
              Upgrade to Founder
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t border-border/40 flex flex-col items-start space-y-2 w-full">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              if (window.confirm("Are you sure you want to cancel your subscription? You will be downgraded to the Free Plan.")) {
                cancelSubscriptionMutation.mutate();
              }
            }}
          >
            Cancel Subscription (Downgrade to Free)
          </Button>
          
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                deleteAccountMutation.mutate();
              }
            }}
          >
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Founder Plan UI
  return (
    <Card className="w-full shadow-md border-border/40">
      <CardHeader>
        <CardTitle>Founder Plan</CardTitle>
        <CardDescription>Your current subscription</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">£15/month</p>
        <ul className="text-sm space-y-1 mt-2">
          <li>✓ 10 AI prompts per day</li>
          <li>✓ Unlimited AI-enhanced comments</li>
          <li>✓ Process flow generation</li>
          <li>✓ Priority support</li>
          <li>✓ Early access to new features</li>
        </ul>
      </CardContent>
      <CardFooter className="pt-4 border-t border-border/40 flex flex-col items-start space-y-2 w-full">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            if (window.confirm("Are you sure you want to downgrade to the Standard Plan?")) {
              // Downgrade to Standard Plan
              navigate("/payment?plan=standard&downgrade=true");
            }
          }}
        >
          Downgrade to Standard Plan
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            if (window.confirm("Are you sure you want to cancel your subscription? You will be downgraded to the Free Plan.")) {
              cancelSubscriptionMutation.mutate();
            }
          }}
        >
          Cancel Subscription (Downgrade to Free)
        </Button>
        
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
              deleteAccountMutation.mutate();
            }
          }}
        >
          Delete Account
        </Button>
      </CardFooter>
    </Card>
  );
}
