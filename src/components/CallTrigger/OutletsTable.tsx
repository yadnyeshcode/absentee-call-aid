import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Building, 
  Phone, 
  Clock, 
  DollarSign, 
  Languages, 
  MessageSquare, 
  ShieldOff,
  ShoppingCart,
  Star,
  Calendar as CalendarIcon,
  Search,
  Filter,
  AlertTriangle,
  Info
} from "lucide-react";
import { format } from "date-fns";

interface Outlet {
  id: string;
  name: string;
  phones: string[];
  timeWindow: string;
  expectedValue: number;
  language: string;
  whatsappOptIn: boolean;
  dndStatus: boolean;
  lastOrder: string;
  priority: 'high' | 'medium' | 'low';
  repId: string;
  excluded?: boolean;
  excludeReason?: string;
}

interface OutletsTableProps {
  outlets: Outlet[];
  selectedOutlets: string[];
  onSelectionChange: (selectedOutlets: string[]) => void;
  onOutletUpdate?: (outletId: string, updates: Partial<Outlet>) => void;
}

export const OutletsTable = ({
  outlets,
  selectedOutlets,
  onSelectionChange,
  onOutletUpdate
}: OutletsTableProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState({ start: "09:00", end: "18:00" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredOutlets = outlets.filter(outlet => {
    const matchesSearch = outlet.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Add time window filtering logic here
    return matchesSearch;
  });

  const validOutlets = filteredOutlets.filter(outlet => !outlet.excluded);
  const excludedOutlets = filteredOutlets.filter(outlet => outlet.excluded);

  const handleSelectAll = (includeExcluded = false) => {
    const outletsToSelect = includeExcluded ? filteredOutlets : validOutlets;
    if (selectedOutlets.length === outletsToSelect.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(outletsToSelect.map(outlet => outlet.id));
    }
  };

  const handleSelectOutlet = (outletId: string) => {
    if (selectedOutlets.includes(outletId)) {
      onSelectionChange(selectedOutlets.filter(id => id !== outletId));
    } else {
      onSelectionChange([...selectedOutlets, outletId]);
    }
  };

  const handleLanguageChange = (outletId: string, language: string) => {
    onOutletUpdate?.(outletId, { language });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-muted-foreground bg-muted/30';
      default: return 'text-muted-foreground bg-muted/30';
    }
  };

  const getExcludeReason = (outlet: Outlet) => {
    if (outlet.dndStatus) return { reason: 'DND', color: 'destructive' };
    if (!outlet.phones.length || outlet.phones.every(p => !p)) return { reason: 'Invalid Phone', color: 'destructive' };
    // Add more exclusion logic
    return { reason: 'Outside Window', color: 'warning' };
  };

  return (
    <Card className="bg-card border-border/50 shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Outlets for Selected Reps</h3>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(selectedDate, "MMM dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={timeRange.start}
                  onChange={(e) => setTimeRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-24"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={timeRange.end}
                  onChange={(e) => setTimeRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-24"
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="bg-muted/30 border-border/30 mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search outlets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="valid">Valid only</SelectItem>
                    <SelectItem value="excluded">Excluded only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll(false)}
              className="flex items-center gap-2"
            >
              <Checkbox
                checked={selectedOutlets.length === validOutlets.length && validOutlets.length > 0}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              Select Valid ({validOutlets.length})
            </Button>

            {excludedOutlets.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <AlertTriangle className="h-4 w-4" />
                       Not in PJP: {excludedOutlets.length}
                     </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Outlets not in PJP due to DND, invalid data, or being outside time window</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {selectedOutlets.length} of {validOutlets.length} selected
          </div>
        </div>

        <div className="border border-border/50 rounded-lg overflow-hidden">
          <div className="bg-muted/30 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium">
            <div className="col-span-1">
              <Checkbox
                checked={selectedOutlets.length === validOutlets.length && validOutlets.length > 0}
                onCheckedChange={() => handleSelectAll(false)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </div>
            <div className="col-span-2">Outlet</div>
            <div className="col-span-1">Phone(s)</div>
            <div className="col-span-1">Window</div>
            <div className="col-span-1">Expected Value</div>
            <div className="col-span-1">Language</div>
            <div className="col-span-1">WA Opt-in</div>
            <div className="col-span-1">DND</div>
            <div className="col-span-1">Last Order</div>
            <div className="col-span-2">Priority</div>
          </div>

          <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
            {validOutlets.map((outlet) => (
              <div
                key={outlet.id}
                className={`px-4 py-3 grid grid-cols-12 gap-4 items-center hover:bg-muted/20 transition-colors cursor-pointer ${
                  selectedOutlets.includes(outlet.id) ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
                onClick={() => handleSelectOutlet(outlet.id)}
              >
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedOutlets.includes(outlet.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{outlet.name}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{outlet.phones.length}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {outlet.timeWindow}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    ₹{outlet.expectedValue.toLocaleString()}
                  </div>
                </div>
                <div className="col-span-1">
                  <Select
                    value={outlet.language}
                    onValueChange={(value) => handleLanguageChange(outlet.id, value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  {outlet.whatsappOptIn ? (
                    <MessageSquare className="h-4 w-4 text-success" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="col-span-1">
                  {outlet.dndStatus ? (
                    <ShieldOff className="h-4 w-4 text-destructive" />
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ShoppingCart className="h-3 w-3" />
                    {outlet.lastOrder}
                  </div>
                </div>
                <div className="col-span-2">
                  <Badge variant="secondary" className={`text-xs ${getPriorityColor(outlet.priority)}`}>
                    <Star className="h-3 w-3 mr-1" />
                    {outlet.priority}
                  </Badge>
                </div>
              </div>
            ))}

            {excludedOutlets.length > 0 && (
              <>
                <div className="px-4 py-2 bg-muted/50 text-sm font-medium text-muted-foreground border-t-2 border-border">
                  Outlets Not in PJP ({excludedOutlets.length})
                </div>
                {excludedOutlets.map((outlet) => {
                  const excludeInfo = getExcludeReason(outlet);
                  return (
                    <div
                      key={outlet.id}
                      className="px-4 py-3 grid grid-cols-12 gap-4 items-center bg-muted/20 opacity-60"
                    >
                      <div className="col-span-1">
                        <Checkbox disabled className="opacity-50" />
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{outlet.name}</span>
                        </div>
                      </div>
                      <div className="col-span-9 flex items-center justify-end">
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {excludeInfo.reason}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {filteredOutlets.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              No outlets found
            </p>
            <p className="text-sm text-muted-foreground">
              Select some sales reps to see their outlets
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};