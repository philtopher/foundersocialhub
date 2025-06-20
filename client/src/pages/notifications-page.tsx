import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Bell, Check, MessageSquare, Heart, UserPlus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">Please log in to view notifications.</div>
        </main>
        <MobileNavigation />
      </>
    );
  }

  // Mock notifications for now - in a real app these would come from an API
  const notifications = [
    {
      id: 1,
      type: "comment",
      icon: MessageSquare,
      title: "New comment on your post",
      description: "Someone commented on 'How to find cofounders'",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "like",
      icon: Heart,
      title: "Your post was liked",
      description: "5 people liked your post about startup funding",
      time: "4 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "follow",
      icon: UserPlus,
      title: "New follower",
      description: "john_doe started following you",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "trending",
      icon: TrendingUp,
      title: "Your post is trending",
      description: "Your post is getting lots of engagement in r/startups",
      time: "2 days ago",
      read: true,
    },
  ];

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />
          
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center">
                <Bell className="h-6 w-6 mr-2" />
                Notifications
              </h1>
              <Button variant="outline" size="sm">
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            </div>

            <div className="space-y-3">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read 
                        ? "bg-white border-border" 
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        notification.read 
                          ? "bg-gray-100" 
                          : "bg-blue-100"
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          notification.read 
                            ? "text-gray-600" 
                            : "text-blue-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No notifications yet
                </h3>
                <p className="text-muted-foreground">
                  When you get notifications, they'll show up here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}