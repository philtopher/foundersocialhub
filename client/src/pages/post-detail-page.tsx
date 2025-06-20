import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Comment, Post, User, Community } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { PostCard } from "@/components/post/post-card";
import { CreateComment } from "@/components/comment/create-comment";
import { CommentItem } from "@/components/comment/comment-item";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { socket } from "@/lib/socket";
import { queryClient } from "@/lib/queryClient";

export default function PostDetailPage() {
  const { communityName, postId } = useParams();
  const [, navigate] = useLocation();
  const [commentSort, setCommentSort] = useState<"top" | "new" | "old">("top");

  const { data: post, isLoading: postLoading } = useQuery<Post & { author?: User; community?: Community }>({
    queryKey: [`/api/posts/${postId}`],
  });

  const { data: comments, isLoading: commentsLoading } = useQuery<(Comment & { author?: User; replies?: Array<Comment & { author?: User }> })[]>({
    queryKey: [`/api/posts/${postId}/comments`, { sort: commentSort }],
    enabled: !!postId,
  });

  // Real-time Socket.IO integration for live comments and votes
  useEffect(() => {
    if (!postId) return;

    let missedEvent = false;

    const handleNewComment = (data: { postId: number; comment: Comment & { author?: User }; commentCount: number }) => {
      console.log("[Socket] Received new-comment event:", data);
      if (data.postId === parseInt(postId)) {
        // Update all possible sort variations immediately
        const updateFn = (oldComments: any) => {
          if (!oldComments) return [data.comment];
          // Check if comment already exists to avoid duplicates
          const commentExists = oldComments.some((c: Comment) => c.id === data.comment.id);
          if (commentExists) return oldComments;
          // Add new comment at the beginning for immediate visibility
          return [data.comment, ...oldComments];
        };

        // Update all sort order caches
        queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "top" }], updateFn);
        queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "new" }], updateFn);
        queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "old" }], (oldComments: any) => {
          if (!oldComments) return [data.comment];
          const commentExists = oldComments.some((c: Comment) => c.id === data.comment.id);
          if (commentExists) return oldComments;
          return [...oldComments, data.comment];
        });
        
        // Update the current sort as well
        queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: commentSort }], updateFn);
        
        // Update post comment count
        queryClient.setQueryData([`/api/posts/${postId}`], (oldPost: any) => {
          if (!oldPost) return oldPost;
          return { ...oldPost, commentCount: data.commentCount };
        });
        
        // Force UI re-render
        queryClient.invalidateQueries({ 
          queryKey: [`/api/posts/${postId}/comments`],
          exact: false,
          refetchType: 'active'
        });
      }
    };

    const handleCommentVote = (data: { commentId: number; postId: number; upvotes: number; downvotes: number }) => {
      console.log("[Socket] Received comment-vote event:", data);
      if (data.postId === parseInt(postId)) {
        let updated = false;
        queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: commentSort }], (oldComments: any) => {
          if (!oldComments) return oldComments;
          const newComments = oldComments.map((comment: Comment & { author?: User }) =>
            comment.id === data.commentId
              ? { ...comment, upvotes: data.upvotes, downvotes: data.downvotes }
              : comment
          );
          updated = true;
          return newComments;
        });
        if (!updated) missedEvent = true;
      }
    };

    const handlePostVote = (data: { postId: number; upvotes: number; downvotes: number }) => {
      console.log("[Socket] Received post-vote event:", data);
      if (data.postId === parseInt(postId)) {
        queryClient.setQueryData([`/api/posts/${postId}`], (oldPost: any) => {
          if (!oldPost) return oldPost;
          return { ...oldPost, upvotes: data.upvotes, downvotes: data.downvotes };
        });
      }
    };

    // Connection and error handling
    const handleConnect = () => {
      console.log("[Socket] Connected:", socket.id);
    };
    const handleDisconnect = (reason: string) => {
      console.warn("[Socket] Disconnected:", reason);
    };
    const handleConnectError = (error: any) => {
      console.error("[Socket] Connection error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("new-comment", handleNewComment);
    socket.on("comment-vote", handleCommentVote);
    socket.on("post-vote", handlePostVote);

    // Fallback: refetch comments if a real-time event was missed
    const fallbackTimeout = setTimeout(() => {
      if (missedEvent) {
        console.warn("[Socket] Missed a real-time event, refetching comments...");
        queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      }
    }, 2000);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("new-comment", handleNewComment);
      socket.off("comment-vote", handleCommentVote);
      socket.off("post-vote", handlePostVote);
      clearTimeout(fallbackTimeout);
    };
  }, [postId, commentSort]);

  if (postLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <LeftSidebar />
            <div className="flex-1 flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <RightSidebar />
          </div>
        </main>
        <MobileNavigation />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <LeftSidebar />
            <div className="flex-1">
              <Button
                variant="ghost"
                className="mb-4 flex items-center text-neutral hover:text-dark"
                onClick={() => navigate(`/r/${communityName}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to r/{communityName}
              </Button>
              
              <div className="bg-white rounded-lg border border-light-border p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
                <p className="text-neutral-dark mb-6">
                  The post you're looking for doesn't exist or has been removed.
                </p>
                <Button
                  onClick={() => navigate(`/r/${communityName}`)}
                  className="bg-primary hover:bg-primary-hover text-white"
                >
                  Return to r/{communityName}
                </Button>
              </div>
            </div>
            <RightSidebar />
          </div>
        </main>
        <MobileNavigation />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />
          
          <div className="flex-1">
            <Button
              variant="ghost"
              className="mb-4 flex items-center text-neutral hover:text-dark"
              onClick={() => navigate(`/r/${communityName}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to r/{communityName}
            </Button>
            
            {/* Post Content */}
            <PostCard post={post} />
            
            {/* Comment Section */}
            <div className="bg-white rounded-lg border border-light-border p-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Comments</h2>
                <div className="flex items-center text-sm">
                  <span className="mr-2">Sort by:</span>
                  <select
                    value={commentSort}
                    onChange={(e) => setCommentSort(e.target.value as "top" | "new" | "old")}
                    className="border border-light-border rounded py-1 px-2 text-sm"
                  >
                    <option value="top">Top</option>
                    <option value="new">New</option>
                    <option value="old">Old</option>
                  </select>
                </div>
              </div>
              
              {/* Comment Form */}
              <div className="mb-6">
                <CreateComment postId={parseInt(postId!)} />
              </div>
              
              {/* Comments List */}
              {commentsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                      <div className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.author?.avatarUrl || ""} alt={comment.author?.username || "User"} />
                          <AvatarFallback>
                            {comment.author?.username?.substring(0, 2).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.author?.displayName || comment.author?.username}</span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 mb-2">{comment.content}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                              <ThumbsUp className="w-4 h-4" />
                              {comment.upvotes || 0}
                            </button>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
                              <ThumbsDown className="w-4 h-4" />
                              {comment.downvotes || 0}
                            </button>
                            <button className="text-gray-500 hover:text-blue-600">Reply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-neutral-dark">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>
          
          <RightSidebar />
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}
