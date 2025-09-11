import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  User, 
  MapPin, 
  Clock, 
  Search, 
  Upload, 
  Download,
  Calendar,
  Building
} from "lucide-react";

interface SalesRep {
  id: string;
  name: string;
  territory: string;
  assignedOutlets: number;
  lastSeen: string;
  pjpToday: Array<{
    outlet: string;
    time: string;
    location: string;
    status: 'pending' | 'visited' | 'missed';
  }>;
  phone: string;
}

interface SalesRepsListProps {
  salesReps: SalesRep[];
  selectedReps: string[];
  onSelectionChange: (selectedReps: string[]) => void;
  onUploadData?: () => void;
  onDownloadTemplate?: () => void;
}

export const SalesRepsList = ({
  salesReps,
  selectedReps,
  onSelectionChange,
  onUploadData,
  onDownloadTemplate
}: SalesRepsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReps = salesReps.filter(rep =>
    rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedReps.length === filteredReps.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredReps.map(rep => rep.id));
    }
  };

  const handleSelectRep = (repId: string) => {
    if (selectedReps.includes(repId)) {
      onSelectionChange(selectedReps.filter(id => id !== repId));
    } else {
      onSelectionChange([...selectedReps, repId]);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Absent Sales Representatives
            </h2>
            <p className="text-sm text-muted-foreground">
              Select sales reps to trigger AI calls for their assigned outlets
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onDownloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            <Button
              variant="outline"
              onClick={onUploadData}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Data
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or territory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={handleSelectAll}
            className="flex items-center gap-2"
          >
            <Checkbox
              checked={selectedReps.length === filteredReps.length && filteredReps.length > 0}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            Select All ({filteredReps.length})
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredReps.map((rep) => (
            <Card 
              key={rep.id}
              className={`relative border-2 transition-all duration-200 cursor-pointer hover:shadow-soft ${
                selectedReps.includes(rep.id) 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/50 hover:border-primary/50'
              }`}
              onClick={() => handleSelectRep(rep.id)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedReps.includes(rep.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="p-2 rounded-lg bg-gradient-primary">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{rep.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {rep.territory}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Building className="h-3 w-3" />
                          {rep.assignedOutlets} outlets
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="destructive" className="mb-2">
                      Absent
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last seen: {rep.lastSeen}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Today's PJP ({rep.pjpToday.length} outlets)
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {rep.pjpToday.slice(0, 4).map((outlet, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                      >
                        <div>
                          <p className="text-sm font-medium">{outlet.outlet}</p>
                          <p className="text-xs text-muted-foreground">{outlet.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">{outlet.time}</p>
                          <Badge 
                            variant={outlet.status === 'missed' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {outlet.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {rep.pjpToday.length > 4 && (
                      <div className="col-span-full text-center py-2">
                        <p className="text-xs text-muted-foreground">
                          +{rep.pjpToday.length - 4} more outlets...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredReps.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              No sales reps found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or upload new data
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};