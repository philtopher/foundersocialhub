import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Image, Link2, BarChart2 } from "lucide-react";

export function CreatePostBox({ communityId }: { communityId?: number }) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  const handleFocus = () => {
    if (communityId) {
      navigate(`/r/${communityId}/submit`);
    } else {
      navigate("/create-post");
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-light-border p-3 mb-4">
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-2">
          <AvatarImage src={user?.avatarUrl || ""} alt={user?.username || "User avatar"} />
          <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <Input
          type="text"
          placeholder="Create post"
          className="flex-1 bg-light rounded-md border border-light-border p-2 hover:border-neutral focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          onFocus={handleFocus}
          readOnly
        />
      </div>
      
      <div className="flex mt-3 border-t border-light-border pt-3">
        <Button variant="ghost" className="flex items-center text-neutral hover:bg-light-darker rounded-full px-3 py-1 mr-2" onClick={handleFocus}>
          <Image className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Image</span>
        </Button>
        <Button variant="ghost" className="flex items-center text-neutral hover:bg-light-darker rounded-full px-3 py-1 mr-2" onClick={handleFocus}>
          <Link2 className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Link</span>
        </Button>
        <Button variant="ghost" className="flex items-center text-neutral hover:bg-light-darker rounded-full px-3 py-1" onClick={handleFocus}>
          <BarChart2 className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Poll</span>
        </Button>
      </div>
    </div>
  );
}
