import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Community } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { ArrowLeft, Image, Link as LinkIcon, Loader2 } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(300, "Title cannot exceed 300 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  communityId: z.string().min(1, "Please select a community"),
  imageUrl: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function CreatePostPage() {
  const { communityName } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showImageField, setShowImageField] = useState(false);

  const { data: communities } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  const { data: selectedCommunity } = useQuery<Community>({
    queryKey: [`/api/communities/${communityName}`],
    enabled: !!communityName,
  });

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      communityId: selectedCommunity ? selectedCommunity.id.toString() : "",
      imageUrl: "",
    },
  });

  // Update form values when selected community loads
  React.useEffect(() => {
    if (selectedCommunity) {
      form.setValue("communityId", selectedCommunity.id.toString());
    }
  }, [selectedCommunity, form]);

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      const communityId = parseInt(data.communityId);
      return await apiRequest("POST", `/api/communities/${communityId}/posts`, {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || undefined,
      });
    },
    onSuccess: async (response) => {
      const post = await response.json();
      const community = communities?.find(c => c.id.toString() === form.getValues().communityId);
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
      
      navigate(`/${community?.name}/post/${post.id}`);
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

  if (!user) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <LeftSidebar />
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-light-border p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                <p className="text-neutral-dark mb-6">
                  You need to be logged in to create a post.
                </p>
                <Link href="/auth?redirect=/submit">
                  <Button className="bg-primary hover:bg-primary-hover text-white">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
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
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                className="flex items-center text-neutral hover:text-dark"
                onClick={() => navigate(communityName ? `/${communityName}` : "/")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {communityName ? `Back to ${communityName}` : "Back to Home"}
              </Button>
              <h1 className="text-xl font-bold ml-4">Create a Post</h1>
            </div>
            
            <div className="bg-white rounded-lg border border-light-border p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="communityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a community" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {communities?.map((community) => (
                              <SelectItem key={community.id} value={community.id.toString()}>
                                {community.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the community where you want to post.
                        </FormDescription>
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
                          <Input
                            placeholder="Title of your post"
                            {...field}
                            className="p-2 border border-light-border rounded"
                          />
                        </FormControl>
                        <FormDescription>
                          Keep your title clear and descriptive.
                        </FormDescription>
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
                            placeholder="Write your post content here..."
                            className="min-h-[200px] p-2 border border-light-border rounded"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`flex items-center ${showImageField ? 'bg-light text-primary' : ''}`}
                      onClick={() => setShowImageField(!showImageField)}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                      disabled={true}
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  
                  {showImageField && (
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Paste the image URL here"
                              {...field}
                              className="p-2 border border-light-border rounded"
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a direct link to an image (JPG, PNG, GIF).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={() => navigate(communityName ? `/${communityName}` : "/")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-hover text-white"
                      disabled={createPostMutation.isPending}
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
                </form>
              </Form>
            </div>
          </div>
          
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-lg border border-light-border p-4">
              <h3 className="font-bold text-lg mb-3">Posting Guidelines</h3>
              <ul className="text-sm text-neutral-dark space-y-3">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Be respectful and constructive in your posts.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Make sure your post is relevant to the community.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Use a clear, specific title that describes your content.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>Check for duplicate posts before submitting.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">5.</span>
                  <span>Add value to the community with your content.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}
