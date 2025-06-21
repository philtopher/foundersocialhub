import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { PostCard } from "@/components/post/post-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, MessageSquare, User, Search } from "lucide-react";
import { Link } from "wouter";

export default function SearchPage() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const query = urlParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<"posts" | "communities" | "users">("posts");

  // Search posts
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/search/posts", query],
    enabled: !!query && activeTab === "posts",
  });

  // Search communities
  const { data: communities, isLoading: communitiesLoading } = useQuery({
    queryKey: ["/api/search/communities", query],
    enabled: !!query && activeTab === "communities",
  });

  // Search users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/search/users", query],
    enabled: !!query && activeTab === "users",
  });

  if (!query) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-light-background">
          <div className="flex">
            <LeftSidebar />
            <div className="flex-1 max-w-4xl mx-auto px-4 py-6">
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-neutral mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Search FounderSocials</h2>
                <p className="text-neutral">Use the search bar above to find posts, communities, and users.</p>
              </div>
            </div>
            <RightSidebar />
          </div>
        </main>
        <MobileNavigation />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-light-background">
        <div className="flex">
          <LeftSidebar />
          <div className="flex-1 max-w-4xl mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Search Results</h1>
              <p className="text-neutral">Results for: "{query}"</p>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="communities">Communities</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                {postsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post: any) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-neutral mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No posts found</h3>
                    <p className="text-neutral">Try searching with different keywords.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="communities">
                {communitiesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : communities && communities.length > 0 ? (
                  <div className="grid gap-4">
                    {communities.map((community: any) => (
                      <Card key={community.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-12 w-12 rounded-full bg-light-darker flex-shrink-0"
                                style={{
                                  backgroundImage: community.iconUrl ? `url('${community.iconUrl}')` : undefined,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              />
                              <div>
                                <Link href={`/${community.name}`}>
                                  <h3 className="font-medium hover:underline cursor-pointer">
                                    {community.displayName}
                                  </h3>
                                </Link>
                                <p className="text-sm text-neutral">
                                  {community.memberCount} {community.memberCount === 1 ? 'member' : 'members'}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/${community.name}`}>View</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-neutral mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No communities found</h3>
                    <p className="text-neutral">Try searching with different keywords.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="users">
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : users && users.length > 0 ? (
                  <div className="grid gap-4">
                    {users.map((user: any) => (
                      <Card key={user.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={user.profileImageUrl || user.avatarUrl} />
                                <AvatarFallback className="bg-primary text-white">
                                  {user.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <Link href={`/u/${user.username}`}>
                                  <h3 className="font-medium hover:underline cursor-pointer">
                                    {user.displayName || user.username}
                                  </h3>
                                </Link>
                                <p className="text-sm text-neutral">@{user.username}</p>
                                {user.bio && (
                                  <p className="text-sm text-neutral-dark mt-1 max-w-md truncate">
                                    {user.bio}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/u/${user.username}`}>View Profile</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-neutral mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No users found</h3>
                    <p className="text-neutral">Try searching with different keywords.</p>
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