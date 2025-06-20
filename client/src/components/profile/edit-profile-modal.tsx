import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Camera, User, Globe, Lock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const editProfileSchema = z.object({
  firstName: z.string().max(50, "First name cannot exceed 50 characters").optional(),
  lastName: z.string().max(50, "Last name cannot exceed 50 characters").optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  location: z.string().max(100, "Location cannot exceed 100 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  company: z.string().max(100, "Company cannot exceed 100 characters").optional(),
  jobTitle: z.string().max(100, "Job title cannot exceed 100 characters").optional(),
  profileImageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  coverImageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  privacy: z.enum(["public", "friends", "private"]),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"general" | "privacy" | "photos">("general");

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      company: user?.company || "",
      jobTitle: user?.jobTitle || "",
      profileImageUrl: user?.profileImageUrl || user?.avatarUrl || "",
      coverImageUrl: user?.coverImageUrl || "",
      privacy: user?.privacy || "public",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: EditProfileFormValues) => {
      return await apiRequest("PUT", "/api/user/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Invalidate user queries to refresh profile data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b border-light-border mb-6">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "general"
                ? "border-primary text-primary"
                : "border-transparent text-neutral hover:text-secondary"
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "photos"
                ? "border-primary text-primary"
                : "border-transparent text-neutral hover:text-secondary"
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "privacy"
                ? "border-primary text-primary"
                : "border-transparent text-neutral hover:text-secondary"
            }`}
          >
            Privacy
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell people about yourself..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Write a short bio about yourself (max 500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourwebsite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === "photos" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-light-darker rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={form.watch("profileImageUrl") || user?.profileImageUrl || user?.avatarUrl} />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Profile Picture</h3>
                    <p className="text-sm text-neutral">This will be visible to everyone</p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="profileImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Profile Image URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/profile.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for your profile picture
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Cover Image URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/cover.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for your cover photo (appears at the top of your profile)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Visibility</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select privacy level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <div>
                                <div className="font-medium">Public</div>
                                <div className="text-xs text-neutral">Anyone can see your profile</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="friends">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <div>
                                <div className="font-medium">Community Members</div>
                                <div className="text-xs text-neutral">Only community members can see your profile</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              <div>
                                <div className="font-medium">Private</div>
                                <div className="text-xs text-neutral">Only you can see your full profile</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Control who can see your profile information
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-light-darker p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Privacy Information</h3>
                  <ul className="text-sm text-neutral space-y-1">
                    <li>• Your username is always visible to other users</li>
                    <li>• Posts and comments follow community visibility rules</li>
                    <li>• Premium users have additional privacy controls</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-light-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-primary hover:bg-primary-hover text-white"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}