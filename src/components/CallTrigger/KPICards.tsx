import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, DollarSign, TrendingUp, CheckCircle2, Info, ArrowUpRight, ArrowDownRight, Target, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(end * progress));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

interface KPICardsProps {
  absentCount: number;
  totalRevenue: number;
  onRecoveryRateChange?: (rate: number) => void;
  onQuickAction?: (action: string) => void;
}

export const KPICards = ({ 
  absentCount, 
  totalRevenue, 
  onRecoveryRateChange,
  onQuickAction 
}: KPICardsProps) => {
  const [recoveryRate, setRecoveryRate] = useState(85);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Animated counters
  const animatedAbsentCount = useAnimatedCounter(absentCount, 1500);
  const animatedTotalRevenue = useAnimatedCounter(totalRevenue, 2000);
  const animatedRecoverableRevenue = useAnimatedCounter(Math.round(totalRevenue * (recoveryRate / 100)), 2000);

  const handleSliderChange = (value: number[]) => {
    const newRate = value[0];
    setRecoveryRate(newRate);
    onRecoveryRateChange?.(newRate);
  };

  const getImpactColor = (rate: number) => {
    if (rate >= 80) return "text-success";
    if (rate >= 60) return "text-warning";
    return "text-destructive";
  };

  const getImpactMessage = (rate: number) => {
    if (rate >= 80) return "Excellent recovery potential";
    if (rate >= 60) return "Good recovery opportunity";
    return "Conservative estimate";
  };

  const cards = [
    {
      id: "absent",
      title: "Absent reps (today)",
      value: animatedAbsentCount.toString(),
      icon: Users,
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: "+2 from yesterday",
      trendIcon: ArrowUpRight,
      trendColor: "text-warning",
      description: "Sales representatives not at their assigned locations",
      actionLabel: "View Details",
      progress: (animatedAbsentCount / 10) * 100 // Assuming 10 is max
    },
    {
      id: "at-risk",
      title: "At-risk revenue",
      value: `₹${animatedTotalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      trend: "₹15K increase",
      trendIcon: ArrowUpRight,
      trendColor: "text-destructive",
      description: "Potential revenue loss from missed visits",
      actionLabel: "Analyze Impact",
      progress: 75
    },
    {
      id: "recoverable",
      title: "Recoverable revenue",
      value: `₹${animatedRecoverableRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: `${recoveryRate}% recovery rate`,
      trendIcon: Target,
      trendColor: getImpactColor(recoveryRate),
      description: getImpactMessage(recoveryRate),
      actionLabel: "Optimize Rate",
      progress: recoveryRate,
      interactive: true
    },
    {
      id: "ready",
      title: "Ready to launch",
      value: (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-success font-medium">Live</span>
          </div>
        </div>
      ),
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: "All systems operational",
      trendIcon: Zap,
      trendColor: "text-success",
      description: "System ready for immediate deployment",
      actionLabel: "Launch Now",
      progress: 100
    }
  ];

  return (
    <div className="space-y-6">
      {/* Interactive KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card 
            key={card.id} 
            className={`bg-card border-border/50 shadow-card hover:shadow-strong transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
              activeCard === card.id ? 'ring-2 ring-primary shadow-primary/20' : ''
            }`}
            onMouseEnter={() => setActiveCard(card.id)}
            onMouseLeave={() => setActiveCard(null)}
            onClick={() => card.interactive ? setShowDetailedView(!showDetailedView) : onQuickAction?.(card.id)}
          >
            <div className="p-4 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-primary transform translate-x-6 -translate-y-6"></div>
              </div>
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${card.bgColor} transition-all duration-300 ${
                    activeCard === card.id ? 'scale-110' : ''
                  }`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-60 hover:opacity-100">
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{card.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {card.title}
                  </p>
                  <div className="text-lg font-bold text-foreground">
                    {typeof card.value === 'string' ? card.value : card.value}
                  </div>
                  
                  {/* Trend */}
                  <div className="flex items-center gap-1 text-xs">
                    <card.trendIcon className={`h-3 w-3 ${card.trendColor}`} />
                    <span className={card.trendColor}>{card.trend}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <Progress 
                    value={card.progress} 
                    className="h-1.5 bg-muted/30"
                  />
                </div>

                {/* Action Button */}
                {activeCard === card.id && (
                  <div className="mt-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs w-full bg-primary/5 hover:bg-primary/10 text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAction?.(card.id);
                      }}
                    >
                      {card.actionLabel}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Interactive What-if Analysis */}
      <Card className="bg-card border-border/50 shadow-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Recovery Optimization</h3>
                <p className="text-xs text-muted-foreground">Adjust expected recovery to see impact</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {recoveryRate}%
              </div>
              <div className={`text-xs ${getImpactColor(recoveryRate)}`}>
                {getImpactMessage(recoveryRate)}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Slider
                value={[recoveryRate]}
                onValueChange={handleSliderChange}
                min={20}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Conservative</span>
                <span>Realistic</span>
                <span>Optimistic</span>
              </div>
            </div>

            {/* Impact Visualization */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <div className="text-xs text-muted-foreground">Potential Calls</div>
                <div className="text-sm font-semibold text-foreground">
                  {Math.round(absentCount * 4.2)}
                </div>
              </div>
              <div className="text-center p-2 rounded-lg bg-success/10">
                <div className="text-xs text-muted-foreground">Recovery Value</div>
                <div className="text-sm font-semibold text-success">
                  ₹{animatedRecoverableRevenue.toLocaleString()}
                </div>
              </div>
              <div className="text-center p-2 rounded-lg bg-primary/10">
                <div className="text-xs text-muted-foreground">Est. Cost</div>
                <div className="text-sm font-semibold text-primary">
                  ₹{Math.round(absentCount * 4.2 * 2.5).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};