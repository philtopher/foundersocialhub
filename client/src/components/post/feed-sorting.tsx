import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Award, BarChart2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = "hot" | "new" | "top";

interface FeedSortingProps {
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
}

export function FeedSorting({ onSortChange, currentSort }: FeedSortingProps) {
  return (
    <div className="bg-white rounded-lg border border-light-border p-3 mb-4">
      <div className="flex">
        <Button
          variant="ghost"
          className={`flex items-center font-medium px-3 py-1.5 rounded-full ${
            currentSort === "hot" 
              ? "bg-light text-dark" 
              : "text-neutral hover:bg-light active:bg-light-darker"
          } mr-2`}
          onClick={() => onSortChange("hot")}
        >
          <Flame className="h-4 w-4 mr-2" />
          Hot
        </Button>
        <Button
          variant="ghost"
          className={`flex items-center font-medium px-3 py-1.5 rounded-full ${
            currentSort === "new" 
              ? "bg-light text-dark" 
              : "text-neutral hover:bg-light active:bg-light-darker"
          } mr-2`}
          onClick={() => onSortChange("new")}
        >
          <Award className="h-4 w-4 mr-2" />
          New
        </Button>
        <Button
          variant="ghost"
          className={`flex items-center font-medium px-3 py-1.5 rounded-full ${
            currentSort === "top" 
              ? "bg-light text-dark" 
              : "text-neutral hover:bg-light active:bg-light-darker"
          } mr-2`}
          onClick={() => onSortChange("top")}
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          Top
        </Button>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center font-medium px-3 py-1.5 rounded-full text-neutral hover:bg-light active:bg-light-darker"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Hide Read Posts</DropdownMenuItem>
              <DropdownMenuItem>Mark All as Read</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
