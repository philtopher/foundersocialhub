import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Community, Post } from "@shared/schema";
import { Link } from "wouter";
import { Compass, TrendingUp, Users, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ExplorePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: communities } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  const { data: trendingCommunities } = useQuery<Community[]>({
    queryKey: ["/api/communities/trending"],
  });

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const filteredCommunities = communities?.filter(community =>
    community.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (community.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />
          
          <div className="flex-1 max-w-4xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold flex items-center mb-4">
                <Compass className="h-6 w-6 mr-2" />
                Explore
              </h1>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search communities..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Trending Communities */}
            <div className="mb-8">
              <h2 className="text-xl font-bold flex items-center mb-4">
                <TrendingUp className="h-5 w-5 mr-2" />
                Trending Communities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingCommunities?.slice(0, 6).map((community) => (
                  <Link
                    key={community.id}
                    href={`/${community.name}`}
                    className="block p-4 bg-white rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className="w-12 h-12 rounded-full bg-cover bg-center mr-3"
                        style={{ backgroundImage: `url('${community.iconUrl}')` }}
                      />
                      <div>
                        <h3 className="font-bold text-foreground">{community.displayName}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {community.memberCount.toLocaleString()} members
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {community.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* All Communities */}
            <div className="mb-8">
              <h2 className="text-xl font-bold flex items-center mb-4">
                <Users className="h-5 w-5 mr-2" />
                All Communities
              </h2>
              <div className="space-y-3">
                {filteredCommunities?.map((community) => (
                  <Link
                    key={community.id}
                    href={`/${community.name}`}
                    className="block p-4 bg-white rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex items-start">
                      <div
                        className="w-16 h-16 rounded-lg bg-cover bg-center mr-4 flex-shrink-0"
                        style={{ backgroundImage: `url('${community.iconUrl}')` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-lg mb-1">
                          {community.displayName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {community.memberCount.toLocaleString()} members
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          Created {new Date(community.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-muted-foreground line-clamp-2">
                          {community.description}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        Join
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Posts */}
            <div>
              <h2 className="text-xl font-bold flex items-center mb-4">
                <TrendingUp className="h-5 w-5 mr-2" />
                Popular Posts
              </h2>
              <div className="space-y-4">
                {posts?.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-white rounded-lg border border-border"
                  >
                    <Link
                      href={`/post/${post.id}`}
                      className="block hover:text-primary"
                    >
                      <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                      <p className="text-muted-foreground line-clamp-2 mb-2">
                        {post.content}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>by user {post.authorId}</span>
                        <span className="mx-2">•</span>
                        <span>in community {post.communityId}</span>
                        <span className="mx-2">•</span>
                        <span>{post.upvotes} upvotes</span>
                        <span className="mx-2">•</span>
                        <span>{post.commentCount} comments</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}