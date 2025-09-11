import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Pause, 
  Play,
  BarChart3,
  Users,
  Target
} from "lucide-react";

interface CallProgressProps {
  isActive: boolean;
  totalCalls: number;
  completedCalls: number;
  successfulCalls: number;
  failedCalls: number;
  currentAgent: string;
  estimatedTimeRemaining: number;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
}

interface LiveCall {
  id: string;
  outlet: string;
  status: 'dialing' | 'connected' | 'completed' | 'failed';
  duration: number;
  agent: string;
}

export const CallProgress = ({
  isActive,
  totalCalls,
  completedCalls,
  successfulCalls,
  failedCalls,
  currentAgent,
  estimatedTimeRemaining,
  onPause,
  onResume,
  onStop
}: CallProgressProps) => {
  const [liveCalls, setLiveCalls] = useState<LiveCall[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const progressPercentage = totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0;
  const successRate = completedCalls > 0 ? (successfulCalls / completedCalls) * 100 : 0;

  // Simulate live calls for demo
  useEffect(() => {
    if (isActive && !isPaused) {
      const interval = setInterval(() => {
        setLiveCalls(prev => {
          const updated = prev.map(call => ({
            ...call,
            duration: call.duration + 1
          }));
          
          // Simulate call completion
          const completingCall = updated.find(call => 
            call.duration > 30 && call.status === 'connected'
          );
          
          if (completingCall) {
            completingCall.status = Math.random() > 0.15 ? 'completed' : 'failed';
          }

          // Remove completed/failed calls after a delay
          return updated.filter(call => 
            call.status === 'dialing' || call.status === 'connected' || 
            (call.status === 'completed' || call.status === 'failed') && call.duration < 35
          );
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, isPaused]);

  const handlePause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setIsPaused(false);
    onResume?.();
  };

  if (!isActive) {
    return null;
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-info">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Call Progress</h2>
              <p className="text-sm text-muted-foreground">
                {currentAgent} is placing calls to outlets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPaused ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePause}
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResume}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Resume
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={onStop}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Stop
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-info" />
                <span className="text-sm font-medium">Total Calls</span>
              </div>
              <Badge variant="secondary">{totalCalls}</Badge>
            </div>
            <div className="text-2xl font-bold text-foreground">{completedCalls}</div>
            <div className="text-xs text-muted-foreground">completed</div>
          </Card>

          <Card className="p-4 border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <Badge variant="secondary" className="bg-success/20 text-success">
                {successRate.toFixed(1)}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-success">{successfulCalls}</div>
            <div className="text-xs text-muted-foreground">successful</div>
          </Card>

          <Card className="p-4 border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">Failed Calls</span>
              </div>
              <Badge variant="destructive">{failedCalls}</Badge>
            </div>
            <div className="text-2xl font-bold text-destructive">{failedCalls}</div>
            <div className="text-xs text-muted-foreground">failed</div>
          </Card>

          <Card className="p-4 border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Time Remaining</span>
              </div>
              <Badge variant="secondary" className="bg-warning/20 text-warning">
                ~{estimatedTimeRemaining}min
              </Badge>
            </div>
            <div className="text-2xl font-bold text-warning">
              {Math.floor(estimatedTimeRemaining / 60)}:
              {String(estimatedTimeRemaining % 60).padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground">minutes</div>
          </Card>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {progressPercentage.toFixed(1)}% Complete
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-muted"
          />
        </div>

        {liveCalls.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Live Calls ({liveCalls.length})
            </h3>
            
            <div className="grid gap-3">
              {liveCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      call.status === 'connected' ? 'bg-gradient-success animate-pulse' :
                      call.status === 'dialing' ? 'bg-gradient-warning animate-pulse' :
                      call.status === 'completed' ? 'bg-gradient-info' :
                      'bg-gradient-destructive'
                    }`}>
                      <Phone className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{call.outlet}</p>
                      <p className="text-xs text-muted-foreground">
                        {call.agent} • {Math.floor(call.duration / 60)}:
                        {String(call.duration % 60).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={
                      call.status === 'connected' ? 'default' :
                      call.status === 'dialing' ? 'secondary' :
                      call.status === 'completed' ? 'default' :
                      'destructive'
                    }
                    className={
                      call.status === 'connected' ? 'bg-success text-success-foreground' :
                      call.status === 'completed' ? 'bg-info text-info-foreground' :
                      ''
                    }
                  >
                    {call.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {isPaused && (
          <div className="mt-6 p-4 rounded-lg bg-warning/10 border border-warning/30">
            <div className="flex items-center gap-2 text-warning">
              <Pause className="h-4 w-4" />
              <span className="font-medium">Calls Paused</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              All active calls will continue, but no new calls will be initiated.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};