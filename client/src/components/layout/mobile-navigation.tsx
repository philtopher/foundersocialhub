import { Link, useLocation } from "wouter";
import { Home, Compass, PlusCircle, Bell, User } from "lucide-react";

export function MobileNavigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path ? "text-primary" : "text-neutral";
  };
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-light-border flex items-center justify-around py-2 z-40">
      <Link href="/" className={`flex flex-col items-center px-3 py-1 ${isActive("/")}`}>
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link href="/explore" className={`flex flex-col items-center px-3 py-1 ${isActive("/explore")} hover:text-primary`}>
        <Compass className="h-5 w-5" />
        <span className="text-xs mt-1">Explore</span>
      </Link>
      <Link href="/create-post" className={`flex flex-col items-center px-3 py-1 ${isActive("/create-post")} hover:text-primary`}>
        <PlusCircle className="h-5 w-5" />
        <span className="text-xs mt-1">Create</span>
      </Link>
      <Link href="/notifications" className={`flex flex-col items-center px-3 py-1 ${isActive("/notifications")} hover:text-primary`}>
        <Bell className="h-5 w-5" />
        <span className="text-xs mt-1">Alerts</span>
      </Link>
      <Link href="/profile" className={`flex flex-col items-center px-3 py-1 ${isActive("/profile")} hover:text-primary`}>
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
}
