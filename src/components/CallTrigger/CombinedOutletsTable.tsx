import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Building, 
  Phone, 
  Clock, 
  DollarSign,
  ShoppingCart,
  Star,
  Calendar as CalendarIcon,
  CheckCircle2,
  Target,
  AlertCircle,
  Plus,
  Search,
  ChevronDown,
  ChevronRight
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
  const [isNotInPJPOpen, setIsNotInPJPOpen] = useState(false);

  // Split outlets into PJP and non-PJP
  const inPJPOutlets = outlets.filter(outlet => !outlet.notInPJP);
  const notInPJPOutlets = outlets.filter(outlet => 
    outlet.notInPJP && 
    outlet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-select only PJP outlets when they appear
  React.useEffect(() => {
    if (inPJPOutlets.length > 0) {
      const allInPJPIds = inPJPOutlets.map(outlet => outlet.id);
      onInPJPSelectionChange(allInPJPIds);
    }
  }, [inPJPOutlets.length, onInPJPSelectionChange]);

  const handleSelectAllPJP = () => {
    if (selectedInPJPOutlets.length === inPJPOutlets.length) {
      onInPJPSelectionChange([]);
    } else {
      onInPJPSelectionChange(inPJPOutlets.map(outlet => outlet.id));
    }
  };

  const handleSelectAllNotInPJP = () => {
    if (selectedNotInPJPOutlets.length === notInPJPOutlets.length) {
      onNotInPJPSelectionChange([]);
    } else {
      onNotInPJPSelectionChange(notInPJPOutlets.map(outlet => outlet.id));
    }
  };

  const handleSelectPJPOutlet = (outletId: string) => {
    if (selectedInPJPOutlets.includes(outletId)) {
      onInPJPSelectionChange(selectedInPJPOutlets.filter(id => id !== outletId));
    } else {
      onInPJPSelectionChange([...selectedInPJPOutlets, outletId]);
    }
  };

  const handleSelectNotInPJPOutlet = (outletId: string) => {
    if (selectedNotInPJPOutlets.includes(outletId)) {
      onNotInPJPSelectionChange(selectedNotInPJPOutlets.filter(id => id !== outletId));
    } else {
      onNotInPJPSelectionChange([...selectedNotInPJPOutlets, outletId]);
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

  const renderOutletRow = (outlet: Outlet, isSelected: boolean, onSelect: (id: string) => void, isPJP: boolean) => (
    <div
      key={outlet.id}
      className={`px-4 py-3 grid grid-cols-9 gap-4 items-center hover:${isPJP ? 'bg-emerald-50/50' : 'bg-amber-50/50'} transition-colors cursor-pointer ${
        isSelected ? `${isPJP ? 'bg-emerald-50 border-l-2 border-l-emerald-500' : 'bg-amber-50 border-l-2 border-l-amber-500'}` : ''
      }`}
      onClick={() => onSelect(outlet.id)}
    >
      <div className="col-span-1">
        <Checkbox
          checked={isSelected}
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

  return (
    <div className="space-y-6">
      {/* Outlets in PJP */}
      <Card className="bg-card border-l-4 border-l-emerald-500 border-border/50 shadow-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-foreground">Outlets in todays PJP</h3>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <Target className="h-3 w-3 mr-1" />
                Scheduled
              </Badge>
            </div>
            
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
              onClick={handleSelectAllPJP}
              className="flex items-center gap-2"
            >
              <Checkbox
                checked={selectedInPJPOutlets.length === inPJPOutlets.length && inPJPOutlets.length > 0}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              Select All ({inPJPOutlets.length})
            </Button>

            <div className="text-sm text-muted-foreground">
              {selectedInPJPOutlets.length} of {inPJPOutlets.length} selected
            </div>
          </div>

          <div className="border border-emerald-200 rounded-lg overflow-hidden bg-emerald-50/30">
            <div className="bg-emerald-50 px-4 py-3 grid grid-cols-9 gap-4 text-sm font-medium text-emerald-800">
              <div className="col-span-1"></div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Outlet</div>
              <div className="col-span-1">Phone</div>
              <div className="col-span-1">Shop Open Hours</div>
              <div className="col-span-1">Expected Value</div>
              <div className="col-span-1">Last Order</div>
              <div className="col-span-1">Priority</div>
            </div>

            <div className="divide-y divide-emerald-200/50 max-h-96 overflow-y-auto">
              {inPJPOutlets.map((outlet) => renderOutletRow(
                outlet, 
                selectedInPJPOutlets.includes(outlet.id), 
                handleSelectPJPOutlet,
                true
              ))}
            </div>
          </div>

          {inPJPOutlets.length === 0 && (
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

      {/* Outlets NOT in PJP - Collapsible */}
      <Card className="bg-card border-l-4 border-l-amber-500 border-border/50 shadow-card">
        <Collapsible open={isNotInPJPOpen} onOpenChange={setIsNotInPJPOpen}>
          <CollapsibleTrigger asChild>
            <div className="p-6 pb-0 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {isNotInPJPOpen ? <ChevronDown className="h-5 w-5 text-amber-600" /> : <ChevronRight className="h-5 w-5 text-amber-600" />}
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <h3 className="text-lg font-semibold text-foreground">Outlets not in today's PJP</h3>
                  </div>
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Plus className="h-3 w-3 mr-1" />
                    Additional ({notInPJPOutlets.length})
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  {isNotInPJPOpen ? "Collapse" : "Expand"}
                </Button>
              </div>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-6 pb-6">
              <div className="mt-4 mb-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search outlets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllNotInPJP}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={selectedNotInPJPOutlets.length === notInPJPOutlets.length && notInPJPOutlets.length > 0}
                    className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                  />
                  Select All ({notInPJPOutlets.length})
                </Button>

                <div className="text-sm text-muted-foreground">
                  {selectedNotInPJPOutlets.length} of {notInPJPOutlets.length} selected
                </div>
              </div>

              <div className="border border-amber-200 rounded-lg overflow-hidden bg-amber-50/30">
                <div className="bg-amber-50 px-4 py-3 grid grid-cols-9 gap-4 text-sm font-medium text-amber-800">
                  <div className="col-span-1">
                    <Checkbox
                      checked={selectedNotInPJPOutlets.length === notInPJPOutlets.length && notInPJPOutlets.length > 0}
                      onCheckedChange={handleSelectAllNotInPJP}
                      className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                  </div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2">Outlet</div>
                  <div className="col-span-1">Phone</div>
                  <div className="col-span-1">Shop Open Hours</div>
                  <div className="col-span-1">Expected Value</div>
                  <div className="col-span-1">Last Order</div>
                  <div className="col-span-1">Priority</div>
                </div>

                <div className="divide-y divide-amber-200/50 max-h-96 overflow-y-auto">
                  {notInPJPOutlets.map((outlet) => renderOutletRow(
                    outlet, 
                    selectedNotInPJPOutlets.includes(outlet.id), 
                    handleSelectNotInPJPOutlet,
                    false
                  ))}
                </div>
              </div>

              {notInPJPOutlets.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    No outlets not in PJP found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All outlets for selected reps are already in today's PJP
                  </p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};