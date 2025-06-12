import { useState } from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Reply, MoreHorizontal, AlertTriangle, Loader2, Sparkles, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Comment, User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface CommentItemProps {
  comment: Comment & { author?: User };
  onReplyClick: () => void;
  isReplying: boolean;
  currentUser: User | null;
}

export function CommentItem({ comment, onReplyClick, isReplying, currentUser }: CommentItemProps) {
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { toast } = useToast();
  
  // Get comment replies
  const { data: replies } = useQuery<(Comment & { author?: User })[]>({
    queryKey: [`/api/comments/${comment.id}/replies`],
    enabled: showReplies,
  });
  
  const toggleReplies = async () => {
    if (!showReplies && !replies) {
      setIsLoadingReplies(true);
    }
    
    setShowReplies(!showReplies);
    setIsLoadingReplies(false);
  };
  
  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!currentUser) {
      toast({
        title: "Login required",
        description: "You need to be logged in to vote on comments",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await apiRequest("POST", `/api/comments/${comment.id}/vote`, { voteType });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to vote");
      }
      
      // Invalidate queries to refresh comment
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${comment.postId}/comments`] });
      if (comment.parentId) {
        queryClient.invalidateQueries({ queryKey: [`/api/comments/${comment.parentId}/replies`] });
      }
      
      toast({
        title: "Vote recorded",
        description: `Your ${voteType} has been recorded`,
      });
    } catch (error) {
      toast({
        title: "Error voting",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const handleReport = async () => {
    if (!currentUser) {
      toast({
        title: "Login required",
        description: "You need to be logged in to report comments",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await apiRequest("POST", `/api/comments/${comment.id}/report`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to report comment");
      }
      
      toast({
        title: "Comment reported",
        description: "Thank you for helping keep our community safe",
      });
    } catch (error) {
      toast({
        title: "Error reporting comment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAIEnhancement = async () => {
    try {
      const response = await apiRequest("POST", `/api/comments/${comment.id}/ai-enhance`);
      const enhanced = await response.json();
      
      // Refresh comments to show AI enhancements
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${comment.postId}/comments`] });
      
      toast({
        title: "AI Enhancement Started",
        description: "Your comment is being analyzed for collaboration opportunities",
      });
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: error instanceof Error ? error.message : "AI enhancement is temporarily unavailable",
        variant: "destructive",
      });
    }
  };
  
  // Determine if comment was AI-processed
  const isAIProcessed = comment.status === "ai_processed";
  
  return (
    <div className={`p-4 rounded-lg ${isAIProcessed ? 'bg-primary/5 border border-primary/10' : 'bg-white border border-light-border'}`}>
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author?.avatarUrl || ""} alt={comment.author?.username || ""} />
          <AvatarFallback>
            {comment.author?.username?.substring(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Link href={`/u/${comment.author?.username}`} className="font-semibold text-dark hover:underline">
              {comment.author?.displayName || comment.author?.username || "Unknown User"}
            </Link>
            
            {isAIProcessed && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                AI Enhanced
              </span>
            )}
            
            <span className="text-xs text-neutral">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <div className="mt-2 text-neutral-dark whitespace-pre-line">
            {comment.content}
          </div>
          
          <div className="mt-3 flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="px-2 py-1 text-neutral hover:text-primary"
                onClick={() => handleVote("upvote")}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span className="text-xs">{comment.upvotes || 0}</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="px-2 py-1 text-neutral hover:text-destructive"
                onClick={() => handleVote("downvote")}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                <span className="text-xs">{comment.downvotes || 0}</span>
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 py-1 ${isReplying ? 'text-primary' : 'text-neutral hover:text-dark'}`}
              onClick={onReplyClick}
            >
              <Reply className="h-4 w-4 mr-1" />
              <span className="text-xs">Reply</span>
            </Button>
            
            {/* AI Enhancement for Premium Users */}
            {currentUser && 
             currentUser.subscriptionPlan && 
             currentUser.subscriptionPlan !== "free" && 
             currentUser.id === comment.authorId && 
             !comment.processFlowsGenerated && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="px-2 py-1 text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10"
                onClick={() => handleAIEnhancement()}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                <span className="text-xs">AI Enhance</span>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-2 py-1 text-neutral hover:text-dark"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleReport} className="text-destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Report</span>
                </DropdownMenuItem>
                {currentUser?.id === comment.authorId && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Show replies toggle */}
          {comment.replyCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-xs text-neutral hover:text-dark"
              onClick={toggleReplies}
              disabled={isLoadingReplies}
            >
              {isLoadingReplies ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Loading replies...
                </>
              ) : (
                <>
                  {showReplies ? "Hide" : "View"} {comment.replyCount} {comment.replyCount === 1 ? "reply" : "replies"}
                </>
              )}
            </Button>
          )}
          
          {/* Replies section */}
          {showReplies && replies && replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="pl-4 border-l-2 border-light-border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.author?.avatarUrl || ""} alt={reply.author?.username || ""} />
                    <AvatarFallback>
                      {reply.author?.username?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 mt-1">
                    <div className="flex items-center space-x-2">
                      <Link href={`/u/${reply.author?.username}`} className="font-semibold text-dark hover:underline">
                        {reply.author?.displayName || reply.author?.username || "Unknown User"}
                      </Link>
                      
                      {reply.status === "ai_processed" && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                          AI Enhanced
                        </span>
                      )}
                      
                      <span className="text-xs text-neutral">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="mt-1 text-neutral-dark whitespace-pre-line">
                      {reply.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
