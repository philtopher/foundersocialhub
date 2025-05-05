import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Community } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { CreateCommunityModal } from "@/components/community/create-community-modal";
import { TrendingCommunities } from "@/components/community/trending-communities";
import { useState } from "react";
import { Crown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function RightSidebar() {
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const { user } = useAuth();
  
  return (
    <aside className="hidden md:block w-72 flex-shrink-0">
      {/* Community Creation Card */}
      <div className="bg-white rounded-lg border border-light-border p-4 mb-4">
        <h3 className="font-bold text-lg mb-2">Create a Community</h3>
        <p className="text-sm text-neutral-dark mb-3">Start your own community for founders with similar interests.</p>
        <Button 
          className="w-full bg-primary hover:bg-primary-hover text-white font-medium rounded-full py-2"
          onClick={() => {
            if (user) {
              setIsCreateCommunityOpen(true);
            } else {
              window.location.href = "/auth?redirect=/create-community";
            }
          }}
        >
          Create Community
        </Button>
      </div>
      
      {/* Trending Communities */}
      <TrendingCommunities />
      
      {/* Premium Features Card */}
      <div className="bg-gradient-to-r from-accent to-accent-light text-white rounded-lg p-4 mb-4">
        <div className="flex items-center mb-2">
          <Crown className="h-5 w-5 text-yellow-300 mr-2" />
          <h3 className="font-bold text-lg">FounderSocials Premium</h3>
        </div>
        <p className="text-sm mb-3">Get exclusive features to enhance your founder journey:</p>
        <ul className="text-sm mb-3 space-y-1">
          <li className="flex items-start">
            <span className="text-yellow-300 mt-1 mr-2">✓</span>
            <span>AI-powered content improvement</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-300 mt-1 mr-2">✓</span>
            <span>Premium community access</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-300 mt-1 mr-2">✓</span>
            <span>Jira/Trello integration</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-300 mt-1 mr-2">✓</span>
            <span>Ad-free browsing experience</span>
          </li>
        </ul>
        <Button className="w-full bg-white text-accent hover:bg-light font-medium rounded-full py-2">
          Try Premium
        </Button>
      </div>
      
      {/* Footer Links */}
      <div className="text-xs text-neutral">
        <div className="flex flex-wrap gap-2 mb-3">
          <Link href="/about">
            <a className="hover:underline">About</a>
          </Link>
          <Link href="/terms">
            <a className="hover:underline">Terms</a>
          </Link>
          <Link href="/privacy">
            <a className="hover:underline">Privacy Policy</a>
          </Link>
          <Link href="/content-policy">
            <a className="hover:underline">Content Policy</a>
          </Link>
          <Link href="/moderator-code">
            <a className="hover:underline">Moderator Code</a>
          </Link>
        </div>
        <p>© {new Date().getFullYear()} FounderSocials. All rights reserved.</p>
      </div>
      
      {/* Create Community Modal */}
      <CreateCommunityModal 
        isOpen={isCreateCommunityOpen}
        onClose={() => setIsCreateCommunityOpen(false)}
      />
    </aside>
  );
}
