import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, Post, Comment } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Calendar, MessageSquare, Award } from "lucide-react";
import { format } from "date-fns";
import { CommentItem } from "@/components/comment/comment-item";
import { useAuth } from "@/hooks/use-auth";

export default function UserProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  
  // If no username in params, show current user's profile
  const isOwnProfile = !username;
  const profileUsername = username || currentUser?.username;
  
  const { data: user, isLoading: userLoading } = useQuery<Omit<User, "password">>({
    queryKey: isOwnProfile ? ["/api/user"] : [`/api/users/${profileUsername}`],
    enabled: !!profileUsername,
  });

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: [`/api/users/${profileUsername}/posts`],
    enabled: !!user && !!profileUsername,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: [`/api/users/${profileUsername}/comments`],
    enabled: !!user && !!profileUsername,
  });

  if (userLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <LeftSidebar />
            <div className="flex-1 flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <RightSidebar />
          </div>
        </main>
        <MobileNavigation />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <LeftSidebar />
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-light-border p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
                <p className="text-neutral-dark mb-6">
                  The user u/{username} doesn't exist or has been removed.
                </p>
                <Button
                  onClick={() => window.history.back()}
                  className="bg-primary hover:bg-primary-hover text-white"
                >
                  Go Back
                </Button>
              </div>
            </div>
            <RightSidebar />
          </div>
        </main>
        <MobileNavigation />
      </>
    );
  }

  const isCurrentUser = currentUser?.id === user.id;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />
          
          <div className="flex-1">
            {/* User Profile Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatarUrl || ""} alt={user.username} />
                    <AvatarFallback className="text-2xl">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold mb-1">u/{user.username}</h1>
                    {user.displayName && (
                      <p className="text-lg mb-2">{user.displayName}</p>
                    )}
                    {user.bio && (
                      <p className="text-neutral-dark mb-3">{user.bio}</p>
                    )}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-neutral">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{posts?.length || 0} posts</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{user.isPremium ? "Premium Member" : "Member"}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isCurrentUser && (
                    <Button
                      variant="outline"
                      className="border-neutral-light text-neutral hover:bg-light-darker"
                      onClick={() => {/* Navigate to edit profile page */}}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Posts and Comments Tabs */}
            <Tabs defaultValue="posts" className="mb-6">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts">
                {postsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map(post => (
                      <PostCard key={post.id} post={{...post, author: user as any}} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-light-border p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                    <p className="text-neutral-dark">
                      {isCurrentUser 
                        ? "You haven't created any posts yet. Share your thoughts with the community!"
                        : `u/${user.username} hasn't created any posts yet.`
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="comments">
                {commentsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : comments && comments.length > 0 ? (
                  <div className="space-y-6 bg-white rounded-lg border border-light-border p-6">
                    <h2 className="text-lg font-medium mb-4">Recent Comments</h2>
                    {comments.map(comment => (
                      <div key={comment.id} className="border-b border-light-border pb-4 last:border-0">
                        <p className="text-xs text-neutral mb-2">
                          On post:{' '}
                          <a 
                            href={`/post/${comment.postId}`}
                            className="hover:underline text-secondary"
                          >
                            Post #{comment.postId}
                          </a>
                        </p>
                        <CommentItem 
                          comment={{...comment, author: {...user, password: ''} as any}}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-light-border p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">No comments yet</h3>
                    <p className="text-neutral-dark">
                      {isCurrentUser 
                        ? "You haven't made any comments yet. Join the conversation!"
                        : `u/${user.username} hasn't made any comments yet.`
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <RightSidebar />
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}
