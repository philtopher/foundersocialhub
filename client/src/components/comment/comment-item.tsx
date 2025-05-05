import { Link } from "wouter";
import { useState } from "react";
import { ArrowUp, ArrowDown, Reply, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Comment, User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CreateComment } from "./create-comment";

interface CommentItemProps {
  comment: Comment & {
    author?: User;
    replies?: Array<Comment & { author?: User }>;
  };
  postId: number;
  userVote?: "upvote" | "downvote" | null;
}

export function CommentItem({ comment, postId, userVote }: CommentItemProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentVote, setCurrentVote] = useState<"upvote" | "downvote" | null>(userVote || null);
  const [voteCount, setVoteCount] = useState(comment.upvotes - comment.downvotes);
  const [isReplying, setIsReplying] = useState(false);

  const voteMutation = useMutation({
    mutationFn: async ({ commentId, voteType }: { commentId: number; voteType: "upvote" | "downvote" }) => {
      return await apiRequest("POST", `/api/comments/${commentId}/vote`, { voteType });
    },
    onError: () => {
      // Revert optimistic update on error
      setCurrentVote(userVote || null);
      setVoteCount(comment.upvotes - comment.downvotes);

      toast({
        title: "Error",
        description: "Failed to register vote. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // Invalidate queries that include this comment
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
    }
  });

  const handleVote = (voteType: "upvote" | "downvote") => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to vote on comments",
        variant: "destructive",
      });
      return;
    }

    // Optimistic update
    if (currentVote === voteType) {
      // Removing vote
      setCurrentVote(null);
      setVoteCount(voteType === "upvote" ? voteCount - 1 : voteCount + 1);
    } else if (currentVote) {
      // Changing vote
      setCurrentVote(voteType);
      setVoteCount(voteType === "upvote" ? voteCount + 2 : voteCount - 2);
    } else {
      // New vote
      setCurrentVote(voteType);
      setVoteCount(voteType === "upvote" ? voteCount + 1 : voteCount - 1);
    }

    voteMutation.mutate({ commentId: comment.id, voteType });
  };

  return (
    <div className="mb-3">
      <div className="flex items-start">
        <Avatar className="w-8 h-8 mt-1 mr-2">
          <AvatarImage src={comment.author?.avatarUrl || ""} alt={comment.author?.username || "User"} />
          <AvatarFallback>
            {comment.author?.username?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <Link href={`/u/${comment.author?.username || "unknown"}`}>
              <a className="font-medium text-xs hover:underline">
                u/{comment.author?.username || "unknown"}
              </a>
            </Link>
            <span className="text-neutral text-xs ml-2">
              {comment.createdAt
                ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                : ""}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>

          {/* Comment Actions */}
          <div className="flex items-center mt-1 text-xs text-neutral">
            <button
              className={`flex items-center hover:bg-light-darker rounded px-1 py-0.5 ${
                currentVote === "upvote" ? "text-primary" : ""
              }`}
              onClick={() => handleVote("upvote")}
            >
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>{voteCount > 0 ? voteCount : ""}</span>
            </button>
            <button
              className={`flex items-center hover:bg-light-darker rounded px-1 py-0.5 ml-1 ${
                currentVote === "downvote" ? "text-primary" : ""
              }`}
              onClick={() => handleVote("downvote")}
            >
              <ArrowDown className="h-3 w-3" />
            </button>
            <button
              className="hover:bg-light-darker rounded px-1 py-0.5 ml-2"
              onClick={() => setIsReplying(!isReplying)}
            >
              <span className="flex items-center">
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </span>
            </button>
            <Button variant="ghost" className="hover:bg-light-darker rounded px-1 py-0.5 ml-2 h-auto">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-2">
              <CreateComment
                postId={postId}
                parentId={comment.id}
                onSuccess={() => setIsReplying(false)}
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-4 border-l border-light-border">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} postId={postId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
