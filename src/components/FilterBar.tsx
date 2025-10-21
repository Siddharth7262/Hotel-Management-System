import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, X, Calendar as CalendarIcon, Filter, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  filters?: {
    name: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
  dateRange?: DateRange | undefined;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  showDateFilter?: boolean;
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
  showPriceFilter?: boolean;
  minPrice?: number;
  maxPrice?: number;
  onReset: () => void;
  onApply: () => void;
}

export function FilterBar({
  searchPlaceholder = "Search...",
  onSearchChange,
  filters = [],
  dateRange,
  onDateRangeChange,
  showDateFilter = false,
  priceRange = [0, 1000],
  onPriceRangeChange,
  showPriceFilter = false,
  minPrice = 0,
  maxPrice = 1000,
  onReset,
  onApply,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  const [isApplying, setIsApplying] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleReset = () => {
    setSearchValue("");
    onSearchChange("");
    setLocalPriceRange([minPrice, maxPrice]);
    if (onPriceRangeChange) {
      onPriceRangeChange([minPrice, maxPrice]);
    }
    onReset();
  };

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Smooth animation
    onApply();
    setIsApplying(false);
  };

  const handlePriceSliderChange = (values: number[]) => {
    setLocalPriceRange([values[0], values[1]]);
    if (onPriceRangeChange) {
      onPriceRangeChange([values[0], values[1]]);
    }
  };

  const handleMinPriceInput = (value: string) => {
    const numValue = parseInt(value) || minPrice;
    const newMin = Math.max(minPrice, Math.min(numValue, localPriceRange[1] - 1));
    setLocalPriceRange([newMin, localPriceRange[1]]);
    if (onPriceRangeChange) {
      onPriceRangeChange([newMin, localPriceRange[1]]);
    }
  };

  const handleMaxPriceInput = (value: string) => {
    const numValue = parseInt(value) || maxPrice;
    const newMax = Math.min(maxPrice, Math.max(numValue, localPriceRange[0] + 1));
    setLocalPriceRange([localPriceRange[0], newMax]);
    if (onPriceRangeChange) {
      onPriceRangeChange([localPriceRange[0], newMax]);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search Bar - Always Visible */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10 h-12 bg-background/60 backdrop-blur-sm border-2 hover:border-primary/50 focus:border-primary transition-all duration-300"
          />
          {searchValue && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-12 px-6 gap-2 border-2 hover:bg-primary/10 hover:border-primary transition-all duration-300"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Expanded Filter Section */}
      {isExpanded && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-background via-background/95 to-primary/5 border-2 border-primary/20 backdrop-blur-sm space-y-6 animate-scale-in shadow-lg">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Dynamic Filters */}
            {filters.map((filter) => (
              <div key={filter.name} className="space-y-2">
                <Label className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
                  {filter.label}
                </Label>
                <Select value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger className="h-11 border-2 bg-background/60 hover:border-primary/50 transition-all duration-300">
                    <SelectValue placeholder={`Select ${filter.label}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-2 border-border">
                    <SelectItem value="all">All {filter.label}s</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {/* Date Range Picker */}
            {showDateFilter && onDateRangeChange && (
              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <Label className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
                  Date Range
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-start text-left font-normal border-2 bg-background/60 hover:border-primary/50 transition-all duration-300",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-2 border-border" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={onDateRangeChange}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          {showPriceFilter && onPriceRangeChange && (
            <div className="space-y-6 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <Label className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
                  Price Range
                </Label>
              </div>
              
              <div className="space-y-6">
                {/* Slider */}
                <div className="px-2">
                  <Slider
                    value={[localPriceRange[0], localPriceRange[1]]}
                    onValueChange={handlePriceSliderChange}
                    min={minPrice}
                    max={maxPrice}
                    step={10}
                    className="w-full"
                  />
                </div>

                {/* Price Display and Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Min Price
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={localPriceRange[0]}
                        onChange={(e) => handleMinPriceInput(e.target.value)}
                        min={minPrice}
                        max={localPriceRange[1] - 1}
                        className="pl-9 h-11 border-2 bg-background/60 hover:border-primary/50 focus:border-primary transition-all duration-300 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Max Price
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={localPriceRange[1]}
                        onChange={(e) => handleMaxPriceInput(e.target.value)}
                        min={localPriceRange[0] + 1}
                        max={maxPrice}
                        className="pl-9 h-11 border-2 bg-background/60 hover:border-primary/50 focus:border-primary transition-all duration-300 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Range Display */}
                <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
                  <span className="text-sm font-semibold text-muted-foreground">Range:</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${localPriceRange[0]} - ${localPriceRange[1]}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-6 border-t border-border/50">
            <Button
              onClick={handleApply}
              size="lg"
              disabled={isApplying}
              className={cn(
                "flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden",
                isApplying && "opacity-80 cursor-wait"
              )}
            >
              {isApplying && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                      style={{ 
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1s linear infinite'
                      }} 
                />
              )}
              <span className="relative z-10">
                {isApplying ? "Applying..." : "Apply Filters"}
              </span>
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              disabled={isApplying}
              className="flex-1 h-12 border-2 hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all duration-300"
            >
              Reset All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
