import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Building, 
  Phone, 
  Clock, 
  DollarSign,
  ShoppingCart,
  Star,
  Calendar as CalendarIcon,
  Filter
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
  lastOrder: string;
  priority: 'high' | 'medium' | 'low';
  repId: string;
  notInPJP: boolean;
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
  onSelectionChange
}: OutletsTableProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Auto-select all outlets when they appear
  React.useEffect(() => {
    if (outlets.length > 0) {
      const allOutletIds = outlets.map(outlet => outlet.id);
      onSelectionChange(allOutletIds);
    }
  }, [outlets.length, onSelectionChange]);

  // Only show outlets that are in PJP
  const filteredOutlets = outlets.filter(outlet => !outlet.notInPJP);

  const handleSelectAll = () => {
    if (selectedOutlets.length === filteredOutlets.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredOutlets.map(outlet => outlet.id));
    }
  };

  const handleSelectOutlet = (outletId: string) => {
    if (selectedOutlets.includes(outletId)) {
      onSelectionChange(selectedOutlets.filter(id => id !== outletId));
    } else {
      onSelectionChange([...selectedOutlets, outletId]);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-muted-foreground bg-muted/30';
      default: return 'text-muted-foreground bg-muted/30';
    }
  };

  return (
    <Card className="bg-card border-border/50 shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Outlets in todays PJP</h3>
          
          <div className="flex items-center gap-4">
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
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="flex items-center gap-2"
          >
            <Checkbox
              checked={selectedOutlets.length === filteredOutlets.length && filteredOutlets.length > 0}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            Select All ({filteredOutlets.length})
          </Button>

          <div className="text-sm text-muted-foreground">
            {selectedOutlets.length} of {filteredOutlets.length} selected
          </div>
        </div>

        <div className="border border-border/50 rounded-lg overflow-hidden">
          <div className="bg-muted/30 px-4 py-3 grid grid-cols-8 gap-4 text-sm font-medium">
            <div className="col-span-1"></div>
            <div className="col-span-2">Outlet</div>
            <div className="col-span-1">Phone</div>
            <div className="col-span-1">Shop Open Hours</div>
            <div className="col-span-1">Expected Value</div>
            <div className="col-span-1">Last Order</div>
            <div className="col-span-1">Priority</div>
          </div>

          <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
            {filteredOutlets.map((outlet) => (
              <div
                key={outlet.id}
                className={`px-4 py-3 grid grid-cols-8 gap-4 items-center hover:bg-muted/20 transition-colors cursor-pointer ${
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
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {outlet.phones[0]}
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
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ShoppingCart className="h-3 w-3" />
                    {outlet.lastOrder}
                  </div>
                </div>
                <div className="col-span-1">
                  <Badge variant="secondary" className={`text-xs ${getPriorityColor(outlet.priority)}`}>
                    <Star className="h-3 w-3 mr-1" />
                    {outlet.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredOutlets.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              No outlets in PJP
            </p>
            <p className="text-sm text-muted-foreground">
              Select sales reps to see outlets in their PJP
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};