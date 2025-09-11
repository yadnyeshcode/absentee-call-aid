import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Clock, 
  Phone, 
  MessageSquare, 
  Zap,
  Globe,
  Calendar,
  PlayCircle
} from "lucide-react";

interface CallConfigurationProps {
  onStartCalls: (config: CallConfig) => void;
  selectedOutlets: number;
  isLoading?: boolean;
}

interface CallConfig {
  timeRange: {
    start: string;
    end: string;
  };
  agent: {
    language: string;
    name: string;
  };
  sipProvider: string;
  whatsappEnabled: boolean;
  callInterval: number;
  maxConcurrent: number;
  selectedDate: string;
}

const agents = [
  { id: "hindi-agent", name: "Priya - Hindi Agent", language: "Hindi" },
  { id: "english-agent", name: "Sarah - English Agent", language: "English" },
  { id: "telugu-agent", name: "Ravi - Telugu Agent", language: "Telugu" },
  { id: "tamil-agent", name: "Meera - Tamil Agent", language: "Tamil" },
];

const sipProviders = [
  { id: "plivo", name: "Plivo", cps: 2 },
  { id: "twilio", name: "Twilio", cps: 1 },
  { id: "exotel", name: "Exotel", cps: 3 },
];

export const CallConfiguration = ({ 
  onStartCalls, 
  selectedOutlets, 
  isLoading = false 
}: CallConfigurationProps) => {
  const [config, setConfig] = useState<CallConfig>({
    timeRange: {
      start: "09:00",
      end: "18:00"
    },
    agent: {
      language: "hindi-agent",
      name: "Priya - Hindi Agent"
    },
    sipProvider: "plivo",
    whatsappEnabled: true,
    callInterval: 30,
    maxConcurrent: 5,
    selectedDate: new Date().toISOString().split('T')[0]
  });

  const selectedSipProvider = sipProviders.find(p => p.id === config.sipProvider);
  const estimatedTime = selectedSipProvider 
    ? Math.ceil(selectedOutlets / selectedSipProvider.cps / 60) 
    : 0;

  const handleConfigChange = (key: keyof CallConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleNestedConfigChange = (parentKey: keyof CallConfig, childKey: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey] as any,
        [childKey]: value
      }
    }));
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-info">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Call Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Configure your AI agent calls for {selectedOutlets} selected outlets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date & Time Settings
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <Input
                    type="date"
                    value={config.selectedDate}
                    onChange={(e) => handleConfigChange('selectedDate', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Start Time</Label>
                    <Input
                      type="time"
                      value={config.timeRange.start}
                      onChange={(e) => handleNestedConfigChange('timeRange', 'start', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">End Time</Label>
                    <Input
                      type="time"
                      value={config.timeRange.end}
                      onChange={(e) => handleNestedConfigChange('timeRange', 'end', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                AI Agent Selection
              </Label>
              <Select
                value={config.agent.language}
                onValueChange={(value) => {
                  const agent = agents.find(a => a.id === value);
                  if (agent) {
                    handleNestedConfigChange('agent', 'language', value);
                    handleNestedConfigChange('agent', 'name', agent.name);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-3">
                        <div className="p-1 rounded bg-primary/20">
                          <Globe className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.language} Language</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                SIP Trunk Provider
              </Label>
              <Select
                value={config.sipProvider}
                onValueChange={(value) => handleConfigChange('sipProvider', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SIP provider" />
                </SelectTrigger>
                <SelectContent>
                  {sipProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{provider.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {provider.cps} CPS
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSipProvider && (
                <p className="text-xs text-muted-foreground mt-2">
                  Estimated time: ~{estimatedTime} minutes for {selectedOutlets} calls
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Advanced Settings
              </Label>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm">Enable WhatsApp Notifications</Label>
                </div>
                <Switch
                  checked={config.whatsappEnabled}
                  onCheckedChange={(checked) => handleConfigChange('whatsappEnabled', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Call Interval (seconds)</Label>
                  <Input
                    type="number"
                    min="10"
                    max="300"
                    value={config.callInterval}
                    onChange={(e) => handleConfigChange('callInterval', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max Concurrent Calls</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={config.maxConcurrent}
                    onChange={(e) => handleConfigChange('maxConcurrent', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-success">
              <PlayCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-foreground">Ready to Start Calls</p>
              <p className="text-sm text-muted-foreground">
                {selectedOutlets} outlets • {config.agent.name.split(' - ')[0]} Agent • Est. {estimatedTime}min
              </p>
            </div>
          </div>

          <Button
            onClick={() => onStartCalls(config)}
            disabled={selectedOutlets === 0 || isLoading}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-3 text-base font-medium"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Initializing Calls...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Start AI Calls
              </div>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};