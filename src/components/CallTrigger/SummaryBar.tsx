import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Play, 
  TestTube, 
  Download, 
  Info, 
  Clock, 
  DollarSign,
  AlertTriangle,
  Phone
} from "lucide-react";

interface SummaryBarProps {
  selectedOutlets: number;
  excludedOutlets: number;
  estimatedCost: number;
  dialLaunchETA: string;
  operationFinishETA: string;
  onLaunch?: () => void;
  onSimulate?: () => void;
  onExport?: () => void;
  onShowExcluded?: () => void;
  isLoading?: boolean;
}

export const SummaryBar = ({
  selectedOutlets,
  excludedOutlets,
  estimatedCost,
  dialLaunchETA,
  operationFinishETA,
  onLaunch,
  onSimulate,
  onExport,
  onShowExcluded,
  isLoading = false
}: SummaryBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 shadow-strong z-50">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Summary info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">
                {selectedOutlets.toLocaleString()} outlets to call
              </span>
              
              {excludedOutlets > 0 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShowExcluded}
                    className="h-auto p-0 text-warning hover:text-warning/80"
                  >
                    Not in PJP: {excludedOutlets}
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Launch ETA: {dialLaunchETA}</span>
                      <Info className="h-3 w-3" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Time to start the first call</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Finish ETA: {operationFinishETA}</span>
                      <Info className="h-3 w-3" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estimated time to complete all calls</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>Cost: ₹{estimatedCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export List
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onSimulate}
              className="flex items-center gap-2"
              disabled={selectedOutlets === 0}
            >
              <TestTube className="h-4 w-4" />
              Simulate 5 calls
            </Button>

            <Button
              onClick={onLaunch}
              disabled={selectedOutlets === 0 || isLoading}
              className="flex items-center gap-2 px-8"
            >
              <Play className="h-4 w-4" />
              {isLoading ? "Launching..." : "Launch Operation"}
            </Button>
          </div>
        </div>

        {/* Warning messages */}
        {selectedOutlets === 0 && (
          <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Please select at least one outlet to launch the operation
              </span>
            </div>
          </div>
        )}

        {estimatedCost > 10000 && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                High cost operation (₹{estimatedCost.toLocaleString()}). Consider reducing the number of outlets or adjusting settings.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};