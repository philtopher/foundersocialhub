import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Loader2 } from "lucide-react";

const communitySchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(21, "Name cannot exceed 21 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Name can only contain letters, numbers, and underscores"),
  displayName: z.string()
    .min(3, "Display name must be at least 3 characters")
    .max(50, "Display name cannot exceed 50 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  visibility: z.enum(["public", "private"]),
  iconUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
});

type CommunityFormValues = z.infer<typeof communitySchema>;

export function CreateCommunityBox() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      visibility: "public",
      iconUrl: "",
      bannerUrl: "",
    },
  });

  const createCommunityMutation = useMutation({
    mutationFn: async (data: CommunityFormValues) => {
      return await apiRequest("POST", "/api/communities", {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        visibility: data.visibility,
        iconUrl: data.iconUrl || undefined,
        bannerUrl: data.bannerUrl || undefined,
      });
    },
    onSuccess: async () => {
      toast({
        title: "Community created",
        description: "Your community has been created successfully.",
      });
      
      // Reset form and close dialog
      form.reset();
      setIsOpen(false);
      
      // Invalidate queries to refresh the communities list
      queryClient.invalidateQueries({ queryKey: ["/api/communities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/communities/trending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/communities"] });
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

  const handleOpenDialog = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to create a community.",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="w-full bg-primary hover:bg-primary-hover text-white mb-4"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Community
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Create Community
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community Name</FormLabel>
                    <FormControl>
                      <Input placeholder="mycommunity" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used in the URL. Only letters, numbers, and underscores allowed.
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
                      <Input placeholder="My Awesome Community" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is how your community will appear to users.
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell people what your community is about..."
                        className="min-h-[80px]"
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
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can join</SelectItem>
                        <SelectItem value="private">Private - Invite only</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="iconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/icon.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL to an image for your community icon.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/banner.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL to an image for your community banner.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCommunityMutation.isPending}
                  className="bg-primary hover:bg-primary-hover text-white"
                >
                  {createCommunityMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Create Community
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}