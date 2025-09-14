import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2,
  Phone,
  Clock,
  Target,
  Zap,
  Settings,
  PlayCircle,
  Building,
  ArrowUpRight,
  AlertTriangle
} from "lucide-react";

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number | undefined;
    
    const animate = (currentTime: number) => {
      const base = startTime ?? currentTime;
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - base) / duration, 1);
      
      setCount(Math.floor(end * progress));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);
  
  return count;
};

interface ExpandableKPICardsProps {
  absentCount: number;
  totalRevenue: number;
  salesReps: any[];
  selectedReps: string[];
  onSelectionChange: (selectedReps: string[]) => void;
  onRecoveryRateChange?: (rate: number) => void;
  onLaunchCampaign?: () => void;
}

export const ExpandableKPICards = ({ 
  absentCount, 
  totalRevenue,
  salesReps,
  selectedReps,
  onSelectionChange,
  onRecoveryRateChange,
  onLaunchCampaign
}: ExpandableKPICardsProps) => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [recoveryRate, setRecoveryRate] = useState(85);
  const [systemConfig, setSystemConfig] = useState({
    voiceAgent: true,
    whatsappFollowup: true,
    multilingual: true,
    realTimeTracking: true,
    autoRetry: false,
    smartRouting: true
  });

  // Animated counters
  const animatedAbsentCount = useAnimatedCounter(absentCount, 1500);
  const animatedTotalRevenue = useAnimatedCounter(totalRevenue, 2000);
  const animatedRecoverableRevenue = useAnimatedCounter(Math.round(totalRevenue * (recoveryRate / 100)), 2000);

  const handleCardClick = (cardId: string) => {
    setOpenModal(cardId);
  };

  const handleSliderChange = (value: number[]) => {
    const newRate = value[0];
    setRecoveryRate(newRate);
    onRecoveryRateChange?.(newRate);
  };

  const handleRepSelection = (repId: string) => {
    if (selectedReps.includes(repId)) {
      onSelectionChange(selectedReps.filter(id => id !== repId));
    } else {
      onSelectionChange([...selectedReps, repId]);
    }
  };

  const handleConfigChange = (key: string, value: boolean) => {
    setSystemConfig(prev => ({ ...prev, [key]: value }));
  };

  // KPI Card definitions
  const cards = [
    {
      id: "absent",
      title: "Absent Reps (Today)",
      value: animatedAbsentCount.toString(),
      icon: Users,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      trend: "+2 from yesterday",
      description: "Sales representatives not at their assigned locations",
      progress: (animatedAbsentCount / 10) * 100
    },
    {
      id: "at-risk",
      title: "At-Risk Revenue (₹)",
      value: `₹${animatedTotalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "₹15K increase",
      description: "Potential revenue loss from missed visits",
      progress: 75
    },
    {
      id: "recoverable",
      title: "Recoverable Revenue (₹)",
      value: `₹${animatedRecoverableRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: `${recoveryRate}% recovery rate`,
      description: "Estimated recoverable revenue through calls",
      progress: recoveryRate
    },
    {
      id: "ready",
      title: "Ready to Launch (Ready to Launch 🚀)",
      value: "System Ready",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: "All systems operational",
      description: "Campaign setup and configuration status",
      progress: 100
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <Card 
          key={card.id} 
          className="bg-card border-border/50 shadow-card transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
          onClick={() => handleCardClick(card.id)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {card.trend}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
            
            <div className="mt-4">
              <Progress value={card.progress} className="h-2" />
            </div>
          </div>
        </Card>
      ))}

      {/* Absent Reps Modal */}
      <Dialog open={openModal === "absent"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600" />
              Sales Representatives
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedReps.length} selected</Badge>
                {selectedReps.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onSelectionChange([])}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {salesReps.map((rep) => (
                <div 
                  key={rep.id} 
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover-lift ${
                    selectedReps.includes(rep.id) 
                      ? 'bg-primary/5 border-primary/30 shadow-sm' 
                      : 'bg-muted/20 border-border hover:bg-muted/30'
                  }`}
                  onClick={() => handleRepSelection(rep.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={selectedReps.includes(rep.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                      <div>
                        <div className="font-medium text-foreground">{rep.name}</div>
                        <div className="text-sm text-muted-foreground">{rep.territory}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm mb-1">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{rep.todayOutlets} outlets</span>
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        ₹{rep.estimatedValue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                className="flex-1" 
                disabled={selectedReps.length === 0}
                onClick={() => {
                  console.log('Triggering calls for selected reps:', selectedReps);
                  onLaunchCampaign?.();
                  setOpenModal(null);
                }}
              >
                <Phone className="h-4 w-4 mr-2" />
                Trigger Calls ({selectedReps.length})
              </Button>
              <Button 
                variant="outline"
                onClick={() => onSelectionChange(salesReps.map(rep => rep.id))}
              >
                Select All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* At-Risk Revenue Modal */}
      <Dialog open={openModal === "at-risk"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              At-Risk Revenue Analysis
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">High Risk</span>
                </div>
                <div className="text-2xl font-bold text-red-600">₹{Math.round(totalRevenue * 0.4).toLocaleString()}</div>
                <div className="text-sm text-red-600">Missed visits today</div>
              </div>
              
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Medium Risk</span>
                </div>
                <div className="text-2xl font-bold text-amber-600">₹{Math.round(totalRevenue * 0.35).toLocaleString()}</div>
                <div className="text-sm text-amber-600">Delayed visits</div>
              </div>
              
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Low Risk</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">₹{Math.round(totalRevenue * 0.25).toLocaleString()}</div>
                <div className="text-sm text-orange-600">Reschedulable</div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-sm font-medium text-foreground">What-If Analysis</h5>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-muted-foreground">Recovery Simulation</span>
                  <span className="text-sm font-medium">{recoveryRate}%</span>
                </div>
                <Slider
                  value={[recoveryRate]}
                  onValueChange={handleSliderChange}
                  min={20}
                  max={100}
                  step={5}
                  className="mb-3"
                />
                <div className="text-center">
                  <div className="text-lg font-semibold text-emerald-600">
                    ₹{Math.round(totalRevenue * (recoveryRate / 100)).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Potential Recovery</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recoverable Revenue Modal */}
      <Dialog open={openModal === "recoverable"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Recovery Opportunities
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-200">
                <div className="text-sm text-emerald-700 mb-1">Immediate Recovery</div>
                <div className="text-xl font-bold text-emerald-600">
                  ₹{Math.round(animatedRecoverableRevenue * 0.6).toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600">Available today</div>
              </div>
              
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                <div className="text-sm text-blue-700 mb-1">Extended Recovery</div>
                <div className="text-xl font-bold text-blue-600">
                  ₹{Math.round(animatedRecoverableRevenue * 0.4).toLocaleString()}
                </div>
                <div className="text-xs text-blue-600">Within 3 days</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => {
                  onLaunchCampaign?.();
                  setOpenModal(null);
                }}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Recovery Campaign
              </Button>
              <Button variant="outline">
                Test Campaign (5 calls)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ready to Launch Modal */}
      <Dialog open={openModal === "ready"} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              System Configuration
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid gap-4">
              {Object.entries(systemConfig).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <div className="font-medium text-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {key === 'voiceAgent' && 'AI-powered voice calling system'}
                      {key === 'whatsappFollowup' && 'Automated WhatsApp follow-up messages'}
                      {key === 'multilingual' && 'Support for Hindi, English, and regional languages'}
                      {key === 'realTimeTracking' && 'Live call status and analytics'}
                      {key === 'autoRetry' && 'Automatic retry for failed calls'}
                      {key === 'smartRouting' && 'Intelligent call routing and scheduling'}
                    </div>
                  </div>
                  <Switch 
                    checked={enabled}
                    onCheckedChange={(value) => handleConfigChange(key, value)}
                  />
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">System Ready</span>
              </div>
              <p className="text-sm text-emerald-700 mb-4">
                All configurations are set. You can launch the campaign immediately.
              </p>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  onLaunchCampaign?.();
                  setOpenModal(null);
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                Launch Campaign Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};