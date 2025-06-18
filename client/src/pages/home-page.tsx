import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Post, User, Community } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Footer } from "@/components/layout/footer";
import { CreatePostBox } from "@/components/post/create-post-box";
import { FeedSorting } from "@/components/post/feed-sorting";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { socket } from "@/lib/socket";
import { queryClient } from "@/lib/queryClient";

export default function HomePage() {
  const { user } = useAuth();
  const [sort, setSort] = useState<"hot" | "new" | "top">("hot");
  const [page, setPage] = useState(1);
  const [feedType, setFeedType] = useState<"all" | "subscribed">(
    user ? "subscribed" : "all"
  );

  // Update feed type when user logs in/out
  useEffect(() => {
    setFeedType(user ? "subscribed" : "all");
  }, [user]);

  // Real-time Socket.IO integration for live post votes
  useEffect(() => {
    const handlePostVote = (data: { postId: number; upvotes: number; downvotes: number }) => {
      console.log("Received post-vote event on home page:", data);
      
      // Update posts cache with new vote counts
      queryClient.setQueryData(["/api/posts", { sort, page, feed: feedType }], (oldPosts: any) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((post: Post & { author?: User; community?: Community }) => 
          post.id === data.postId 
            ? { ...post, upvotes: data.upvotes, downvotes: data.downvotes }
            : post
        );
      });
    };

    socket.on("post-vote", handlePostVote);

    return () => {
      socket.off("post-vote", handlePostVote);
    };
  }, [sort, page, feedType]);

  const { data: posts, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = 
    useQuery<(Post & { author?: User; community?: Community })[]>({
      queryKey: ["/api/posts", { sort, page, feed: feedType }],
    });

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
    fetchNextPage();
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />
          
          <div className="flex-1">
            <CreatePostBox />
            
            <FeedSorting
              currentSort={sort}
              onSortChange={(newSort) => {
                setSort(newSort);
                setPage(1);
              }}
            />
            
            {user && (
              <div className="bg-white rounded-lg border border-light-border p-3 mb-4">
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="ghost"
                    className={`font-medium rounded-full px-4 py-1 ${
                      feedType === "all" ? "bg-light text-dark" : "text-neutral"
                    }`}
                    onClick={() => setFeedType("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    className={`font-medium rounded-full px-4 py-1 ${
                      feedType === "subscribed" ? "bg-light text-dark" : "text-neutral"
                    }`}
                    onClick={() => setFeedType("subscribed")}
                  >
                    Subscribed
                  </Button>
                </div>
              </div>
            )}
            
            {isLoading ? (
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
                <h3 className="text-lg font-medium mb-2">No posts to show</h3>
                {feedType === "subscribed" ? (
                  <p className="text-neutral-dark">
                    Join some communities to see posts in your feed, or switch to "All" to see posts from all communities.
                  </p>
                ) : (
                  <p className="text-neutral-dark">
                    Be the first to create a post and start the conversation!
                  </p>
                )}
              </div>
            )}
          </div>
          
          <RightSidebar />
        </div>
      </main>
      <Footer />
      <MobileNavigation />
    </>
  );
}
