import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Community } from "@shared/schema";
import { CommunityCard } from "./community-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export function TrendingCommunities() {
  const { user } = useAuth();
  
  const { data: communities, isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities/trending"],
  });
  
  const { data: userCommunities } = useQuery<Community[]>({
    queryKey: ["/api/user/communities"],
    enabled: !!user,
  });
  
  // Check if user is a member of a community
  const isMember = (communityId: number) => {
    if (!userCommunities) return false;
    return userCommunities.some(c => c.id === communityId);
  };
  
  return (
    <div className="bg-white rounded-lg border border-border p-4 mb-4">
      <h3 className="font-bold text-lg mb-3">Trending Communities</h3>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="ml-auto h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {communities?.map(community => (
            <CommunityCard 
              key={community.id} 
              community={community} 
              isMember={isMember(community.id)}
            />
          ))}
        </div>
      )}
      
      <Link href="/communities" className="text-secondary hover:underline text-sm block mt-3">See More Communities</Link>
    </div>
  );
}
