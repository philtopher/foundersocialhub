import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Community } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Search, Plus, Users, Lock, Globe, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { CreateCommunityBox } from "@/components/community/create-community-box";

type CommunityWithRole = Community & { role: string };

export default function MyCommunitiesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommunities, setFilteredCommunities] = useState<CommunityWithRole[]>([]);

  const {
    data: communities,
    isLoading,
  } = useQuery<CommunityWithRole[]>({
    queryKey: ["/api/user/communities"],
    enabled: !!user,
  });

  useEffect(() => {
    if (communities) {
      if (searchQuery.trim() === "") {
        setFilteredCommunities(communities);
      } else {
        const lowercasedQuery = searchQuery.toLowerCase();
        setFilteredCommunities(
          communities.filter(
            (community) =>
              community.name.toLowerCase().includes(lowercasedQuery) ||
              community.displayName.toLowerCase().includes(lowercasedQuery)
          )
        );
      }
    }
  }, [communities, searchQuery]);

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe size={16} className="text-neutral" />;
      case "restricted":
        return <Shield size={16} className="text-neutral" />;
      case "private":
        return <Lock size={16} className="text-neutral" />;
      default:
        return <Globe size={16} className="text-neutral" />;
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Communities</h1>
            <div className="w-48">
              <CreateCommunityBox />
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search communities"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral" />
            </div>
          </div>

          <Tabs defaultValue="joined">
            <TabsList className="mb-4">
              <TabsTrigger value="joined">Joined Communities</TabsTrigger>
              <TabsTrigger value="moderated">Moderated Communities</TabsTrigger>
            </TabsList>

            <TabsContent value="joined">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredCommunities && filteredCommunities.length > 0 ? (
                <div className="space-y-3">
                  {filteredCommunities.map((community) => (
                    <div
                      key={community.id}
                      className="bg-white rounded-lg border border-light-border p-4 hover:border-neutral-light transition-colors"
                    >
                      <div className="flex items-center">
                        <div
                          className="h-10 w-10 rounded-full bg-light-darker flex-shrink-0 mr-3"
                          style={{
                            backgroundImage: `url('${community.iconUrl}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Link href={`/${community.name}`}>
                              <h3 className="font-medium hover:underline cursor-pointer">
                                {community.displayName}
                              </h3>
                            </Link>
                            {getVisibilityIcon(community.visibility)}
                          </div>
                          <p className="text-sm text-neutral">{community.name}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            <Users size={16} className="text-neutral mr-1" />
                            <span className="text-sm text-neutral">{community.memberCount}</span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/${community.name}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-light-border">
                  <Users className="h-12 w-12 text-neutral mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No communities found</h3>
                  <p className="text-neutral-dark mb-4">
                    {searchQuery
                      ? "No communities match your search criteria."
                      : "You haven't joined any communities yet."}
                  </p>
                  <Button asChild>
                    <Link href="/explore">Explore Communities</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="moderated">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredCommunities && filteredCommunities.filter(c => c.role === "admin" || c.role === "moderator").length > 0 ? (
                <div className="space-y-3">
                  {filteredCommunities
                    .filter(c => c.role === "admin" || c.role === "moderator")
                    .map((community) => (
                      <div
                        key={community.id}
                        className="bg-white rounded-lg border border-light-border p-4 hover:border-neutral-light transition-colors"
                      >
                        <div className="flex items-center">
                          <div
                            className="h-10 w-10 rounded-full bg-light-darker flex-shrink-0 mr-3"
                            style={{
                              backgroundImage: `url('${community.iconUrl}')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Link href={`/${community.name}`}>
                                <h3 className="font-medium hover:underline cursor-pointer">
                                  {community.displayName}
                                </h3>
                              </Link>
                              {getVisibilityIcon(community.visibility)}
                              <span className="text-xs px-2 py-0.5 bg-primary-light text-primary rounded-full">
                                {community.role === "admin" ? "Admin" : "Moderator"}
                              </span>
                            </div>
                            <p className="text-sm text-neutral">{community.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/${community.name}`}>View</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/${community.name}/mod`}>Moderate</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-light-border">
                  <Shield className="h-12 w-12 text-neutral mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No moderated communities</h3>
                  <p className="text-neutral-dark mb-4">
                    You don't moderate any communities yet.
                  </p>
                  <Button asChild>
                    <Link href="/create-community">Create a Community</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}
