import { useState } from "react";
import { KPICards } from "./KPICards";
import { SourceSection } from "./SourceSection";
import { AbsentRepsTable } from "./AbsentRepsTable";
import { CombinedOutletsTable } from "./CombinedOutletsTable";
import { CallSettingsPanel } from "./CallSettingsPanel";
import { SummaryBar } from "./SummaryBar";
import { LaunchProgressScreen } from "./LaunchProgressScreen";
import { useToast } from "@/hooks/use-toast";
import salescodeLogoSvg from "@/assets/salescode-logo.svg";

// Mock data for demonstration
const mockSalesReps = [
  {
    id: "1",
    name: "Rajesh Kumar",
    territory: "North Delhi",
    todayOutlets: 5,
    estimatedValue: 25000,
    pjpToday: [
      { outlet: "Metro Store", phone: "+91 8855977815", time: "09:00", location: "Connaught Place", expectedValue: 5000, status: "missed" as const },
      { outlet: "Big Bazaar", phone: "+91 9123456789", time: "11:30", location: "Karol Bagh", expectedValue: 7500, status: "pending" as const },
      { outlet: "Reliance Fresh", phone: "+91 7890123456", time: "14:00", location: "Lajpat Nagar", expectedValue: 4500, status: "pending" as const },
      { outlet: "Spencer's", phone: "+91 9876543210", time: "16:30", location: "CP Market", expectedValue: 3000, status: "pending" as const },
      { outlet: "More Supermarket", phone: "+91 8765432109", time: "18:00", location: "Khan Market", expectedValue: 5000, status: "pending" as const },
    ]
  },
  {
    id: "2",
    name: "Priya Sharma",
    territory: "South Mumbai",
    todayOutlets: 4,
    estimatedValue: 18000,
    pjpToday: [
      { outlet: "D-Mart", phone: "+91 9988776655", time: "10:00", location: "Bandra West", expectedValue: 6000, status: "missed" as const },
      { outlet: "Hypercity", phone: "+91 8877665544", time: "13:00", location: "Malad", expectedValue: 4500, status: "pending" as const },
      { outlet: "Nature's Basket", phone: "+91 7766554433", time: "15:30", location: "Juhu", expectedValue: 3500, status: "pending" as const },
      { outlet: "Foodworld", phone: "+91 9876541230", time: "17:00", location: "Andheri", expectedValue: 4000, status: "pending" as const },
    ]
  },
  {
    id: "3",
    name: "Amit Singh",
    territory: "East Bangalore", 
    todayOutlets: 4,
    estimatedValue: 22000,
    pjpToday: [
      { outlet: "Fresh@", phone: "+91 9123987654", time: "09:30", location: "Whitefield", expectedValue: 5500, status: "pending" as const },
      { outlet: "Total Mall", phone: "+91 8234567890", time: "12:00", location: "Sarjapur Road", expectedValue: 6000, status: "pending" as const },
      { outlet: "Forum Mall", phone: "+91 7345678901", time: "15:00", location: "Koramangala", expectedValue: 5000, status: "pending" as const },
      { outlet: "Mantri Square", phone: "+91 9456789012", time: "17:30", location: "Malleshwaram", expectedValue: 5500, status: "pending" as const },
    ]
  }
];

