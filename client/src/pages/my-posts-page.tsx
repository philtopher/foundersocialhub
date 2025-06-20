import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { PostCard } from "@/components/post/post-card";
import { Post } from "@shared/schema";
import { FileText, Plus } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MyPostsPage() {
  const { user } = useAuth();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: [`/api/users/${user?.username}/posts`],
    enabled: !!user,
  });

  if (!user) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">Please log in to view your posts.</div>
        </main>
        <MobileNavigation />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />
          
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                My Posts
              </h1>
              <Link href="/create-post">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-white rounded-lg border border-border animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={{...post, author: user}} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No posts yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any posts yet. Share your thoughts with the community!
                </p>
                <Link href="/create-post">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}