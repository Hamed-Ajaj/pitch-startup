"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDownIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MessageCircleIcon,
  ClockIcon,
  CheckIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const FILTER_OPTIONS = [
  {
    value: "newest",
    label: "Most Recent",
    icon: ClockIcon,
    description: "Latest startups first",
  },
  {
    value: "upvotes",
    label: "Most Upvotes",
    icon: TrendingUpIcon,
    description: "Highest rated startups",
  },
  {
    value: "downvotes",
    label: "Most Downvotes",
    icon: TrendingDownIcon,
    description: "Controversial startups",
  },
  {
    value: "comments",
    label: "Most Comments",
    icon: MessageCircleIcon,
    description: "Most discussed startups",
  },
];

const StartupFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get("sort") || "newest";

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;

    router.push(newUrl, { scroll: false });
  };

  const getCurrentFilterLabel = () => {
    const filter = FILTER_OPTIONS.find(
      (option) => option.value === currentFilter,
    );
    return filter?.label || "Most Recent";
  };

  const getCurrentFilterIcon = () => {
    const filter = FILTER_OPTIONS.find(
      (option) => option.value === currentFilter,
    );
    const IconComponent = filter?.icon || ClockIcon;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-14-medium text-gray-600 hidden sm:block">
        Sort by:
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 min-w-[140px] justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {getCurrentFilterIcon()}
              <span className="text-14-medium">{getCurrentFilterLabel()}</span>
            </div>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[220px]">
          <DropdownMenuLabel className="text-12-medium text-gray-500 uppercase tracking-wide">
            Filter Options
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuRadioGroup
            value={currentFilter}
            onValueChange={handleFilterChange}
          >
            {FILTER_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              return (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  className="flex items-center gap-3 py-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <IconComponent className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    <div className="flex flex-col">
                      <span className="text-14-medium text-gray-900">
                        {option.label}
                      </span>
                      <span className="text-12 text-gray-500">
                        {option.description}
                      </span>
                    </div>
                  </div>
                  {currentFilter === option.value && (
                    <CheckIcon className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <div className="px-2 py-1">
            <p className="text-12 text-gray-400 text-center">
              {FILTER_OPTIONS.length} filter options available
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StartupFilters;
