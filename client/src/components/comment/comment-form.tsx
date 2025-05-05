import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare } from "lucide-react";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FreePlanUpgradePrompt } from "./free-plan-upgrade-prompt";

interface CommentFormProps {
  postId: number;
  parentId?: number;
  user: User | null;
  onSuccess?: () => void;
  placeholder?: string;
  invitingUser?: {
    username: string;
    displayName?: string | null;
  };
}

export function CommentForm({ 
  postId, 
  parentId, 
  user,
  onSuccess,
  placeholder = "Write a comment...",
  invitingUser
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(!!invitingUser);
  const { toast } = useToast();
  
  // Check if user can use AI features (Standard or Founder plan)
  const canUseAI = user?.subscriptionPlan && ["standard", "founder"].includes(user.subscriptionPlan);

  const handleSubmit = async (e: React.FormEvent, useAI: boolean = false) => {
    e.preventDefault();
    
    if (!comment.trim() || !user) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/comments", {
        postId,
        parentId,
        content: comment,
        useAI
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to post comment");
      }
      
      // Reset form and refetch comments
      setComment("");
      setShowAIOptions(false);
      
      // Invalidate queries to refresh comments
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: [`/api/comments/${parentId}/replies`] });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      toast({
        title: useAI ? "AI-assisted comment posted" : "Comment posted",
        description: useAI ? "Your comment is being processed with AI and will appear shortly." : "Your comment has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error posting comment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-light rounded-lg p-4 text-center">
        <p className="text-neutral-dark mb-2">You need to be signed in to comment</p>
        <Button asChild variant="default" size="sm">
          <a href="/auth">Sign in</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Show upgrade prompt for free users if they were invited or toggled AI features */}
      {!canUseAI && showUpgradePrompt && (
        <FreePlanUpgradePrompt 
          invitingUser={invitingUser} 
          onDismiss={() => setShowUpgradePrompt(false)} 
        />
      )}
      
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-3">
        <Textarea
          placeholder={placeholder}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-24 p-3 resize-y"
        />
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {/* Regular submit button */}
            <Button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="rounded-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Post Comment
            </Button>
            
            {/* AI comment button - only for paid users */}
            {canUseAI ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-primary text-primary"
                disabled={isSubmitting || !comment.trim()}
                onClick={(e) => {
                  e.preventDefault();
                  if (showAIOptions) {
                    handleSubmit(e, true);
                  } else {
                    setShowAIOptions(true);
                  }
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {showAIOptions ? "Submit with AI" : "Use AI"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-primary text-primary"
                onClick={() => setShowUpgradePrompt(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Use AI
              </Button>
            )}
          </div>
        </div>
        
        {/* AI options if expanded */}
        {canUseAI && showAIOptions && (
          <div className="bg-light p-3 rounded-lg">
            <p className="text-sm mb-3 text-neutral-dark">
              Using AI will process your comment to improve clarity, add relevant information, 
              and generate actionable insights for better collaboration.
            </p>
            
            {user?.subscriptionPlan === "standard" && (
              <p className="text-xs text-muted-foreground">
                You have 3 AI comments remaining this month.
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
