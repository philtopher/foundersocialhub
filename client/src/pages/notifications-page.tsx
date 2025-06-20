import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Bell, MessageCircle, Heart, UserPlus, TrendingUp, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: number;
  type: "comment" | "upvote" | "follow" | "mention" | "community";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedPostId?: number;
  relatedUserId?: number;
  relatedCommunityId?: number;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Mock notifications for demonstration
  const mockNotifications: Notification[] = [
    {
      id: 1,
      type: "comment",
      title: "New comment on your post",
      message: "stanley1 commented on 'How to find cofounders'",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      relatedPostId: 5,
      relatedUserId: 11
    },
    {
      id: 2,
      type: "upvote",
      title: "Your post was upvoted",
      message: "Your post 'My journey from $0 to $50k MRR' received an upvote",
      read: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      relatedPostId: 2
    },
    {
      id: 3,
      type: "community",
      title: "New activity in startups",
      message: "There are 3 new posts in the startups community",
      read: false,
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      relatedCommunityId: 2
    }
  ];

  const filteredNotifications = filter === "unread" 
    ? mockNotifications.filter(n => !n.read)
    : mockNotifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageCircle size={20} className="text-blue-500" />;
      case "upvote":
        return <Heart size={20} className="text-red-500" />;
      case "follow":
        return <UserPlus size={20} className="text-green-500" />;
      case "community":
        return <TrendingUp size={20} className="text-purple-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const markAsRead = (notificationId: number) => {
    // This would typically make an API call to mark the notification as read
    console.log(`Marking notification ${notificationId} as read`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your latest activity</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All ({mockNotifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
          >
            Unread ({mockNotifications.filter(n => !n.read).length})
          </Button>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {filter === "unread" 
                    ? "You're all caught up! No unread notifications."
                    : "You don't have any notifications yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  !notification.read ? "border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline">
              Load more notifications
            </Button>
          </div>
        )}
      </div>

      <MobileNavigation />
    </div>
  );
}