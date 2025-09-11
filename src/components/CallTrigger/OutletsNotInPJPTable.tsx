import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Building, 
  Phone, 
  Clock, 
  DollarSign,
  ShoppingCart,
  Star,
  Search,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Plus
} from "lucide-react";

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

interface OutletsNotInPJPTableProps {
  outlets: Outlet[];
  selectedOutlets: string[];
  onSelectionChange: (selectedOutlets: string[]) => void;
}

// Auto-select all outlets when new outlets appear
const useAutoSelectOutlets = (outlets: Outlet[], onSelectionChange: (selected: string[]) => void) => {
  React.useEffect(() => {
    if (outlets.length > 0) {
      const allOutletIds = outlets.map(outlet => outlet.id);
      onSelectionChange(allOutletIds);
    }
  }, [outlets.length]);
};

export const OutletsNotInPJPTable = ({
  outlets,
  selectedOutlets,
  onSelectionChange
}: OutletsNotInPJPTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Auto-select all outlets when they appear
  useAutoSelectOutlets(outlets, onSelectionChange);

  // Only show outlets that are not in PJP
  const filteredOutlets = outlets.filter(outlet => {
    const matchesSearch = outlet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotInPJP = outlet.notInPJP;
    return matchesSearch && isNotInPJP;
  });

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
    <Card className="bg-card border-l-4 border-l-amber-500 border-border/50 shadow-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-6 pb-0 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {isOpen ? <ChevronDown className="h-5 w-5 text-amber-600" /> : <ChevronRight className="h-5 w-5 text-amber-600" />}
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-foreground">Outlets not in today's PJP</h3>
                </div>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Plus className="h-3 w-3 mr-1" />
                  Additional ({filteredOutlets.length})
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                {isOpen ? "Collapse" : "Expand"}
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

            <div className="border border-amber-200 rounded-lg overflow-hidden bg-amber-50/30">
              <div className="bg-amber-50 px-4 py-3 grid grid-cols-9 gap-4 text-sm font-medium text-amber-800">
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedOutlets.length === filteredOutlets.length && filteredOutlets.length > 0}
                    onCheckedChange={handleSelectAll}
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

              <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
                {filteredOutlets.map((outlet) => (
                  <div
                    key={outlet.id}
                    className={`px-4 py-3 grid grid-cols-9 gap-4 items-center hover:bg-amber-50/50 transition-colors cursor-pointer ${
                      selectedOutlets.includes(outlet.id) ? 'bg-amber-50 border-l-2 border-l-amber-500' : ''
                    }`}
                    onClick={() => handleSelectOutlet(outlet.id)}
                  >
                    <div className="col-span-1">
                      <Checkbox
                        checked={selectedOutlets.includes(outlet.id)}
                        className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                      />
                    </div>
                    <div className="col-span-1">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-300">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not PJP
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
                ))}
              </div>
            </div>

            {filteredOutlets.length === 0 && (
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
  );
};