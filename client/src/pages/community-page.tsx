import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Community, Post, User } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { CreatePostBox } from "@/components/post/create-post-box";
import { FeedSorting } from "@/components/post/feed-sorting";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Info, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CommunityPage() {
  const { communityName } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sort, setSort] = useState<"hot" | "new" | "top">("hot");
  const [page, setPage] = useState(1);
  const [, navigate] = useLocation();

  const { data: community, isLoading: communityLoading } = useQuery<Community>({
    queryKey: [`/api/communities/${communityName}`],
  });

  const { data: membership } = useQuery({
    queryKey: [`/api/communities/${community?.id}/membership`],
    enabled: !!community?.id && !!user,
  });

  const { data: posts, isLoading: postsLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = 
    useQuery<(Post & { author?: User; community?: Community })[]>({
      queryKey: [`/api/communities/${community?.id}/posts`, { sort, page }],
      enabled: !!community?.id,
    });

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!community) return;
      return await apiRequest("POST", `/api/communities/${community.id}/join`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${community?.id}/membership`] });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityName}`] });
      toast({
        title: "Joined community",
        description: `You are now a member of r/${communityName}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to join community: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      if (!community) return;
      return await apiRequest("POST", `/api/communities/${community.id}/leave`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${community?.id}/membership`] });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityName}`] });
      toast({
        title: "Left community",
        description: `You have left r/${communityName}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to leave community: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleJoinToggle = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to join communities",
        variant: "destructive",
      });
      navigate(`/auth?redirect=/r/${communityName}`);
      return;
    }

    if (membership) {
      leaveMutation.mutate();
    } else {
      joinMutation.mutate();
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
    fetchNextPage();
  };

  if (communityLoading) {
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

  if (!community) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <LeftSidebar />
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-light-border p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Community Not Found</h2>
                <p className="text-neutral-dark mb-6">
                  The community {communityName} doesn't exist or has been removed.
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-primary hover:bg-primary-hover text-white"
                >
                  Return to Home
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

  return (
    <>
      <Header />
      
      {/* Community Banner */}
      {community.bannerUrl && (
        <div 
          className="h-32 md:h-48 w-full bg-cover bg-center" 
          style={{ backgroundImage: `url('${community.bannerUrl}')` }}
        />
      )}
      
      {/* Community Header */}
      <div className="bg-white border-b border-light-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <div 
              className="w-16 h-16 rounded-full bg-cover bg-center border-4 border-white -mt-8"
              style={{ backgroundImage: `url('${community.iconUrl}')` }}
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{community.name}</h1>
              <p className="text-neutral">{community.memberCount.toLocaleString()} members</p>
            </div>
            <div className="ml-auto">
              <Button
                variant={membership ? "outline" : "default"}
                className={membership 
                  ? "border-neutral-light text-neutral hover:bg-light-darker" 
                  : "bg-primary hover:bg-primary-hover text-white"
                }
                onClick={handleJoinToggle}
                disabled={joinMutation.isPending || leaveMutation.isPending}
              >
                {joinMutation.isPending || leaveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : membership ? (
                  "Joined"
                ) : (
                  "Join"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />
          
          <div className="flex-1">
            <CreatePostBox communityId={community.id} />
            
            <FeedSorting
              currentSort={sort}
              onSortChange={(newSort) => {
                setSort(newSort);
                setPage(1);
              }}
            />
            
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : posts && posts.length > 0 ? (
              <>
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
                
                <div className="text-center mt-4 mb-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={!hasNextPage || isFetchingNextPage}
                    className="px-6 py-2 bg-light-darker hover:bg-neutral-light rounded-full text-neutral-dark font-medium"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : hasNextPage ? (
                      "Load More"
                    ) : (
                      "No more posts"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-light-border p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-neutral-dark mb-4">
                  Be the first to create a post in this community!
                </p>
                <Button
                  onClick={() => navigate(`/r/${communityName}/submit`)}
                  className="bg-primary hover:bg-primary-hover text-white"
                >
                  Create Post
                </Button>
              </div>
            )}
          </div>
          
          <div className="hidden md:block w-72 flex-shrink-0">
            {/* Community Info Card */}
            <div className="bg-white rounded-lg border border-light-border p-4 mb-4">
              <h3 className="font-bold text-lg mb-2">About Community</h3>
              <p className="text-sm text-neutral-dark mb-4">{community.description}</p>
              
              <div className="flex items-center text-sm mb-3">
                <Users className="h-4 w-4 mr-2 text-neutral" />
                <span>{community.memberCount.toLocaleString()} members</span>
              </div>
              
              <div className="flex items-center text-sm mb-3">
                <Info className="h-4 w-4 mr-2 text-neutral" />
                <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
              </div>
              
              {community.visibility !== "public" && (
                <div className="flex items-center text-sm mb-3">
                  <Shield className="h-4 w-4 mr-2 text-neutral" />
                  <span>
                    {community.visibility === "restricted" 
                      ? "Restricted community" 
                      : "Private community"}
                  </span>
                </div>
              )}
              
              <Button
                variant={membership ? "outline" : "default"}
                className={`w-full ${membership 
                  ? "border-neutral-light text-neutral hover:bg-light-darker" 
                  : "bg-primary hover:bg-primary-hover text-white"
                }`}
                onClick={handleJoinToggle}
                disabled={joinMutation.isPending || leaveMutation.isPending}
              >
                {joinMutation.isPending || leaveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : membership ? (
                  "Joined"
                ) : (
                  "Join Community"
                )}
              </Button>
            </div>
            
            {/* Community Rules Card */}
            <div className="bg-white rounded-lg border border-light-border p-4 mb-4">
              <h3 className="font-bold text-lg mb-2">Community Rules</h3>
              <ul className="text-sm text-neutral-dark space-y-2">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Be respectful and constructive</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>No self-promotion without context</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Keep content relevant to the community</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>No duplicate posts</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">5.</span>
                  <span>Follow Reddit's content policy</span>
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
