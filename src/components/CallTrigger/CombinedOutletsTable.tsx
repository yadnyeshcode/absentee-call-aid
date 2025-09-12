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
  CheckCircle2,
  AlertCircle,
  Search
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

interface CombinedOutletsTableProps {
  outlets: Outlet[];
  selectedInPJPOutlets: string[];
  selectedNotInPJPOutlets: string[];
  onInPJPSelectionChange: (selectedOutlets: string[]) => void;
  onNotInPJPSelectionChange: (selectedOutlets: string[]) => void;
}

export const CombinedOutletsTable = ({
  outlets,
  selectedInPJPOutlets,
  selectedNotInPJPOutlets,
  onInPJPSelectionChange,
  onNotInPJPSelectionChange
}: CombinedOutletsTableProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  // Filter outlets based on search term
  const filteredOutlets = outlets.filter(outlet =>
    outlet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort outlets: PJP outlets first, then non-PJP
  const sortedOutlets = filteredOutlets.sort((a, b) => {
    if (!a.notInPJP && b.notInPJP) return -1;
    if (a.notInPJP && !b.notInPJP) return 1;
    return 0;
  });

  const inPJPOutlets = filteredOutlets.filter(outlet => !outlet.notInPJP);
  const notInPJPOutlets = filteredOutlets.filter(outlet => outlet.notInPJP);

  const handleSelectAll = () => {
    const allPJPSelected = selectedInPJPOutlets.length === inPJPOutlets.length;
    const allNotPJPSelected = selectedNotInPJPOutlets.length === notInPJPOutlets.length;

    const shouldDeselectAll = allPJPSelected && allNotPJPSelected;
    console.log('[Outlets SelectAll]', { allPJPSelected, allNotPJPSelected, shouldDeselectAll });
    
    if (shouldDeselectAll) {
      onInPJPSelectionChange([]);
      onNotInPJPSelectionChange([]);
    } else {
      onInPJPSelectionChange(inPJPOutlets.map(outlet => outlet.id));
      onNotInPJPSelectionChange(notInPJPOutlets.map(outlet => outlet.id));
    }
  };

  const handleSelectOutlet = (outletId: string, isPJP: boolean) => {
    console.log('[Outlet Toggle]', { outletId, isPJP });
    if (isPJP) {
      if (selectedInPJPOutlets.includes(outletId)) {
        onInPJPSelectionChange(selectedInPJPOutlets.filter(id => id !== outletId));
      } else {
        onInPJPSelectionChange([...selectedInPJPOutlets, outletId]);
      }
    } else {
      if (selectedNotInPJPOutlets.includes(outletId)) {
        onNotInPJPSelectionChange(selectedNotInPJPOutlets.filter(id => id !== outletId));
      } else {
        onNotInPJPSelectionChange([...selectedNotInPJPOutlets, outletId]);
      }
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

  const renderOutletRow = (outlet: Outlet) => {
    const isPJP = !outlet.notInPJP;
    const isSelected = isPJP 
      ? selectedInPJPOutlets.includes(outlet.id)
      : selectedNotInPJPOutlets.includes(outlet.id);
    
    return (
      <div
        key={outlet.id}
        className={`px-4 py-3 grid grid-cols-9 gap-4 items-center hover:${isPJP ? 'bg-emerald-50/50' : 'bg-amber-50/50'} transition-colors cursor-pointer ${
          isSelected ? `${isPJP ? 'bg-emerald-50 border-l-2 border-l-emerald-500' : 'bg-amber-50 border-l-2 border-l-amber-500'}` : ''
        }`}
        onClick={() => handleSelectOutlet(outlet.id, isPJP)}
      >
        <div className="col-span-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => handleSelectOutlet(outlet.id, isPJP)}
            onClick={(e) => e.stopPropagation()}
            className={`data-[state=checked]:${isPJP ? 'bg-emerald-600 border-emerald-600' : 'bg-amber-600 border-amber-600'}`}
          />
        </div>
        <div className="col-span-1">
          <Badge variant="secondary" className={isPJP ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-amber-100 text-amber-700 border-amber-300"}>
            {isPJP ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                PJP
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Not PJP
              </>
            )}
          </Badge>
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
    );
  };

  const totalSelected = selectedInPJPOutlets.length + selectedNotInPJPOutlets.length;
  const totalOutlets = sortedOutlets.length;

  return (
    <Card className="bg-card border-border/50 shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">Outlets under Sales Rep</h3>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Building className="h-3 w-3 mr-1" />
              {totalOutlets} outlets
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search outlets..."
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
              checked={totalSelected === totalOutlets && totalOutlets > 0}
              onClick={(e) => { e.stopPropagation(); handleSelectAll(); }}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            Select All ({totalOutlets})
          </Button>

          <div className="text-sm text-muted-foreground flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              PJP: {selectedInPJPOutlets.length}/{inPJPOutlets.length}
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Not PJP: {selectedNotInPJPOutlets.length}/{notInPJPOutlets.length}
            </span>
          </div>
        </div>

        <div className="border border-border/50 rounded-lg overflow-hidden">
          <div className="bg-muted/30 px-4 py-3 grid grid-cols-9 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-1"></div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Outlet</div>
            <div className="col-span-1">Phone</div>
            <div className="col-span-1">Shop Open Hours</div>
            <div className="col-span-1">Expected Value</div>
            <div className="col-span-1">Last Order</div>
            <div className="col-span-1">Priority</div>
          </div>

          <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
            {sortedOutlets.map((outlet) => renderOutletRow(outlet))}
          </div>
        </div>

        {sortedOutlets.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              No outlets found
            </p>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? "Try adjusting your search criteria" : "Select sales reps to see their outlets"}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};