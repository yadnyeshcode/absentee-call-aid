import { useState } from "react";
import { StatsOverview } from "./StatsOverview";
import { SalesRepsList } from "./SalesRepsList";
import { CallConfiguration } from "./CallConfiguration";
import { CallProgress } from "./CallProgress";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockSalesReps = [
  {
    id: "1",
    name: "Rajesh Kumar",
    territory: "North Delhi",
    assignedOutlets: 15,
    lastSeen: "2 days ago",
    phone: "+91-9876543210",
    pjpToday: [
      { outlet: "Metro Store", time: "09:00 AM", location: "Connaught Place", status: "missed" as const },
      { outlet: "Big Bazaar", time: "11:30 AM", location: "Karol Bagh", status: "pending" as const },
      { outlet: "Reliance Fresh", time: "02:00 PM", location: "Lajpat Nagar", status: "pending" as const },
      { outlet: "Spencer's", time: "04:30 PM", location: "CP Market", status: "pending" as const },
      { outlet: "More Supermarket", time: "06:00 PM", location: "Khan Market", status: "pending" as const },
    ]
  },
  {
    id: "2",
    name: "Priya Sharma",
    territory: "South Mumbai",
    assignedOutlets: 12,
    lastSeen: "1 day ago",
    phone: "+91-9876543211",
    pjpToday: [
      { outlet: "D-Mart", time: "10:00 AM", location: "Bandra West", status: "missed" as const },
      { outlet: "Hypercity", time: "01:00 PM", location: "Malad", status: "pending" as const },
      { outlet: "Nature's Basket", time: "03:30 PM", location: "Juhu", status: "pending" as const },
      { outlet: "Foodworld", time: "05:00 PM", location: "Andheri", status: "pending" as const },
    ]
  },
  {
    id: "3",
    name: "Amit Singh",
    territory: "East Bangalore",
    assignedOutlets: 18,
    lastSeen: "3 hours ago",
    phone: "+91-9876543212",
    pjpToday: [
      { outlet: "Fresh@", time: "09:30 AM", location: "Whitefield", status: "pending" as const },
      { outlet: "Total Mall", time: "12:00 PM", location: "Sarjapur Road", status: "pending" as const },
      { outlet: "Forum Mall", time: "03:00 PM", location: "Koramangala", status: "pending" as const },
      { outlet: "Mantri Square", time: "05:30 PM", location: "Malleshwaram", status: "pending" as const },
    ]
  }
];

export const CallTriggerDashboard = () => {
  const [selectedReps, setSelectedReps] = useState<string[]>([]);
  const [isCallsActive, setIsCallsActive] = useState(false);
  const [callProgress, setCallProgress] = useState({
    totalCalls: 0,
    completedCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    estimatedTimeRemaining: 0
  });
  const [currentAgent, setCurrentAgent] = useState("");
  const { toast } = useToast();

  // Calculate metrics
  const totalSalesReps = 45; // Mock total
  const absentCount = mockSalesReps.length;
  const businessLoss = 125000; // Daily loss in INR
  const potentialRecovery = Math.round(businessLoss * 0.85); // 85% recovery rate

  // Calculate total outlets for selected reps
  const selectedOutlets = mockSalesReps
    .filter(rep => selectedReps.includes(rep.id))
    .reduce((total, rep) => total + rep.pjpToday.length, 0);

  const handleStartCalls = (config: any) => {
    if (selectedOutlets === 0) {
      toast({
        title: "No Outlets Selected",
        description: "Please select at least one sales representative to start calls.",
        variant: "destructive",
      });
      return;
    }

    setCurrentAgent(config.agent.name);
    setCallProgress({
      totalCalls: selectedOutlets,
      completedCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      estimatedTimeRemaining: Math.ceil(selectedOutlets / 2) // Assuming 2 CPS
    });
    setIsCallsActive(true);

    toast({
      title: "AI Calls Initiated",
      description: `Started calling ${selectedOutlets} outlets with ${config.agent.name.split(' - ')[0]} agent.`,
    });

    // Simulate call progress
    let completed = 0;
    let successful = 0;
    let failed = 0;
    
    const progressInterval = setInterval(() => {
      if (completed < selectedOutlets) {
        completed += Math.floor(Math.random() * 3) + 1;
        const newSuccessful = Math.floor(completed * 0.85);
        const newFailed = completed - newSuccessful;
        
        successful = Math.min(newSuccessful, selectedOutlets);
        failed = Math.min(newFailed, selectedOutlets);
        completed = Math.min(completed, selectedOutlets);
        
        setCallProgress(prev => ({
          ...prev,
          completedCalls: completed,
          successfulCalls: successful,
          failedCalls: failed,
          estimatedTimeRemaining: Math.max(0, Math.ceil((selectedOutlets - completed) / 2))
        }));
        
        if (completed >= selectedOutlets) {
          clearInterval(progressInterval);
          toast({
            title: "Calls Completed",
            description: `Successfully completed ${successful}/${selectedOutlets} calls with ${((successful/selectedOutlets) * 100).toFixed(1)}% success rate.`,
          });
        }
      }
    }, 2000);
  };

  const handleStopCalls = () => {
    setIsCallsActive(false);
    toast({
      title: "Calls Stopped",
      description: "All active calls have been terminated.",
      variant: "destructive",
    });
  };

  const handleUploadData = () => {
    toast({
      title: "Upload Data",
      description: "File upload functionality will be implemented here.",
    });
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Download Template",
      description: "CSV template downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            AI Sales Agent Call Trigger
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recover lost business by automatically calling outlets where sales representatives are absent. 
            Our AI agents will take orders and maintain customer relationships.
          </p>
        </div>

        <StatsOverview
          absentCount={absentCount}
          businessLoss={businessLoss}
          potentialRecovery={potentialRecovery}
          totalSalesReps={totalSalesReps}
        />

        <SalesRepsList
          salesReps={mockSalesReps}
          selectedReps={selectedReps}
          onSelectionChange={setSelectedReps}
          onUploadData={handleUploadData}
          onDownloadTemplate={handleDownloadTemplate}
        />

        <CallConfiguration
          onStartCalls={handleStartCalls}
          selectedOutlets={selectedOutlets}
          isLoading={false}
        />

        <CallProgress
          isActive={isCallsActive}
          totalCalls={callProgress.totalCalls}
          completedCalls={callProgress.completedCalls}
          successfulCalls={callProgress.successfulCalls}
          failedCalls={callProgress.failedCalls}
          currentAgent={currentAgent}
          estimatedTimeRemaining={callProgress.estimatedTimeRemaining}
          onStop={handleStopCalls}
        />
      </div>
    </div>
  );
};