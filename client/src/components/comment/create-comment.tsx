import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CreateCommentProps {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
}

export function CreateComment({ postId, parentId, onSuccess }: CreateCommentProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (data: CommentFormValues) => {
      const response = await apiRequest("POST", `/api/posts/${postId}/comments`, {
        ...data,
        parentId: parentId || null,
      });
      return await response.json();
    },
    onMutate: async (data: CommentFormValues) => {
      setIsSubmitting(true);
      
      // Create optimistic comment for instant display (Facebook-style)
      const optimisticComment = {
        id: Date.now(), // Temporary ID
        content: data.content,
        authorId: user?.id,
        postId: postId,
        parentId: parentId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        replyCount: 0,
        status: "approved",
        author: user,
        isOptimistic: true // Flag to identify optimistic updates
      };

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [`/api/posts/${postId}/comments`] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData([`/api/posts/${postId}/comments`, { sort: "top" }]);

      // Optimistically update to the new value
      queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "top" }], (old: any) => {
        return old ? [optimisticComment, ...old] : [optimisticComment];
      });
      queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "new" }], (old: any) => {
        return old ? [optimisticComment, ...old] : [optimisticComment];
      });

      // Return a context object with the snapshotted value
      return { previousComments, optimisticComment };
    },
    onSuccess: (newComment, variables, context) => {
      // Replace optimistic comment with real comment
      queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "top" }], (old: any) => {
        if (!old) return [newComment];
        return old.map((comment: any) => 
          comment.isOptimistic && comment.content === newComment.content 
            ? newComment 
            : comment
        );
      });
      queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "new" }], (old: any) => {
        if (!old) return [newComment];
        return old.map((comment: any) => 
          comment.isOptimistic && comment.content === newComment.content 
            ? newComment 
            : comment
        );
      });
      
      // Update post comment count
      queryClient.setQueryData([`/api/posts/${postId}`], (oldPost: any) => {
        if (!oldPost) return oldPost;
        return { ...oldPost, commentCount: (oldPost.commentCount || 0) + 1 };
      });
      
      reset();
      if (onSuccess) onSuccess();
    },
    onError: (error, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousComments) {
        queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "top" }], context.previousComments);
        queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "new" }], context.previousComments);
      }
      toast({
        title: "Error",
        description: `Failed to submit comment: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: CommentFormValues, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to comment",
        variant: "destructive",
      });
      return;
    }
    
    commentMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="border border-light-border rounded-md p-3 bg-light">
        <p className="text-sm text-center">
          Please <a href="/auth" className="text-secondary hover:underline">sign in</a> to comment
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex space-x-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.avatarUrl || ""} alt={user?.username || "User"} />
          <AvatarFallback>
            {user?.username?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="What are your thoughts?"
            {...register("content")}
            className="w-full resize-none border-light-border focus:border-secondary"
          />
          {errors.content && (
            <p className="text-destructive text-xs mt-1">{errors.content.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="rounded-full bg-primary hover:bg-primary-hover"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting
            </>
          ) : (
            "Comment"
          )}
        </Button>
      </div>
    </form>
  );
}
