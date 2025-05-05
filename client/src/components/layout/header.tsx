import { Link } from "wouter";
import { Search, Bell, MessageSquare, Plus, Menu } from "lucide-react";
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
import { useState } from "react";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
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
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search communities, posts, or people"
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
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>My Communities</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logoutMutation.mutate()}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
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
              <Button variant="ghost" size="icon" className="md:hidden text-neutral hover:text-dark">
                <Menu size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
