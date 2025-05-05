import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
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
import { Loader2, ExternalLink } from "lucide-react";

export function ProjectAccessPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accessLink, setAccessLink] = useState<string | null>(null);
  
  const generateLinkMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/external/access-link");
      return await response.json();
    },
    onSuccess: (data) => {
      setAccessLink(data.accessLink);
      toast({
        title: "Access link generated",
        description: "The link will expire in 15 minutes.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to generate access link: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  if (!user) {
    return null;
  }
  
  // Only premium users can access the project management platform
  const isPremium = user.subscriptionPlan === "standard" || user.subscriptionPlan === "founder";
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>TaskFlowPro Access</CardTitle>
        <CardDescription>
          {isPremium 
            ? "Access TaskFlowPro project management platform for free" 
            : "Upgrade to a premium plan to access TaskFlowPro for free"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPremium ? (
          <div className="space-y-4">
            <p className="text-sm">
              As a premium user, you have free access to TaskFlowPro project management platform. Generate a secure 
              access link to log in to TaskFlowPro without needing additional credentials.
            </p>
            {accessLink && (
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm font-medium mb-2">Your secure access link:</p>
                <div className="flex items-center justify-between bg-background rounded p-2 text-xs break-all">
                  <span className="mr-2">{accessLink}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(accessLink);
                      toast({
                        title: "Copied to clipboard",
                        description: "The access link has been copied to your clipboard.",
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This link will expire in 15 minutes for security reasons.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">
              Premium subscribers (Standard and Founder plans) get free access to TaskFlowPro project 
              management platform with features like:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Task management and assignment</li>
              <li>Project collaboration tools</li>
              <li>File sharing and version control</li>
              <li>Timeline and milestone tracking</li>
              <li>Seamless integration with FounderSocials</li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isPremium ? (
          <Button
            className="w-full"
            onClick={() => generateLinkMutation.mutate()}
            disabled={generateLinkMutation.isPending}
          >
            {generateLinkMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating access link...
              </>
            ) : accessLink ? (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Generate new access link
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Access TaskFlowPro
              </>
            )}
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <a href="/payment">
              Upgrade for Free TaskFlowPro Access
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}