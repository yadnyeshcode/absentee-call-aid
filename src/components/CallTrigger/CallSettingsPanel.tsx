import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Clock, 
  Languages, 
  Phone, 
  MessageSquare, 
  Mic, 
  Settings,
  Info,
  DollarSign,
  Calendar,
  Shield,
  Zap
} from "lucide-react";

interface CallSettingsPanelProps {
  onSettingsChange?: (settings: any) => void;
}

export const CallSettingsPanel = ({ onSettingsChange }: CallSettingsPanelProps) => {
  const [settings, setSettings] = useState({
    timeRange: { start: "09:00", end: "18:00" },
    agentLanguage: "auto",
    trunkProvider: "plivo",
    whatsappPre: true,
    whatsappPost: false,
    recording: true,
    concurrentChannels: 10,
    ringTime: 30,
    retryAttempts: 3,
    retryBackoff: 5,
    prioritization: "value",
    dndRespect: true,
    quietHours: true,
    costCap: 5000,
    scheduleMode: "now",
    scheduledTime: "",
    languageFallback: "english"
  });

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const trunkProviders = [
    { value: "plivo", label: "Plivo", cps: "2 CPS" },
    { value: "twilio", label: "Twilio", cps: "5 CPS" },
    { value: "exotel", label: "Exotel", cps: "3 CPS" }
  ];

  return (
    <Card className="bg-card border-border/50 shadow-card h-fit sticky top-6">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Call Settings</h3>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Basic Settings
            </h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time Range
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={settings.timeRange.start}
                    onChange={(e) => updateSetting('timeRange', { ...settings.timeRange, start: e.target.value })}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={settings.timeRange.end}
                    onChange={(e) => updateSetting('timeRange', { ...settings.timeRange, end: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Agent Language
                </Label>
                <Select value={settings.agentLanguage} onValueChange={(value) => updateSetting('agentLanguage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="hindi">Hindi Agent</SelectItem>
                    <SelectItem value="english">English Agent</SelectItem>
                    <SelectItem value="telugu">Telugu Agent</SelectItem>
                    <SelectItem value="tamil">Tamil Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>

          {/* Advanced Settings */}
          <Accordion type="single" collapsible className="border border-border/50 rounded-lg">
            <AccordionItem value="advanced" className="border-none">
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Advanced Settings
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  {/* SIP Trunk Provider */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      SIP Trunk Provider
                    </Label>
                    <Select value={settings.trunkProvider} onValueChange={(value) => updateSetting('trunkProvider', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {trunkProviders.map((provider) => (
                          <SelectItem key={provider.value} value={provider.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{provider.label}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {provider.cps}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-foreground">Notifications</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          WhatsApp Pre-call
                        </Label>
                        <Switch
                          checked={settings.whatsappPre}
                          onCheckedChange={(checked) => updateSetting('whatsappPre', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-xs flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          WhatsApp Post-call
                        </Label>
                        <Switch
                          checked={settings.whatsappPost}
                          onCheckedChange={(checked) => updateSetting('whatsappPost', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-xs flex items-center gap-2">
                          <Mic className="h-4 w-4" />
                          Call Recording
                        </Label>
                        <Switch
                          checked={settings.recording}
                          onCheckedChange={(checked) => updateSetting('recording', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Retries */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-foreground">Retries</h5>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Attempts</Label>
                        <Select value={settings.retryAttempts.toString()} onValueChange={(value) => updateSetting('retryAttempts', parseInt(value))}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Backoff (min)</Label>
                        <Input
                          type="number"
                          value={settings.retryBackoff}
                          onChange={(e) => updateSetting('retryBackoff', parseInt(e.target.value))}
                          className="h-8"
                          min="1"
                          max="60"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Prioritization */}
                  <div className="space-y-2">
                    <Label className="text-xs">Prioritization</Label>
                    <Select value={settings.prioritization} onValueChange={(value) => updateSetting('prioritization', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="value">Value First</SelectItem>
                        <SelectItem value="priority">Priority First</SelectItem>
                        <SelectItem value="time">Time Window</SelectItem>
                        <SelectItem value="random">Random</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </h5>
                    
                    <Select value={settings.scheduleMode} onValueChange={(value) => updateSetting('scheduleMode', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Start Now</SelectItem>
                        <SelectItem value="later">Schedule Later</SelectItem>
                      </SelectContent>
                    </Select>

                    {settings.scheduleMode === 'later' && (
                      <Input
                        type="datetime-local"
                        value={settings.scheduledTime}
                        onChange={(e) => updateSetting('scheduledTime', e.target.value)}
                        className="h-8"
                      />
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Card>
  );
};