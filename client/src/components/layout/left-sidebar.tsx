import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Community } from "@shared/schema";
import { Home, TrendingUp, Clock, Bookmark, Users, Settings, Flame } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function LeftSidebar() {
  const { user } = useAuth();
  
  const { data: communities } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    enabled: !!user,
  });

  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <div className="bg-white rounded-lg border border-border p-4 mb-4">
        <h3 className="font-bold text-lg mb-3">Communities</h3>
        
        {/* Recommended Communities */}
        <div className="space-y-2">
          {communities?.slice(0, 5).map((community) => (
            <Link key={community.id} href={`/r/${community.name}`} className="flex items-center p-2 rounded-md hover:bg-background">
              <div 
                className="community-icon mr-2" 
                style={{ backgroundImage: `url('${community.iconUrl}')` }}
              ></div>
              <span className="font-medium">r/{community.name}</span>
            </Link>
          ))}
          
          {!communities && (
            <>
              <div className="flex items-center p-2 rounded-md hover:bg-background">
                <div 
                  className="community-icon mr-2" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=48&h=48&q=80')` }}
                ></div>
                <span className="font-medium">r/startups</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-background">
                <div 
                  className="community-icon mr-2" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=48&h=48&q=80')` }}
                ></div>
                <span className="font-medium">r/entrepreneur</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-background">
                <div 
                  className="community-icon mr-2" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=48&h=48&q=80')` }}
                ></div>
                <span className="font-medium">r/producthunt</span>
              </div>
            </>
          )}
        </div>
        
        <Link href="/communities" className="text-secondary hover:underline text-sm block mt-4">View All Communities</Link>
      </div>
      
      <div className="bg-white rounded-lg border border-border p-4">
        <h3 className="font-bold text-lg mb-3">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="text-foreground hover:text-primary flex items-center">
              <Flame className="h-4 w-4 mr-2" /> Popular Posts
            </Link>
          </li>
          <li>
            <Link href="/?sort=new" className="text-foreground hover:text-primary flex items-center">
              <Clock className="h-4 w-4 mr-2" /> Recent
            </Link>
          </li>
          <li>
            <Link href="/saved" className="text-foreground hover:text-primary flex items-center">
              <Bookmark className="h-4 w-4 mr-2" /> Saved
            </Link>
          </li>
          <li>
            <Link href="/my-communities" className="text-foreground hover:text-primary flex items-center">
              <Users className="h-4 w-4 mr-2" /> My Communities
            </Link>
          </li>
          <li>
            <Link href="/settings" className="text-foreground hover:text-primary flex items-center">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
