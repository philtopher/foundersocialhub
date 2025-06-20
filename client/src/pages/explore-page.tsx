import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Community, Post } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search, TrendingUp, Users, Globe, Shield, Lock, ArrowRight, Star, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";

export default function ExplorePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ communities: Community[]; posts: Post[] }>({
    communities: [],
    posts: []
  });

  const {
    data: trendingCommunities,
    isLoading: communitiesLoading,
  } = useQuery<Community[]>({
    queryKey: ["/api/communities/trending"],
  });

  const {
    data: trendingPosts,
    isLoading: postsLoading,
  } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults({ communities: [], posts: [] });
      return;
    }

    try {
      const [communitiesRes, postsRes] = await Promise.all([
        fetch(`/api/communities/search?q=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/posts/search?q=${encodeURIComponent(searchQuery)}`)
      ]);

      const communities = communitiesRes.ok ? await communitiesRes.json() : [];
      const posts = postsRes.ok ? await postsRes.json() : [];

      setSearchResults({ communities, posts });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ communities: [], posts: [] });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe size={16} className="text-green-500" />;
      case "restricted":
        return <Shield size={16} className="text-yellow-500" />;
      case "private":
        return <Lock size={16} className="text-red-500" />;
      default:
        return <Globe size={16} className="text-gray-500" />;
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">Discover new communities and trending content</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search communities and posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <Tabs defaultValue="communities" className="w-full">
              <TabsList>
                <TabsTrigger value="communities">
                  Communities ({searchResults.communities.length})
                </TabsTrigger>
                <TabsTrigger value="posts">
                  Posts ({searchResults.posts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="communities" className="space-y-4">
                {searchResults.communities.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No communities found for "{searchQuery}"</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {searchResults.communities.map((community) => (
                      <Card key={community.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{community.displayName}</CardTitle>
                            {getVisibilityIcon(community.visibility)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {truncateContent(community.description || "No description available")}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users size={16} />
                              <span>{community.memberCount} members</span>
                            </div>
                            <Link href={`/communities/${community.name}`}>
                              <Button size="sm" variant="outline">
                                Visit
                                <ArrowRight size={14} className="ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="posts" className="space-y-4">
                {searchResults.posts.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No posts found for "{searchQuery}"</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {searchResults.posts.map((post) => (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link href={`/posts/${post.id}`}>
                                <h3 className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer">
                                  {post.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground mb-3">
                                {truncateContent(post.content)}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>by {post.author?.username}</span>
                                <span>in {post.community?.displayName}</span>
                                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                <div className="flex items-center gap-1">
                                  <MessageCircle size={14} />
                                  <span>{post.commentCount}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!searchQuery && (
          <Tabs defaultValue="communities" className="w-full">
            <TabsList>
              <TabsTrigger value="communities">Trending Communities</TabsTrigger>
              <TabsTrigger value="posts">Popular Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="communities" className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-primary" />
                <h2 className="text-xl font-semibold">Trending Communities</h2>
              </div>

              {communitiesLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-muted rounded"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {trendingCommunities?.map((community) => (
                    <Card key={community.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{community.displayName}</CardTitle>
                          <div className="flex items-center gap-2">
                            {getVisibilityIcon(community.visibility)}
                            <Badge variant="secondary">
                              <Star size={12} className="mr-1" />
                              Trending
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          {truncateContent(community.description || "No description available")}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users size={16} />
                            <span>{community.memberCount} members</span>
                          </div>
                          <Link href={`/communities/${community.name}`}>
                            <Button size="sm" variant="outline">
                              Visit
                              <ArrowRight size={14} className="ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="posts" className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-primary" />
                <h2 className="text-xl font-semibold">Popular Posts</h2>
              </div>

              {postsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-6 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {trendingPosts?.slice(0, 10).map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/posts/${post.id}`}>
                              <h3 className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mb-3">
                              {truncateContent(post.content)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>by {post.author?.username}</span>
                              <span>in {post.community?.displayName}</span>
                              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                              <div className="flex items-center gap-1">
                                <MessageCircle size={14} />
                                <span>{post.commentCount}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            <TrendingUp size={12} className="mr-1" />
                            Popular
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <MobileNavigation />
    </div>
  );
}