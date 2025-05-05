import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, X } from "lucide-react";
import { Comment, User } from "@shared/schema";

const responseSchema = z.object({
  response: z.string().min(1, "Response cannot be empty"),
});

type ResponseFormValues = z.infer<typeof responseSchema>;

interface AIModeratedCommentProps {
  comment: Comment & {
    author?: User;
  };
  onCancel: () => void;
}

export function AIModeratedComment({ comment, onCancel }: AIModeratedCommentProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      response: "",
    },
  });

  const respondMutation = useMutation({
    mutationFn: async (data: ResponseFormValues) => {
      return await apiRequest("POST", `/api/comments/${comment.id}/respond-to-ai`, data);
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${comment.postId}/comments`] });
      toast({
        title: "Response submitted",
        description: "Your comment will be published after processing your response.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to submit response: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ResponseFormValues) => {
    respondMutation.mutate(data);
  };

  const handlePublishWithoutChanges = () => {
    respondMutation.mutate({ response: "I'd like to post my comment as is." });
  };

  return (
    <div className="bg-light p-2 rounded-md mb-2 border border-light-border">
      <div className="flex items-center text-xs text-neutral-dark mb-1">
        <Bot className="h-3 w-3 mr-1 text-secondary" />
        <span>This comment is awaiting AI moderation</span>
      </div>
      <p className="text-sm font-medium">{comment.content}</p>
      <div className="mt-2 border-t border-light-border pt-2">
        <p className="text-xs text-secondary">
          <strong>AI:</strong> {comment.aiPrompt}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
          <Textarea
            placeholder="Your response..."
            {...register("response")}
            className="w-full text-xs resize-none border-light-border focus:border-secondary h-20"
          />
          {errors.response && (
            <p className="text-destructive text-xs mt-1">{errors.response.message}</p>
          )}
          <div className="flex mt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs bg-secondary text-white px-2 py-1 rounded-md hover:bg-secondary-hover h-auto"
            >
              Reply to AI
            </Button>
            <Button
              type="button"
              onClick={handlePublishWithoutChanges}
              disabled={isSubmitting}
              className="text-xs border border-light-border px-2 py-1 rounded-md hover:bg-light-darker ml-2 h-auto"
            >
              Publish Without Changes
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="ghost"
              className="text-xs text-neutral hover:text-neutral-dark ml-auto h-auto p-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
