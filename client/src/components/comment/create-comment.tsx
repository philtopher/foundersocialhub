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
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: (newComment) => {
      reset();
      // Immediately update all possible comment query variations
      const updateFn = (oldComments: any) => {
        if (!oldComments) return [newComment];
        // Check if comment already exists to avoid duplicates
        const exists = oldComments.some((c: any) => c.id === newComment.id);
        if (exists) return oldComments;
        return [newComment, ...oldComments];
      };
      
      // Update all sort variations
      queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "top" }], updateFn);
      queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "new" }], updateFn);
      queryClient.setQueryData([`/api/posts/${postId}/comments`, { sort: "old" }], (oldComments: any) => {
        if (!oldComments) return [newComment];
        const exists = oldComments.some((c: any) => c.id === newComment.id);
        if (exists) return oldComments;
        return [...oldComments, newComment];
      });
      
      // Force refetch to ensure UI updates
      queryClient.invalidateQueries({ 
        queryKey: [`/api/posts/${postId}/comments`],
        exact: false,
        refetchType: 'active'
      });
      
      // Update post comment count
      queryClient.setQueryData([`/api/posts/${postId}`], (oldPost: any) => {
        if (!oldPost) return oldPost;
        return { ...oldPost, commentCount: (oldPost.commentCount || 0) + 1 };
      });
      
      if (onSuccess) onSuccess();
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully",
      });
    },
    onError: (error) => {
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
