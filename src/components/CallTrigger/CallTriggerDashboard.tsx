import { useState } from "react";
import { KPICards } from "./KPICards";
import { SourceSection } from "./SourceSection";
import { AbsentRepsTable } from "./AbsentRepsTable";
import { OutletsTable } from "./OutletsTable";
import { CallSettingsPanel } from "./CallSettingsPanel";
import { SummaryBar } from "./SummaryBar";
import { LaunchProgressScreen } from "./LaunchProgressScreen";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockSalesReps = [
  {
    id: "1",
    name: "Rajesh Kumar",
    territory: "North Delhi",
    todayOutlets: 5,
    estimatedValue: 25000,
    defaultLanguage: "Hindi",
    pjpToday: [
      { outlet: "Metro Store", phone: "+91-9876543210", time: "09:00", location: "Connaught Place", expectedValue: 5000, status: "missed" as const },
      { outlet: "Big Bazaar", phone: "+91-9876543211", time: "11:30", location: "Karol Bagh", expectedValue: 7500, status: "pending" as const },
      { outlet: "Reliance Fresh", phone: "+91-9876543212", time: "14:00", location: "Lajpat Nagar", expectedValue: 4500, status: "pending" as const },
      { outlet: "Spencer's", phone: "+91-9876543213", time: "16:30", location: "CP Market", expectedValue: 3000, status: "pending" as const },
      { outlet: "More Supermarket", phone: "+91-9876543214", time: "18:00", location: "Khan Market", expectedValue: 5000, status: "pending" as const },
    ]
  },
  {
    id: "2",
    name: "Priya Sharma",
    territory: "South Mumbai",
    todayOutlets: 4,
    estimatedValue: 18000,
    defaultLanguage: "English",
    pjpToday: [
      { outlet: "D-Mart", phone: "+91-9876543215", time: "10:00", location: "Bandra West", expectedValue: 6000, status: "missed" as const },
      { outlet: "Hypercity", phone: "+91-9876543216", time: "13:00", location: "Malad", expectedValue: 4500, status: "pending" as const },
      { outlet: "Nature's Basket", phone: "+91-9876543217", time: "15:30", location: "Juhu", expectedValue: 3500, status: "pending" as const },
      { outlet: "Foodworld", phone: "+91-9876543218", time: "17:00", location: "Andheri", expectedValue: 4000, status: "pending" as const },
    ]
  },
  {
    id: "3",
    name: "Amit Singh",
    territory: "East Bangalore", 
    todayOutlets: 4,
    estimatedValue: 22000,
    defaultLanguage: "Telugu",
    pjpToday: [
      { outlet: "Fresh@", phone: "+91-9876543219", time: "09:30", location: "Whitefield", expectedValue: 5500, status: "pending" as const },
      { outlet: "Total Mall", phone: "+91-9876543220", time: "12:00", location: "Sarjapur Road", expectedValue: 6000, status: "pending" as const },
      { outlet: "Forum Mall", phone: "+91-9876543221", time: "15:00", location: "Koramangala", expectedValue: 5000, status: "pending" as const },
      { outlet: "Mantri Square", phone: "+91-9876543222", time: "17:30", location: "Malleshwaram", expectedValue: 5500, status: "pending" as const },
    ]
  }
];

