import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  SendHorizontal,
  ArrowRightFromLine,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { User, Comment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FreePlanUpgradePrompt } from "./free-plan-upgrade-prompt";

interface AIModeratedCommentProps {
  postId: number;
  parentId?: number;
  user: User | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type WorkflowStep = "initial" | "processing" | "review" | "complete";

export function AIModeratedComment({
  postId,
  parentId,
  user,
  onSuccess,
  onCancel,
}: AIModeratedCommentProps) {
  const [comment, setComment] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("initial");
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  const { toast } = useToast();
  
  // Check if user can use AI features (Standard or Founder plan)
  const canUseAI = user?.subscriptionPlan && ["standard", "founder"].includes(user.subscriptionPlan);
  const isFounder = user?.subscriptionPlan === "founder";
  const remainingPrompts = user?.remainingPrompts || 0;
  
  // For standard users, check if they have prompts remaining
  const hasPromptsRemaining = isFounder || remainingPrompts > 0;
  
  useEffect(() => {
    // If user cannot use AI, show upgrade prompt
    if (user && !canUseAI) {
      setShowUpgradePrompt(true);
    }
  }, [user, canUseAI]);
  
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !canUseAI || !hasPromptsRemaining) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/comments/ai-process", {
        content: comment,
        postId,
        parentId,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process comment with AI");
      }
      
      const result = await response.json();
      setAiResponse(result.aiResponse);
      setCurrentStep("processing");
      
      // Simulate AI processing
      setTimeout(() => {
        setCurrentStep("review");
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error processing comment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiPrompt.trim() || !canUseAI) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/comments/ai-prompt", {
        originalComment: comment,
        aiPrompt,
        postId,
        parentId,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process AI prompt");
      }
      
      const result = await response.json();
      setAiResponse(result.aiResponse);
      
      // If standard user, decrease remaining prompts
      if (user?.subscriptionPlan === "standard") {
        // This would be handled server-side, but we update UI
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      }
      
    } catch (error) {
      toast({
        title: "Error processing prompt",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFinalSubmit = async () => {
    if (!aiResponse || !canUseAI) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/comments", {
        content: aiResponse,
        postId,
        parentId,
        useAI: true,
        aiProcessed: true,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to post comment");
      }
      
      // Reset form and steps
      setComment("");
      setAiPrompt("");
      setAiResponse(null);
      setCurrentStep("complete");
      
      // Invalidate queries to refresh comments
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: [`/api/comments/${parentId}/replies`] });
      }
      
      toast({
        title: "AI-enhanced comment posted",
        description: "Your comment has been successfully posted.",
      });
      
      // After a delay, reset or call onSuccess
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          setCurrentStep("initial");
        }
      }, 1500);
      
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
  
  const handleCancel = () => {
    setComment("");
    setAiPrompt("");
    setAiResponse(null);
    setCurrentStep("initial");
    
    if (onCancel) {
      onCancel();
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
  
  // Show upgrade prompt for free users
  if (showUpgradePrompt) {
    return (
      <FreePlanUpgradePrompt
        onDismiss={() => {
          setShowUpgradePrompt(false);
          if (onCancel) onCancel();
        }}
      />
    );
  }
  
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
      {currentStep === "initial" && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI-Enhanced Comment</h3>
          </div>
          
          <form onSubmit={handleInitialSubmit} className="space-y-3">
            <Textarea
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24 p-3 resize-y bg-white"
              disabled={isSubmitting}
            />
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting || !comment.trim() || !hasPromptsRemaining}
                className="rounded-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance with AI
                  </>
                )}
              </Button>
            </div>
            
            {!isFounder && (
              <p className="text-xs text-muted-foreground text-right">
                {remainingPrompts} AI prompt{remainingPrompts !== 1 ? "s" : ""} remaining
              </p>
            )}
          </form>
        </>
      )}
      
      {currentStep === "processing" && (
        <div className="text-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-dark">AI is processing your comment...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
        </div>
      )}
      
      {currentStep === "review" && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Review AI-Enhanced Comment</h3>
          </div>
          
          <div className="bg-white rounded-lg border border-input p-3 mb-4">
            <p className="whitespace-pre-line">{aiResponse}</p>
          </div>
          
          <div className="border-t border-border pt-3 mt-3">
            <p className="text-sm text-neutral-dark mb-2">
              You can provide additional instructions to refine this comment:
            </p>
            
            <form onSubmit={handlePromptSubmit} className="space-y-3">
              <Textarea
                placeholder="E.g., Make it more technical, expand on the second point, etc."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-20 p-3 resize-y bg-white"
                disabled={isSubmitting}
              />
              
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Post Comment
                  </Button>
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || !aiPrompt.trim()}
                  className="rounded-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRightFromLine className="mr-2 h-4 w-4" />
                      Refine
                    </>
                  )}
                </Button>
              </div>
              
              {!isFounder && (
                <p className="text-xs text-muted-foreground text-right">
                  Each refinement uses 1 AI prompt ({remainingPrompts} remaining)
                </p>
              )}
            </form>
          </div>
        </>
      )}
      
      {currentStep === "complete" && (
        <div className="text-center py-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Comment Posted!</h3>
          <p className="text-neutral-dark">Your AI-enhanced comment has been posted successfully.</p>
        </div>
      )}
    </div>
  );
}
