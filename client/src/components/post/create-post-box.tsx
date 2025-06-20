import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Community } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Image, Link2, BarChart2, Loader2 } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(300, "Title cannot exceed 300 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  communityId: z.string().min(1, "Please select a community"),
  imageUrl: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export function CreatePostBox({ communityId }: { communityId?: number }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showImageField, setShowImageField] = useState(false);

  const { data: communities } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      communityId: communityId ? communityId.toString() : "",
      imageUrl: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      const communityIdNum = parseInt(data.communityId);
      return await apiRequest("POST", `/api/communities/${communityIdNum}/posts`, {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || undefined,
      });
    },
    onSuccess: async () => {
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
      
      // Reset form and close dialog
      form.reset();
      setIsOpen(false);
      setShowImageField(false);
      
      // Invalidate queries to refresh the feed
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PostFormValues) => {
    createPostMutation.mutate(data);
  };

  const handleOpenDialog = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to create a post.",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(true);
  };
  
  return (
    <>
      <div className="bg-white rounded-lg border border-light-border p-3 mb-4">
        <div className="flex items-center">
          <Avatar className="h-9 w-9 mr-2">
            <AvatarImage src={user?.avatarUrl || ""} alt={user?.username || "User avatar"} />
            <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <Input
            type="text"
            placeholder="Create post"
            className="flex-1 bg-light rounded-md border border-light-border p-2 hover:border-neutral focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
            onClick={handleOpenDialog}
            onFocus={handleOpenDialog}
            readOnly
          />
        </div>
        
        <div className="flex mt-3 border-t border-light-border pt-3">
          <Button variant="ghost" className="flex items-center text-neutral hover:bg-light-darker rounded-full px-3 py-1 mr-2" onClick={handleOpenDialog}>
            <Image className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Image</span>
          </Button>
          <Button variant="ghost" className="flex items-center text-neutral hover:bg-light-darker rounded-full px-3 py-1 mr-2" onClick={handleOpenDialog}>
            <Link2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Link</span>
          </Button>
          <Button variant="ghost" className="flex items-center text-neutral hover:bg-light-darker rounded-full px-3 py-1" onClick={handleOpenDialog}>
            <BarChart2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Poll</span>
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a community" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {communities?.map((community) => (
                          <SelectItem key={community.id} value={community.id.toString()}>
                            {community.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="What's your post about?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your thoughts..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {showImageField && (
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Paste image URL here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageField(!showImageField)}
                >
                  <Image className="h-4 w-4 mr-2" />
                  {showImageField ? "Remove Image" : "Add Image"}
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createPostMutation.isPending}
                    className="bg-primary hover:bg-primary-hover text-white"
                  >
                    {createPostMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
