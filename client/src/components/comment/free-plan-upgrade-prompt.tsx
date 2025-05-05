import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles } from "lucide-react";

interface FreePlanUpgradePromptProps {
  invitingUser?: {
    username: string;
    displayName?: string | null;
  };
  onDismiss: () => void;
}

export function FreePlanUpgradePrompt({ invitingUser, onDismiss }: FreePlanUpgradePromptProps) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-dark">
            {invitingUser 
              ? `${invitingUser.displayName || invitingUser.username} is using AI-powered collaboration`
              : 'Unlock AI-powered collaboration'}
          </h4>
          <p className="text-neutral-dark text-sm mt-1 mb-3">
            {invitingUser
              ? "They've invited you to upgrade to enable AI-assisted workflows, better communication, and collaborative project tools."
              : "Upgrade to enable AI-assisted workflows, better communication, and collaborative project tools."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/payment?plan=standard">
              <Button size="sm" className="rounded-full">
                Upgrade to Standard Plan
              </Button>
            </Link>
            <Link href="/payment?plan=founder">
              <Button size="sm" variant="outline" className="rounded-full border-primary text-primary">
                Explore Founder Plan
              </Button>
            </Link>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-neutral hover:text-dark"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