// Generate mock outlets from sales reps - both in PJP and not in PJP
const generateInPJPOutlets = (salesReps: any[], selectedReps: string[]) => {
  return salesReps
    .filter(rep => selectedReps.includes(rep.id))
    .flatMap(rep => 
      rep.pjpToday.map((outlet: any, index: number) => ({
        id: `${rep.id}-${index}`,
        name: outlet.outlet,
        phones: [outlet.phone],
        timeWindow: `${outlet.time}-${(parseInt(outlet.time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
        expectedValue: outlet.expectedValue,
        language: ['hindi', 'english', 'telugu'][Math.floor(Math.random() * 3)],
        whatsappOptIn: Math.random() > 0.3,
        lastOrder: `${Math.floor(Math.random() * 30) + 1} days ago`,
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        repId: rep.id,
        notInPJP: false // These are in PJP
      }))
    );
};

const generateNotInPJPOutlets = (salesReps: any[], selectedReps: string[]) => {
  const additionalOutlets = [
    { outlet: "Local Grocery", phone: "+91 9876543201", expectedValue: 2000, priority: "medium" },
    { outlet: "Corner Shop", phone: "+91 8765432198", expectedValue: 1500, priority: "low" },
    { outlet: "Mini Mart", phone: "+91 7654321987", expectedValue: 3000, priority: "high" },
    { outlet: "Quick Store", phone: "+91 6543210876", expectedValue: 2500, priority: "medium" },
  ];

  return salesReps
    .filter(rep => selectedReps.includes(rep.id))
    .flatMap((rep, repIndex) => 
      additionalOutlets.slice(0, 2).map((outlet, index) => ({
        id: `notinpjp-${rep.id}-${index}`,
        name: `${outlet.outlet} ${repIndex + 1}`,
        phones: [outlet.phone],
        timeWindow: `${9 + index * 2}:00-${10 + index * 2}:00`,
        expectedValue: outlet.expectedValue,
        language: ['hindi', 'english', 'telugu'][Math.floor(Math.random() * 3)],
        whatsappOptIn: Math.random() > 0.5,
        lastOrder: `${Math.floor(Math.random() * 60) + 30} days ago`,
        priority: outlet.priority as 'high' | 'medium' | 'low',
        repId: rep.id,
        notInPJP: true // These are not in PJP
      }))
    );
};

export const CallTriggerDashboard = () => {
  const [selectedReps, setSelectedReps] = useState<string[]>([]);
  const [selectedInPJPOutlets, setSelectedInPJPOutlets] = useState<string[]>([]);
  const [selectedNotInPJPOutlets, setSelectedNotInPJPOutlets] = useState<string[]>([]);
  const [isCallsActive, setIsCallsActive] = useState(false);
  const [currentAgent, setCurrentAgent] = useState("");
  const [dataSource, setDataSource] = useState<'configured' | 'manual'>('configured');
  const [recoveryRate, setRecoveryRate] = useState(85);
  const { toast } = useToast();

  // Calculate metrics
  const absentCount = mockSalesReps.length;
  const totalRevenue = mockSalesReps.reduce((sum, rep) => sum + rep.estimatedValue, 0);
  
  // Generate outlets for selected reps
  const inPJPOutlets = generateInPJPOutlets(mockSalesReps, selectedReps);
  const notInPJPOutlets = generateNotInPJPOutlets(mockSalesReps, selectedReps);
  
  // Calculate summary metrics (combining both types of outlets)
  const totalSelectedOutlets = selectedInPJPOutlets.length + selectedNotInPJPOutlets.length;
  const estimatedCost = totalSelectedOutlets * 2.5; // ₹2.5 per call
  const dialLaunchETA = "30 sec";
  const operationFinishETA = totalSelectedOutlets > 0 ? `${Math.ceil(totalSelectedOutlets / 2)} min` : "0 min";

  const handleLaunch = () => {
    if (totalSelectedOutlets === 0) {
      toast({
        title: "No Outlets Selected",
        description: "Please select at least one outlet to start calls.",
        variant: "destructive",
      });
      return;
    }

    setCurrentAgent("Vanshika - Hindi");
    setIsCallsActive(true);

    toast({
      title: "Campaign Launched",
      description: `Started calling ${totalSelectedOutlets} outlets.`,
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


  if (isCallsActive) {
    return (
      <LaunchProgressScreen
        isActive={isCallsActive}
        totalCalls={totalSelectedOutlets}
        currentAgent={currentAgent}
        onStop={handleStop}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img 
              src={salescodeLogoSvg} 
              alt="Salescode" 
              className="h-12 w-auto"
            />
            <h1 className="text-3xl font-bold text-foreground">Sales Recovery Dashboard</h1>
          </div>
        </div>

        <KPICards
          absentCount={absentCount}
          totalRevenue={totalRevenue}
          onRecoveryRateChange={setRecoveryRate}
          onQuickAction={(action) => {
            if (action === 'ready') handleLaunch();
            else if (action === 'recoverable') {
              toast({
                title: "Recovery Optimization",
                description: "Use the slider below to adjust recovery expectations.",
              });
            }
          }}
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

            <CombinedOutletsTable
              outlets={[...inPJPOutlets, ...notInPJPOutlets]}
              selectedInPJPOutlets={selectedInPJPOutlets}
              selectedNotInPJPOutlets={selectedNotInPJPOutlets}
              onInPJPSelectionChange={setSelectedInPJPOutlets}
              onNotInPJPSelectionChange={setSelectedNotInPJPOutlets}
            />
          </div>

          <div className="xl:col-span-1">
            <CallSettingsPanel />
          </div>
        </div>
      </div>

      <SummaryBar
        selectedOutlets={totalSelectedOutlets}
        estimatedCost={estimatedCost}
        dialLaunchETA={dialLaunchETA}
        operationFinishETA={operationFinishETA}
        onLaunch={handleLaunch}
        onSimulate={handleSimulate}
        onExport={handleExport}
      />
    </div>
  );
};