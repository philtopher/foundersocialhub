import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Shield, Zap, Award, BarChart, MessageSquare, CreditCard, X, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface SubscriptionFeature {
  name: string;
  free: boolean;
  standard: boolean;
  founder: boolean;
  icon: React.ReactNode;
}

const features: SubscriptionFeature[] = [
  {
    name: "Create and join communities",
    free: true,
    standard: true,
    founder: true,
    icon: <Shield className="h-4 w-4" />,
  },
  {
    name: "Basic posting and commenting",
    free: true,
    standard: true,
    founder: true,
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    name: "AI-moderated comments",
    free: false,
    standard: true,
    founder: true,
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    name: "3 AI prompts per day",
    free: false,
    standard: true,
    founder: false,
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    name: "10 AI prompts per day",
    free: false,
    standard: false,
    founder: true,
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    name: "Collaborate with any user",
    free: false,
    standard: false,
    founder: true,
    icon: <Award className="h-4 w-4" />,
  },
  {
    name: "Premium profile features",
    free: false,
    standard: true,
    founder: true,
    icon: <Zap className="h-4 w-4" />,
  },
];

export function SubscriptionPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/payments/cancel-subscription");
    },
    onSuccess: () => {
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been successfully cancelled.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to cancel subscription: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  if (!user) {
    return null;
  }
  
  const isPremium = user.subscriptionPlan === "standard" || user.subscriptionPlan === "founder";
  const planType = user.subscriptionPlan || "free";
  
  // Calculate remaining prompts percentage
  const maxPrompts = planType === "founder" ? 10 : planType === "standard" ? 3 : 0;
  const remainingPrompts = user.remainingPrompts || 0;
  const promptsPercentage = maxPrompts > 0 ? (remainingPrompts / maxPrompts) * 100 : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Subscription</span>
          {planType === "free" ? (
            <Badge variant="outline" className="font-normal">
              Free Plan
            </Badge>
          ) : planType === "standard" ? (
            <Badge className="bg-blue-600 hover:bg-blue-700 font-normal">
              Standard Plan
            </Badge>
          ) : (
            <Badge className="bg-purple-600 hover:bg-purple-700 font-normal">
              Founder Plan
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {planType === "free" 
            ? "Upgrade to access premium features" 
            : `You are on the ${planType === "standard" ? "Standard" : "Founder"} plan`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPremium && maxPrompts > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Prompts Remaining</span>
              <span className="font-medium">{remainingPrompts}/{maxPrompts}</span>
            </div>
            <Progress value={promptsPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Resets daily at midnight UTC
            </p>
          </div>
        )}
        
        <div className="rounded-md border p-4">
          <div className="space-y-3">
            <h4 className="font-medium leading-none">Plan Features:</h4>
            <div className="space-y-1">
              {features.map((feature, index) => {
                const isActive = 
                  (planType === "free" && feature.free) ||
                  (planType === "standard" && feature.standard) ||
                  (planType === "founder" && feature.founder);
                  
                return (
                  <div 
                    key={index} 
                    className={`flex items-center gap-2 ${isActive ? "" : "text-muted-foreground"}${index !== 0 ? " mt-2" : ""}`}
                  >
                    {isActive ? feature.icon : <X className="h-4 w-4" />}
                    <span className="text-sm">{feature.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {planType === "free" ? (
          <Button className="w-full" asChild>
            <Link href="/payment">
              <CreditCard className="mr-2 h-4 w-4" />
              Upgrade Now
            </Link>
          </Button>
        ) : (
          <>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will lose access to premium features immediately. Your subscription will not renew.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      cancelSubscriptionMutation.mutate();
                    }}
                    disabled={cancelSubscriptionMutation.isPending}
                  >
                    {cancelSubscriptionMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : "Yes, Cancel"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {planType === "standard" && (
              <Button className="w-full" asChild>
                <Link href="/payment?upgrade=founder">
                  <Award className="mr-2 h-4 w-4" />
                  Upgrade to Founder
                </Link>
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}