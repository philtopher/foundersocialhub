import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { AccountSettings } from "@/components/profile/account-settings";
import { SubscriptionPanel } from "@/components/subscription/subscription-panel";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  if (!user) {
    // User not authenticated - this should be handled by the protected route
    return null;
  }
  
  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="py-4">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="account" className="py-4">
              <AccountSettings />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <SubscriptionPanel />
        </div>
      </div>
    </div>
  );
}