import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, MapPin, Building, Search, ChevronUp, ChevronDown, Calendar as CalendarIcon } from "lucide-react";

interface SalesRep {
  id: string;
  name: string;
  territory: string;
  todayOutlets: number;
  estimatedValue: number;
  pjpToday: Array<{
    outlet: string;
    phone: string;
    time: string;
    location: string;
    expectedValue: number;
    status: 'pending' | 'visited' | 'missed';
  }>;
}

interface AbsentRepsTableProps {
  salesReps: SalesRep[];
  selectedReps: string[];
  onSelectionChange: (selectedReps: string[]) => void;
}

export const AbsentRepsTable = ({
  salesReps,
  selectedReps,
  onSelectionChange
}: AbsentRepsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const filteredReps = salesReps.filter(rep =>
    rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedReps = [...filteredReps].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField as keyof SalesRep];
    let bValue = b[sortField as keyof SalesRep];
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedReps.length === sortedReps.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(sortedReps.map(rep => rep.id));
    }
  };

  const handleSelectRep = (repId: string) => {
    if (selectedReps.includes(repId)) {
      onSelectionChange(selectedReps.filter(id => id !== repId));
    } else {
      onSelectionChange([...selectedReps, repId]);
    }
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-1 font-medium text-muted-foreground hover:text-foreground"
    >
      {children}
      {sortField === field && (
        sortDirection === "asc" ? 
        <ChevronUp className="ml-1 h-3 w-3" /> : 
        <ChevronDown className="ml-1 h-3 w-3" />
      )}
    </Button>
  );

  return (
    <Card className="bg-card border-border/50 shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Sales Representatives</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Today
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="flex items-center gap-2"
            >
              <Checkbox
                checked={selectedReps.length === sortedReps.length && sortedReps.length > 0}
                onClick={(e) => { e.stopPropagation(); handleSelectAll(); }}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              Select All
            </Button>
          </div>
        </div>

        <div className="border border-border/50 rounded-lg overflow-hidden">
          <div className="bg-muted/30 px-4 py-3 grid grid-cols-8 gap-4 text-sm font-medium">
            <div className="col-span-1 flex items-center">
              <Checkbox
                checked={selectedReps.length === sortedReps.length && sortedReps.length > 0}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </div>
            <div className="col-span-3">
              <SortButton field="name">Rep</SortButton>
            </div>
            <div className="col-span-2">
              <SortButton field="territory">Territory</SortButton>
            </div>
            <div className="col-span-1">
              <SortButton field="todayOutlets">#Today Outlets</SortButton>
            </div>
            <div className="col-span-1">
              <SortButton field="estimatedValue">Est. Value</SortButton>
            </div>
          </div>

          <div className="divide-y divide-border/50">
            {sortedReps.map((rep) => (
              <div
                key={rep.id}
                className={`px-4 py-4 grid grid-cols-8 gap-4 items-center hover:bg-muted/20 transition-colors cursor-pointer ${
                  selectedReps.includes(rep.id) ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
                onClick={() => handleSelectRep(rep.id)}
              >
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedReps.includes(rep.id)}
                    onCheckedChange={() => handleSelectRep(rep.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{rep.name}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">{rep.territory}</div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{rep.todayOutlets}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="font-medium text-foreground">
                    ₹{rep.estimatedValue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {sortedReps.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              No sales reps found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};