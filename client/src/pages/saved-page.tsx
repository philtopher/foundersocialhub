import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Post, User, Community } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post/post-card";
import { Loader2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function SavedPage() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("posts");

  const {
    data: savedPosts,
    isLoading: isLoadingPosts,
  } = useQuery<(Post & { author?: User; community?: Community })[]>({
    queryKey: ["/api/user/saved/posts"],
    enabled: !!user && currentTab === "posts",
  });

  const {
    data: savedComments,
    isLoading: isLoadingComments,
  } = useQuery<any[]>({
    queryKey: ["/api/user/saved/comments"],
    enabled: !!user && currentTab === "comments",
  });

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4 mx-auto">
            <h1 className="text-2xl font-bold mb-6">Saved Items</h1>

            <Tabs 
              defaultValue="posts" 
              value={currentTab} 
              onValueChange={setCurrentTab}
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                {isLoadingPosts ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : savedPosts && savedPosts.length > 0 ? (
                  <div className="space-y-4">
                    {savedPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-light-border">
                    <Bookmark className="h-12 w-12 text-neutral mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No saved posts</h3>
                    <p className="text-neutral-dark mb-4">
                      You haven't saved any posts yet. When you find something interesting, click the Save button to find it here later.
                    </p>
                    <Button asChild>
                      <Link href="/">Browse Posts</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments">
                {isLoadingComments ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : savedComments && savedComments.length > 0 ? (
                  <div className="space-y-4 bg-white rounded-lg border border-light-border p-4">
                    {savedComments.map((comment) => (
                      <div key={comment.id} className="border-b border-light-border pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start mb-2">
                          <div
                            className="h-8 w-8 rounded-full bg-light-darker flex-shrink-0 mr-2"
                            style={{
                              backgroundImage: `url('${comment.author?.avatarUrl}')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                          <div>
                            <div className="flex items-center gap-1 text-sm">
                              <Link href={`/u/${comment.author?.username}`} className="font-medium hover:underline">
                                u/{comment.author?.username}
                              </Link>
                              <span className="text-neutral mx-1">in</span>
                              <Link href={`/${comment.post?.community?.name}/post/${comment.post?.id}`} className="hover:underline">
                                {comment.post?.title}
                              </Link>
                            </div>
                            <p className="text-xs text-neutral">{new Date(comment.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="pl-10">
                          <p className="mb-2">{comment.content}</p>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/${comment.post?.community?.name}/post/${comment.post?.id}?comment=${comment.id}`}>
                                View Context
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-light-border">
                    <Bookmark className="h-12 w-12 text-neutral mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No saved comments</h3>
                    <p className="text-neutral-dark mb-4">
                      You haven't saved any comments yet. When you find a helpful comment, save it to reference later.
                    </p>
                    <Button asChild>
                      <Link href="/">Browse Posts</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}
