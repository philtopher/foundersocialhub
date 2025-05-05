import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, User as UserIcon, CreditCard, Bell, Shield, Layout } from "lucide-react";
import { Link } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  displayName: z.string().optional(),
  bio: z.string().max(160).optional(),
  avatarUrl: z.string().optional(),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(false),
  newPostNotifications: z.boolean().default(true),
  commentReplies: z.boolean().default(true),
  mentionNotifications: z.boolean().default(true),
  messageNotifications: z.boolean().default(true),
});

const aiSettingsFormSchema = z.object({
  enableAICommentReview: z.boolean().default(true),
  defaultAIWorkflow: z.enum(["direct", "ai_workflow"]).default("direct"),
  allowAnonymousAIFeedback: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type AISettingsFormValues = z.infer<typeof aiSettingsFormSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      displayName: user?.displayName || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  // Notification form
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: user?.notificationSettings?.emailNotifications || false,
      pushNotifications: user?.notificationSettings?.pushNotifications || false,
      newPostNotifications: user?.notificationSettings?.newPostNotifications || true,
      commentReplies: user?.notificationSettings?.commentReplies || true,
      mentionNotifications: user?.notificationSettings?.mentionNotifications || true,
      messageNotifications: user?.notificationSettings?.messageNotifications || true,
    },
  });

  // AI Settings form
  const aiSettingsForm = useForm<AISettingsFormValues>({
    resolver: zodResolver(aiSettingsFormSchema),
    defaultValues: {
      enableAICommentReview: user?.aiSettings?.enableAICommentReview || true,
      defaultAIWorkflow: user?.aiSettings?.defaultAIWorkflow || "direct",
      allowAnonymousAIFeedback: user?.aiSettings?.allowAnonymousAIFeedback || false,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      return await apiRequest("PATCH", "/api/user/profile", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: async (values: NotificationsFormValues) => {
      return await apiRequest("PATCH", "/api/user/notifications", values);
    },
    onSuccess: () => {
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateAISettingsMutation = useMutation({
    mutationFn: async (values: AISettingsFormValues) => {
      return await apiRequest("PATCH", "/api/user/ai-settings", values);
    },
    onSuccess: () => {
      toast({
        title: "AI settings updated",
        description: "Your AI interaction preferences have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update AI settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate(data);
  }

  function onNotificationsSubmit(data: NotificationsFormValues) {
    updateNotificationsMutation.mutate(data);
  }

  function onAISettingsSubmit(data: AISettingsFormValues) {
    updateAISettingsMutation.mutate(data);
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center py-12">
            <div className="text-center bg-white p-8 rounded-lg border border-light-border shadow-sm max-w-md">
              <Shield className="h-12 w-12 text-neutral mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Login Required</h3>
              <p className="text-neutral-dark mb-6">
                You need to be logged in to access your settings.
              </p>
              <Button asChild>
                <Link href="/auth">Log In</Link>
              </Button>
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <div className="flex gap-6">
              <div className="w-1/4">
                <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1">
                  <TabsTrigger 
                    value="profile" 
                    className="justify-start px-4 py-2 h-auto text-left text-neutral-dark data-[state=active]:text-primary data-[state=active]:bg-light-darker"
                  >
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-5 w-5" />
                      <span>Profile</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="notifications" 
                    className="justify-start px-4 py-2 h-auto text-left text-neutral-dark data-[state=active]:text-primary data-[state=active]:bg-light-darker"
                  >
                    <div className="flex items-center">
                      <Bell className="mr-2 h-5 w-5" />
                      <span>Notifications</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="ai-settings" 
                    className="justify-start px-4 py-2 h-auto text-left text-neutral-dark data-[state=active]:text-primary data-[state=active]:bg-light-darker"
                  >
                    <div className="flex items-center">
                      <Layout className="mr-2 h-5 w-5" />
                      <span>AI Settings</span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="billing" 
                    className="justify-start px-4 py-2 h-auto text-left text-neutral-dark data-[state=active]:text-primary data-[state=active]:bg-light-darker"
                  >
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      <span>Billing</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="w-3/4 bg-white p-6 rounded-lg border border-light-border">
                <TabsContent value="profile" className="mt-0">
                  <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                  <Separator className="mb-6" />
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.avatarUrl || ""} alt={user.username} />
                        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{user.displayName || user.username}</h3>
                        <p className="text-sm text-neutral">u/{user.username}</p>
                      </div>
                    </div>
                  </div>

                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="username"
                                {...field}
                                disabled
                              />
                            </FormControl>
                            <FormDescription>
                              This is your registered username. It cannot be changed.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your display name"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is the name displayed to other users.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about yourself"
                                className="resize-none"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description for your profile. Max 160 characters.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="avatarUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Image URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              A URL to an image for your profile picture.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={updateProfileMutation.isPending}>
                        {updateProfileMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                  <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                  <Separator className="mb-6" />

                  <Form {...notificationsForm}>
                    <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-md font-medium">Notification Channels</h3>
                        
                        <FormField
                          control={notificationsForm.control}
                          name="emailNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Email Notifications
                                </FormLabel>
                                <FormDescription>
                                  Receive email notifications for important updates.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationsForm.control}
                          name="pushNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Push Notifications
                                </FormLabel>
                                <FormDescription>
                                  Receive push notifications in your browser.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-md font-medium">Notification Types</h3>
                        
                        <FormField
                          control={notificationsForm.control}
                          name="newPostNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  New Posts
                                </FormLabel>
                                <FormDescription>
                                  Get notified when communities you follow have new posts.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationsForm.control}
                          name="commentReplies"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Comment Replies
                                </FormLabel>
                                <FormDescription>
                                  Get notified when someone replies to your comments.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationsForm.control}
                          name="mentionNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Mentions
                                </FormLabel>
                                <FormDescription>
                                  Get notified when someone mentions you in a post or comment.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationsForm.control}
                          name="messageNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Messages
                                </FormLabel>
                                <FormDescription>
                                  Get notified when you receive new messages.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" disabled={updateNotificationsMutation.isPending}>
                        {updateNotificationsMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Preferences"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="ai-settings" className="mt-0">
                  <h2 className="text-xl font-semibold mb-4">AI Interaction Settings</h2>
                  <Separator className="mb-6" />

                  <Form {...aiSettingsForm}>
                    <form onSubmit={aiSettingsForm.handleSubmit(onAISettingsSubmit)} className="space-y-6">
                      <FormField
                        control={aiSettingsForm.control}
                        name="enableAICommentReview"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                AI Comment Moderation
                              </FormLabel>
                              <FormDescription>
                                Allow AI to review and moderate your comments for quality and helpfulness.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={aiSettingsForm.control}
                        name="defaultAIWorkflow"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Default Comment Workflow</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select comment workflow" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="direct">Post comments directly</SelectItem>
                                <SelectItem value="ai_workflow">
                                  Use AI workflow (generate research & analysis)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose how you want to submit comments by default. AI workflow helps with research and generates more detailed responses.
                              {user.subscriptionPlan !== "founder" && (
                                <p className="mt-1 text-amber-500">
                                  Note: Non-Founder plan users are limited to 3 AI workflow comments.
                                </p>
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={aiSettingsForm.control}
                        name="allowAnonymousAIFeedback"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Allow Anonymous AI Feedback
                              </FormLabel>
                              <FormDescription>
                                Let AI provide anonymous feedback on your comments to help improve quality.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={updateAISettingsMutation.isPending}>
                        {updateAISettingsMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save AI Settings"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="billing" className="mt-0">
                  <h2 className="text-xl font-semibold mb-4">Subscription & Billing</h2>
                  <Separator className="mb-6" />

                  <div className="rounded-md border border-light-border p-4 mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-md font-medium">Current Plan</h3>
                      <div>
                        {user.subscriptionPlan === "founder" ? (
                          <span className="inline-block bg-primary text-white text-xs py-1 px-2 rounded-full">Founder Plan</span>
                        ) : user.subscriptionPlan === "standard" ? (
                          <span className="inline-block bg-blue-500 text-white text-xs py-1 px-2 rounded-full">Standard Plan</span>
                        ) : (
                          <span className="inline-block bg-gray-500 text-white text-xs py-1 px-2 rounded-full">Free Plan</span>
                        )}
                      </div>
                    </div>

                    {user.subscriptionPlan === "founder" || user.subscriptionPlan === "standard" ? (
                      <div className="space-y-2">
                        <p className="text-sm">
                          Your subscription renews on <span className="font-medium">{user.subscriptionRenewalDate ? new Date(user.subscriptionRenewalDate).toLocaleDateString() : "--"}</span>
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Update Payment Method</Button>
                          <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">Cancel Subscription</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm">Upgrade to a paid plan to unlock premium features.</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Standard Plan</h4>
                            <p className="text-2xl font-bold mb-1">£7<span className="text-sm font-normal">/month</span></p>
                            <ul className="text-sm space-y-1 mb-4">
                              <li>✓ Ad-free browsing</li>
                              <li>✓ Create custom communities</li>
                              <li>✓ Basic AI features</li>
                            </ul>
                            <Button className="w-full" variant="outline" asChild>
                              <Link href="/subscription/standard">Subscribe</Link>
                            </Button>
                          </div>
                          
                          <div className="border rounded-lg p-4 border-primary bg-primary/5">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">Founder Plan</h4>
                              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Best Value</span>
                            </div>
                            <p className="text-2xl font-bold mb-1">£15<span className="text-sm font-normal">/month</span></p>
                            <ul className="text-sm space-y-1 mb-4">
                              <li>✓ Everything in Standard</li>
                              <li>✓ Unlimited AI workflows</li>
                              <li>✓ Advanced collaboration tools</li>
                              <li>✓ Early access to new features</li>
                            </ul>
                            <Button className="w-full" asChild>
                              <Link href="/subscription/founder">Subscribe</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {(user.subscriptionPlan === "founder" || user.subscriptionPlan === "standard") && (
                    <>
                      <h3 className="text-md font-medium mb-4">Billing History</h3>
                      <div className="rounded-md border border-light-border overflow-hidden">
                        <table className="min-w-full divide-y divide-light-border">
                          <thead className="bg-light">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">Amount</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">Invoice</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-light-border">
                            {user.billingHistory && user.billingHistory.length > 0 ? (
                              user.billingHistory.map((bill, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {new Date(bill.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {bill.amount}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                      {bill.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary hover:underline">
                                    <a href={bill.invoiceUrl}>Download</a>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-neutral">
                                  No billing history available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}
