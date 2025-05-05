import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "wouter";

export function TaskFlowNavItem() {
  const { user } = useAuth();
  
  // Only show for premium users (Standard and Founder plans)
  if (!user || (user.subscriptionPlan !== "standard" && user.subscriptionPlan !== "founder")) {
    return null;
  }
  
  return (
    <div className="flex items-center">
      <Button variant="ghost" asChild className="flex items-center gap-1 text-primary">
        <Link href="/settings#taskflow">
          <ExternalLink className="h-4 w-4" />
          <span>TaskFlowPro</span>
        </Link>
      </Button>
    </div>
  );
}
