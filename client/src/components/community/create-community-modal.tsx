import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import { useLocation } from "wouter";

// Schema aligned with the server-side validation
const communitySchema = z.object({
  name: z
    .string()
    .min(3, "Community name must be at least 3 characters")
    .max(21, "Community name must be less than 22 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed"),
  displayName: z
    .string()
    .min(3, "Display name must be at least 3 characters")
    .max(100, "Display name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  visibility: z.enum(["public", "restricted", "private"]),
});

type CommunityFormValues = z.infer<typeof communitySchema>;

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCommunityModal({ isOpen, onClose }: CreateCommunityModalProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      visibility: "public",
    },
  });

  const createCommunityMutation = useMutation({
    mutationFn: async (data: CommunityFormValues) => {
      return await apiRequest("POST", "/api/communities", data);
    },
    onSuccess: async (response) => {
      const community = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/communities"] });
      form.reset();
      onClose();
      toast({
        title: "Community created",
        description: `r/${community.name} has been created successfully`,
      });
      navigate(`/r/${community.name}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create community: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CommunityFormValues) => {
    createCommunityMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create a Community</DialogTitle>
          <DialogDescription>
            Create a community to share ideas, discuss topics, or connect with like-minded founders.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name</FormLabel>
                  <div className="flex items-center">
                    <span className="text-neutral mr-1">r/</span>
                    <FormControl>
                      <Input
                        placeholder="community_name"
                        {...field}
                        className="flex-1 p-2 border border-light-border rounded"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Community names cannot be changed later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Community Display Name"
                      {...field}
                      className="p-2 border border-light-border rounded"
                    />
                  </FormControl>
                  <FormDescription>
                    This will be shown on the community page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell potential members what your community is about"
                      className="w-full p-2 border border-light-border rounded h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="public" id="public" className="mt-1" />
                        <div>
                          <label htmlFor="public" className="font-medium block">Public</label>
                          <span className="text-xs text-neutral">Anyone can view, post, and comment</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="restricted" id="restricted" className="mt-1" />
                        <div>
                          <label htmlFor="restricted" className="font-medium block">Restricted</label>
                          <span className="text-xs text-neutral">Anyone can view, but only approved users can post</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="private" id="private" className="mt-1" />
                        <div>
                          <label htmlFor="private" className="font-medium block">Private</label>
                          <span className="text-xs text-neutral">Only approved users can view and post</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2 border border-light-border rounded-full text-neutral-dark hover:bg-light"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCommunityMutation.isPending}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-full"
              >
                {createCommunityMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Community"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