// Generate mock outlets from sales reps
const generateOutlets = (salesReps: any[], selectedReps: string[]) => {
  return salesReps
    .filter(rep => selectedReps.includes(rep.id))
    .flatMap(rep => 
      rep.pjpToday.map((outlet: any, index: number) => ({
        id: `${rep.id}-${index}`,
        name: outlet.outlet,
        phones: [outlet.phone],
        timeWindow: `${outlet.time}-${(parseInt(outlet.time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
        expectedValue: outlet.expectedValue,
        language: rep.defaultLanguage.toLowerCase(),
        whatsappOptIn: Math.random() > 0.3,
        dndStatus: Math.random() > 0.8,
        lastOrder: `${Math.floor(Math.random() * 30) + 1} days ago`,
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        repId: rep.id,
        excluded: Math.random() > 0.8
      }))
    );
};

export const CallTriggerDashboard = () => {
  const [selectedReps, setSelectedReps] = useState<string[]>([]);
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);
  const [isCallsActive, setIsCallsActive] = useState(false);
  const [currentAgent, setCurrentAgent] = useState("");
  const [dataSource, setDataSource] = useState<'configured' | 'manual'>('configured');
  const [recoveryRate, setRecoveryRate] = useState(85);
  const { toast } = useToast();

  // Calculate metrics
  const absentCount = mockSalesReps.length;
  const totalRevenue = mockSalesReps.reduce((sum, rep) => sum + rep.estimatedValue, 0);
  
  // Generate outlets for selected reps
  const outlets = generateOutlets(mockSalesReps, selectedReps);
  const validOutlets = outlets.filter(outlet => !outlet.excluded);
  const excludedOutlets = outlets.filter(outlet => outlet.excluded);
  
  // Calculate summary metrics
  const selectedOutletsCount = selectedOutlets.length;
  const estimatedCost = selectedOutletsCount * 2.5; // ₹2.5 per call
  const dialLaunchETA = "30 sec";
  const operationFinishETA = selectedOutletsCount > 0 ? `${Math.ceil(selectedOutletsCount / 2)} min` : "0 min";

  const handleLaunch = () => {
    if (selectedOutletsCount === 0) {
      toast({
        title: "No Outlets Selected",
        description: "Please select at least one outlet to start calls.",
        variant: "destructive",
      });
      return;
    }

    setCurrentAgent("Hindi Sales Agent");
    setIsCallsActive(true);

    toast({
      title: "Campaign Launched",
      description: `Started calling ${selectedOutletsCount} outlets.`,
    });
  };

  const handleStop = () => {
    setIsCallsActive(false);
    toast({
      title: "Campaign Stopped",
      description: "All active calls have been terminated.",
      variant: "destructive",
    });
  };

  const handleSimulate = () => {
    toast({
      title: "Simulation Started",
      description: "Running 5 test calls to validate setup.",
    });
  };

  const handleExport = () => {
    toast({
      title: "List Exported",
      description: "Outlet list has been exported to CSV.",
    });
  };

  const handleShowExcluded = () => {
    toast({
      title: "Excluded Outlets",
      description: `${excludedOutlets.length} outlets are excluded from the campaign.`,
    });
  };

  if (isCallsActive) {
    return (
      <LaunchProgressScreen
        isActive={isCallsActive}
        totalCalls={selectedOutletsCount}
        currentAgent={currentAgent}
        onStop={handleStop}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Call Setup — Absent Reps
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Launch AI calls to outlets for absent sales representatives and recover lost business
          </p>
        </div>

        <KPICards
          absentCount={absentCount}
          totalRevenue={totalRevenue}
          onRecoveryRateChange={setRecoveryRate}
        />

        <SourceSection
          onDataSource={setDataSource}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-6">
            <AbsentRepsTable
              salesReps={mockSalesReps}
              selectedReps={selectedReps}
              onSelectionChange={setSelectedReps}
            />

            <OutletsTable
              outlets={outlets}
              selectedOutlets={selectedOutlets}
              onSelectionChange={setSelectedOutlets}
            />
          </div>

          <div className="xl:col-span-1">
            <CallSettingsPanel />
          </div>
        </div>
      </div>

      <SummaryBar
        selectedOutlets={selectedOutletsCount}
        excludedOutlets={excludedOutlets.length}
        estimatedCost={estimatedCost}
        dialLaunchETA={dialLaunchETA}
        operationFinishETA={operationFinishETA}
        onLaunch={handleLaunch}
        onSimulate={handleSimulate}
        onExport={handleExport}
        onShowExcluded={handleShowExcluded}
      />
    </div>
  );
};