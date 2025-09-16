import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming,
  CheckCircle2, 
  XCircle, 
  Pause, 
  Play, 
  Square, 
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  Loader2,
  Minimize2,
  X
} from "lucide-react";

interface CallLog {
  id: string;
  outlet: string;
  phone: string;
  status: 'initiated' | 'ringing' | 'live' | 'completed' | 'failed';
  startTime: string;
  duration?: string;
  result?: string;
  orderValue?: number;
  agent: string;
}

interface LaunchProgressScreenProps {
  isActive: boolean;
  totalCalls: number;
  currentAgent: string;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onMinimize?: () => void;
  onRescheduleOverflow?: () => void;
}

export const LaunchProgressScreen = ({
  isActive,
  totalCalls,
  currentAgent,
  onPause,
  onResume,
  onStop,
  onMinimize,
  onRescheduleOverflow
}: LaunchProgressScreenProps) => {
  const [progress, setProgress] = useState({
    initiated: 0,
    ringing: 0,
    live: 0,
    completed: 0,
    failed: 0
  });
  
  const [kpis, setKpis] = useState({
    contactRate: 0,
    orders: 0,
    revenue: 0,
    avgCalls: 0,
    aov: 0,
    avgCallDuration: 0,
    productiveCalls: 0,
    cor: 0
  });

  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [eta, setEta] = useState("12 min");

  // Simulate progress updates
  useEffect(() => {
    if (!isActive || isPaused) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const total = prev.initiated + prev.ringing + prev.live + prev.completed + prev.failed;
        if (total >= totalCalls) return prev;

        const newInitiated = Math.min(prev.initiated + Math.floor(Math.random() * 3) + 1, totalCalls);
        const newRinging = Math.max(0, Math.min(prev.ringing + Math.floor(Math.random() * 2), newInitiated - prev.live - prev.completed - prev.failed));
        const newLive = Math.max(0, Math.min(prev.live + Math.floor(Math.random() * 2), newInitiated - prev.ringing - prev.completed - prev.failed));
        const newCompleted = Math.min(prev.completed + Math.floor(Math.random() * 2), newInitiated - prev.ringing - prev.live - prev.failed);
        const newFailed = Math.max(0, newInitiated - newRinging - newLive - newCompleted);

        return {
          initiated: newInitiated,
          ringing: newRinging,
          live: newLive,
          completed: newCompleted,
          failed: newFailed
        };
      });

      // Update KPIs
      setKpis(prev => {
        const totalCalls = progress.completed + progress.failed + progress.live + progress.ringing;
        const completedCalls = prev.orders + Math.floor(Math.random() * 2);
        const newRevenue = prev.revenue + Math.floor(Math.random() * 5000);
        const avgOrderValue = completedCalls > 0 ? newRevenue / completedCalls : 0;
        const callToOrderRatio = totalCalls > 0 ? (completedCalls / totalCalls * 100) : 0;
        
        return {
          contactRate: Math.min(prev.contactRate + Math.random() * 2, 85),
          orders: completedCalls,
          revenue: newRevenue,
          avgCalls: Math.floor(Math.random() * 5) + 8, // 8-12 calls per hour
          aov: avgOrderValue,
          avgCallDuration: Math.floor(Math.random() * 60) + 120, // 2-3 minutes in seconds
          productiveCalls: Math.floor(totalCalls * 0.6), // 60% productive calls
          cor: callToOrderRatio
        };
      });

      // Add new call log entries
      if (Math.random() > 0.7) {
        const newLog: CallLog = {
          id: `call-${Date.now()}`,
          outlet: `Outlet ${Math.floor(Math.random() * 100)}`,
          phone: `+91-9876${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
          status: ['completed', 'failed', 'live'][Math.floor(Math.random() * 3)] as any,
          startTime: new Date().toLocaleTimeString(),
          duration: '2:34',
          result: Math.random() > 0.5 ? 'Order placed' : 'No answer',
          orderValue: Math.random() > 0.5 ? Math.floor(Math.random() * 5000) : undefined,
          agent: currentAgent
        };

        setCallLogs(prev => [newLog, ...prev.slice(0, 19)]);
      }
    }, 2000);

    return () => clearInterval(progressInterval);
  }, [isActive, isPaused, totalCalls, currentAgent]);

  const handlePause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setIsPaused(false);
    onResume?.();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiated': return 'text-blue-600 bg-blue-100';
      case 'ringing': return 'text-yellow-600 bg-yellow-100';
      case 'live': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-green-700 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'initiated': return <Phone className="h-3 w-3" />;
      case 'ringing': return <PhoneCall className="h-3 w-3" />;
      case 'live': return <PhoneIncoming className="h-3 w-3" />;
      case 'completed': return <CheckCircle2 className="h-3 w-3" />;
      case 'failed': return <XCircle className="h-3 w-3" />;
      default: return <Phone className="h-3 w-3" />;
    }
  };

  const completionRate = totalCalls > 0 ? ((progress.completed + progress.failed) / totalCalls) * 100 : 0;

  if (!isActive) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Banner */}
        <Card className="bg-gradient-primary text-white border-0 shadow-glow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  {isPaused ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <Activity className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {isPaused ? 'Campaign Paused' : 'AI Agent is Placing Calls...'}
                  </h1>
                  <p className="text-white/80">
                    {currentAgent} • {progress.completed + progress.failed} of {totalCalls} calls processed • ETA: {eta}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onMinimize}
                  className="flex items-center gap-2 bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                  <Minimize2 className="h-4 w-4" />
                  Minimize
                </Button>

                {!isPaused ? (
                  <Button
                    variant="secondary"
                    onClick={handlePause}
                    className="flex items-center gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={handleResume}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Resume
                  </Button>
                )}
                
                <Button
                  variant="destructive"
                  onClick={onStop}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Stop & Exit
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {[
            { key: 'initiated', label: 'Initiated', icon: Phone, color: 'text-blue-600' },
            { key: 'ringing', label: 'Ringing', icon: PhoneCall, color: 'text-yellow-600' },
            { key: 'live', label: 'Live', icon: PhoneIncoming, color: 'text-green-600' },
            { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-green-700' },
            { key: 'failed', label: 'Failed', icon: XCircle, color: 'text-red-600' }
          ].map(({ key, label, icon: Icon, color }) => (
            <Card key={key} className="bg-card border-border/50 shadow-card">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    {progress[key as keyof typeof progress]}
                  </span>
                </div>
                <Progress
                  value={totalCalls > 0 ? (progress[key as keyof typeof progress] / totalCalls) * 100 : 0}
                  className="h-2"
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KPI Cards */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Live Metrics</h3>
            
            {[
              { title: 'Contact Rate', value: `${kpis.contactRate.toFixed(1)}%`, icon: Users, color: 'text-primary' },
              { title: 'Orders', value: kpis.orders.toString(), icon: CheckCircle2, color: 'text-success' },
              { title: 'Revenue', value: `₹${kpis.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-success' },
              { title: 'Avg Calls/Hr', value: kpis.avgCalls.toString(), icon: Phone, color: 'text-primary' },
              { title: 'AOV', value: `₹${Math.floor(kpis.aov).toLocaleString()}`, icon: TrendingUp, color: 'text-primary' },
              { title: 'Avg Duration', value: `${Math.floor(kpis.avgCallDuration / 60)}:${String(kpis.avgCallDuration % 60).padStart(2, '0')}`, icon: Clock, color: 'text-primary' },
              { title: 'Productive Calls', value: kpis.productiveCalls.toString(), icon: Activity, color: 'text-success' },
              { title: 'COR', value: `${kpis.cor.toFixed(1)}%`, icon: TrendingUp, color: 'text-primary' }
            ].map((metric) => (
              <Card key={metric.title} className="bg-card border-border/50 shadow-card">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${metric.color.replace('text-', 'bg-').replace('primary', 'primary/10').replace('success', 'success/10').replace('destructive', 'destructive/10')}`}>
                        <metric.icon className={`h-4 w-4 ${metric.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.title}</p>
                        <p className="text-xl font-bold text-foreground">{metric.value}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={onRescheduleOverflow}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Reschedule Overflow
              </Button>
            </div>
          </div>

          {/* Call Logs */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border/50 shadow-card h-[600px]">
              <div className="p-4 border-b border-border/50">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Live Call Stream
                </h3>
              </div>
              
              <ScrollArea className="h-[540px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Outlet</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {callLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.outlet}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.phone}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-xs ${getStatusColor(log.status)}`}>
                            {getStatusIcon(log.status)}
                            <span className="ml-1 capitalize">{log.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.startTime}</TableCell>
                        <TableCell className="text-sm">{log.duration || '-'}</TableCell>
                        <TableCell className="text-sm">{log.result || '-'}</TableCell>
                        <TableCell className="text-sm">
                          {log.orderValue ? `₹${log.orderValue.toLocaleString()}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};