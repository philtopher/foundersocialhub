import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Comment, User } from "@shared/schema";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [replying, setReplying] = useState<number | null>(null);
  
  const { data: comments, isLoading } = useQuery<(Comment & { author?: User })[]>({
    queryKey: [`/api/posts/${postId}/comments`],
  });
  
  const handleReplySuccess = () => {
    setReplying(null);
  };
  
  const handleReplyClick = (commentId: number) => {
    setReplying(replying === commentId ? null : commentId);
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      
      <CommentForm postId={postId} user={user} />
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem 
                comment={comment}
                onReplyClick={() => handleReplyClick(comment.id)}
                isReplying={replying === comment.id}
                currentUser={user}
              />
              
              {replying === comment.id && (
                <div className="ml-12 mt-4">
                  <CommentForm 
                    postId={postId} 
                    parentId={comment.id} 
                    user={user} 
                    onSuccess={handleReplySuccess}
                    placeholder={`Reply to ${comment.author?.username || 'comment'}...`}
                    invitingUser={user?.subscriptionPlan && ["standard", "founder"].includes(user.subscriptionPlan) 
                      ? {
                          username: user.username,
                          displayName: user.displayName
                        }
                      : undefined
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-light rounded-lg p-6 text-center">
          <p className="text-neutral-dark">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}
