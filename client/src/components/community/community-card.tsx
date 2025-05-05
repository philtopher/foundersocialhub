import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Community } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface CommunityCardProps {
  community: Community;
  isMember?: boolean;
}

export function CommunityCard({ community, isMember = false }: CommunityCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const joinMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/communities/${community.id}/join`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/communities"] });
      toast({
        title: "Joined community",
        description: `You are now a member of r/${community.name}`,
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
      return await apiRequest("POST", `/api/communities/${community.id}/leave`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/communities"] });
      toast({
        title: "Left community",
        description: `You have left r/${community.name}`,
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
      return;
    }

    if (isMember) {
      leaveMutation.mutate();
    } else {
      joinMutation.mutate();
    }
  };

  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="flex items-start">
      <Link href={`/r/${community.name}`}>
        <a className="block">
          <div 
            className="community-icon mt-1" 
            style={{ backgroundImage: `url('${community.iconUrl}')` }}
          ></div>
        </a>
      </Link>
      <div className="ml-2">
        <Link href={`/r/${community.name}`}>
          <a className="font-medium hover:underline">r/{community.name}</a>
        </Link>
        <p className="text-xs text-neutral">{formatMemberCount(community.memberCount)} members</p>
      </div>
      <Button
        variant={isMember ? "outline" : "outline"}
        size="sm"
        className={`ml-auto text-xs px-4 py-1 rounded-full 
          ${isMember 
            ? "border-neutral-light text-neutral hover:bg-light-darker" 
            : "border-primary text-primary hover:bg-light-darker"
          }`}
        onClick={handleJoinToggle}
        disabled={joinMutation.isPending || leaveMutation.isPending}
      >
        {joinMutation.isPending || leaveMutation.isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isMember ? (
          "Joined"
        ) : (
          "Join"
        )}
      </Button>
    </div>
  );
}
