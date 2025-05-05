import { Link } from "wouter";
import { useState } from "react";
import { ArrowUp, ArrowDown, MessageSquare, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Post, User, Community } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: Post & {
    author?: User;
    community?: Community;
  };
  userVote?: "upvote" | "downvote" | null;
}

export function PostCard({ post, userVote }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentVote, setCurrentVote] = useState<"upvote" | "downvote" | null>(userVote || null);
  const [voteCount, setVoteCount] = useState(post.upvotes - post.downvotes);
  
  const voteMutation = useMutation({
    mutationFn: async ({ postId, voteType }: { postId: number, voteType: "upvote" | "downvote" }) => {
      return await apiRequest("POST", `/api/posts/${postId}/vote`, { voteType });
    },
    onError: () => {
      // Revert optimistic update on error
      setCurrentVote(userVote || null);
      setVoteCount(post.upvotes - post.downvotes);
      
      toast({
        title: "Error",
        description: "Failed to register vote. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // Invalidate queries that might include this post
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${post.communityId}/posts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}`] });
    }
  });
  
  const handleVote = (voteType: "upvote" | "downvote") => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to vote on posts",
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
    
    voteMutation.mutate({ postId: post.id, voteType });
  };
  
  return (
    <div className="bg-white rounded-lg border border-light-border mb-4 hover:border-neutral-light">
      <div className="flex p-3">
        {/* Voting Column */}
        <div className="flex flex-col items-center pr-2 w-10">
          <button 
            className={`text-neutral hover:text-primary hover:bg-light-darker rounded-md w-6 h-6 flex items-center justify-center ${currentVote === "upvote" ? "text-primary" : ""}`}
            onClick={() => handleVote("upvote")}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium my-1">{voteCount}</span>
          <button 
            className={`text-neutral hover:text-primary hover:bg-light-darker rounded-md w-6 h-6 flex items-center justify-center ${currentVote === "downvote" ? "text-primary" : ""}`}
            onClick={() => handleVote("downvote")}
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
        
        {/* Content Column */}
        <div className="flex-1">
          {/* Post Header */}
          <div className="flex items-center text-xs mb-2">
            {post.community && (
              <>
                <div 
                  className="community-icon mr-1" 
                  style={{ backgroundImage: `url('${post.community.iconUrl}')` }}
                ></div>
                <Link href={`/r/${post.community.name}`} className="font-medium hover:underline">
                  r/{post.community.name}
                </Link>
                <span className="mx-1 text-neutral">•</span>
              </>
            )}
            <span className="text-neutral">Posted by</span>
            <Link href={`/u/${post.author?.username || "unknown"}`} className="ml-1 hover:underline">
              u/{post.author?.username || "unknown"}
            </Link>
            <span className="mx-1 text-neutral">•</span>
            <span className="text-neutral">
              {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ""}
            </span>
          </div>
          
          {/* Post Title */}
          <h2 className="text-lg font-medium mb-2">
            <Link href={`/r/${post.community?.name || "unknown"}/post/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
          
          {/* Post Content/Preview */}
          <div className="post-body text-neutral-dark mb-3">
            <p className="font-serif">{post.content}</p>
          </div>
          
          {/* Post Image */}
          {post.imageUrl && (
            <div className="mb-3 rounded-lg overflow-hidden">
              <img src={post.imageUrl} alt={post.title} className="w-full object-cover" />
            </div>
          )}
          
          {/* Post Actions */}
          <div className="flex items-center text-neutral text-sm">
            <Link href={`/r/${post.community?.name || "unknown"}/post/${post.id}`} className="flex items-center px-2 py-1 rounded-md hover:bg-light-darker">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.commentCount} Comments</span>
            </Link>
            <button className="flex items-center px-2 py-1 rounded-md hover:bg-light-darker ml-2">
              <Share2 className="h-4 w-4 mr-1" />
              <span>Share</span>
            </button>
            <button className="flex items-center px-2 py-1 rounded-md hover:bg-light-darker ml-2">
              <Bookmark className="h-4 w-4 mr-1" />
              <span>Save</span>
            </button>
            <button className="flex items-center px-2 py-1 rounded-md hover:bg-light-darker ml-auto">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
