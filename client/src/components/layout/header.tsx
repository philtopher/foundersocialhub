import { Link } from "wouter";
import { Search, Bell, MessageSquare, Plus, Menu, Home, Compass, Bookmark, Users, Settings, LogOut, HelpCircle, ExternalLink, Star, Crown } from "lucide-react";
import { TaskFlowNavItem } from "@/components/navigation/taskflow-nav-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-light-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-2-8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
              <span className="ml-2 text-xl font-bold">FounderSocials</span>
            </Link>
          </div>
          
          {/* Search bar */}
          <div className="hidden md:flex flex-1 mx-4 max-w-xl">
            <form onSubmit={handleSearch} className="w-full flex">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search posts, communities, users..."
                  className="w-full pl-10 pr-4 py-2 rounded-l-full border border-light-border bg-light rounded-r-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-neutral">
                  <Search size={16} />
                </div>
              </div>
              <Button 
                type="submit" 
                variant="outline" 
                className="rounded-l-none border-l-0 px-3 py-2"
                disabled={!searchQuery.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          
          {/* Navigation Menu */}
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-neutral hover:text-dark"
                onClick={() => {
                  const searchInput = document.querySelector('input[type="text"]');
                  if (searchInput) {
                    searchInput.scrollIntoView();
                    (searchInput as HTMLInputElement).focus();
                  }
                }}
              >
                <Search size={20} />
              </Button>
            )}
            
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="px-3 py-1.5 rounded-full hover:bg-light-darker">
                    <Bell size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="px-3 py-1.5 rounded-full hover:bg-light-darker">
                    <MessageSquare size={20} />
                  </Button>
                  <Link href="/submit">
                    <Button variant="ghost" size="icon" className="px-3 py-1.5 rounded-full hover:bg-light-darker">
                      <Plus size={20} />
                    </Button>
                  </Link>
                  <TaskFlowNavItem />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || ""} alt={user.username} />
                        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={`/u/${user.username}`}>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                    </Link>
                    <Link href="/my-communities">
                      <DropdownMenuItem>My Communities</DropdownMenuItem>
                    </Link>
                    {(user.subscriptionPlan === "standard" || user.subscriptionPlan === "founder") && (
                      <Link href="/settings#taskflow">
                        <DropdownMenuItem>
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            <span>TaskFlowPro</span>
                          </div>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logoutMutation.mutate()}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/how-it-works" className="hidden md:flex items-center space-x-1 text-neutral hover:text-dark mr-2">
                  <HelpCircle size={16} />
                  <span>How It Works</span>
                </Link>
                <Link href="/auth">
                  <Button variant="default" className="px-4 py-1.5 rounded-full bg-primary text-white hover:bg-primary-hover hidden md:block">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" className="px-4 py-1.5 rounded-full border border-primary text-primary hover:bg-light-darker">
                    Log In
                  </Button>
                </Link>
              </div>
            )}
            
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-neutral hover:text-dark"
                onClick={toggleMobileMenu}
              >
                <Menu size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden fixed top-14 right-0 w-64 bg-white border-l border-light-border shadow-lg h-full z-50 overflow-y-auto"
        >
          <div className="p-4">
            {isMobile && (
              <div className="mb-4">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative w-full">
                    <Input
                      type="text"
                      placeholder="Search"
                      className="w-full pl-10 pr-4 py-2 rounded-full border border-light-border bg-light"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5 text-neutral">
                      <Search size={16} />
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            <div className="space-y-1">
              <Link href="/" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link href="/explore" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light">
                <Compass size={18} />
                <span>Explore</span>
              </Link>
              <Link href="/how-it-works" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light">
                <HelpCircle size={18} />
                <span>How It Works</span>
              </Link>
              {user && (
                <>
                  <Link href="/notifications" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light">
                    <Bell size={18} />
                    <span>Notifications</span>
                  </Link>
                  <Link href="/submit" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light">
                    <Plus size={18} />
                    <span>Create Post</span>
                  </Link>
                  <Link href="/saved" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light">
                    <Bookmark size={18} />
                    <span>Saved</span>
                  </Link>
                  <Link href="/my-communities" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light">
                    <Users size={18} />
                    <span>My Communities</span>
                  </Link>
                  <Link href="/settings" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light">
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  {(user.subscriptionPlan === "standard" || user.subscriptionPlan === "founder") && (
                    <Link href="/settings#taskflow" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light">
                      <ExternalLink size={18} />
                      <span>TaskFlowPro</span>
                    </Link>
                  )}
                  {/* Smart upgrade link based on current plan */}
                  {(!user.subscriptionPlan || user.subscriptionPlan === "free") && (
                    <Link href="/payment" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light text-primary">
                      <Star size={18} />
                      <span>Upgrade to Premium</span>
                    </Link>
                  )}
                  {user.subscriptionPlan === "standard" && (
                    <Link href="/payment" className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light text-primary">
                      <Crown size={18} />
                      <span>Upgrade to Founder Plan</span>
                    </Link>
                  )}
                  
                  <hr className="my-2 border-light-border" />
                  
                  {/* Logout button - always visible for authenticated users */}
                  <button 
                    onClick={() => {
                      logoutMutation.mutate();
                      setMobileMenuOpen(false);
                    }} 
                    className="w-full flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-light text-destructive"
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut size={18} />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Log Out"}</span>
                  </button>
                </>
              )}
              {!user && (
                <div className="mt-4 flex flex-col space-y-2">
                  <Link href="/auth" className="w-full">
                    <Button variant="default" className="w-full rounded-full bg-primary text-white hover:bg-primary-hover">
                      Sign Up
                    </Button>
                  </Link>
                  <Link href="/auth" className="w-full">
                    <Button variant="outline" className="w-full rounded-full border border-primary text-primary hover:bg-light-darker">
                      Log In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
