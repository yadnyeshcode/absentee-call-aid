import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, CheckCircle2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KPICardsProps {
  absentCount: number;
  totalRevenue: number;
  onRecoveryRateChange?: (rate: number) => void;
}

export const KPICards = ({ 
  absentCount, 
  totalRevenue, 
  onRecoveryRateChange 
}: KPICardsProps) => {
  const [recoveryRate, setRecoveryRate] = useState(85);

  const handleSliderChange = (value: number[]) => {
    const newRate = value[0];
    setRecoveryRate(newRate);
    onRecoveryRateChange?.(newRate);
  };

  const recoverableRevenue = Math.round(totalRevenue * (recoveryRate / 100));

  const cards = [
    {
      title: "Absent reps (today)",
      value: absentCount.toString(),
      icon: Users,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "At-risk revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Recoverable revenue",
      value: `₹${recoverableRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Ready to launch",
      value: (
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          All checks passed
        </Badge>
      ),
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={card.title} className="bg-card border-border/50 shadow-card hover:shadow-medium transition-all duration-200">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {card.title}
                  </p>
                  <div className="text-lg font-semibold text-foreground">
                    {typeof card.value === 'string' ? card.value : card.value}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* What-if slider */}
      <Card className="bg-card border-border/50 shadow-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">What-if Analysis</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adjust the expected recovery rate to see potential outcomes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-sm font-medium text-primary">
              {recoveryRate}% recovery rate
            </div>
          </div>
          
          <div className="space-y-3">
            <Slider
              value={[recoveryRate]}
              onValueChange={handleSliderChange}
              min={20}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative (20%)</span>
              <span>Aggressive (100%)</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};