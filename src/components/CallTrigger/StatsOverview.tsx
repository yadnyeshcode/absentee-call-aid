import { Card } from "@/components/ui/card";
import { TrendingDown, Users, DollarSign, Phone, AlertTriangle } from "lucide-react";

interface StatsOverviewProps {
  absentCount: number;
  businessLoss: number;
  potentialRecovery: number;
  totalSalesReps: number;
}

export const StatsOverview = ({ 
  absentCount, 
  businessLoss, 
  potentialRecovery, 
  totalSalesReps 
}: StatsOverviewProps) => {
  const stats = [
    {
      title: "Absent Sales Reps",
      value: absentCount,
      subtitle: `out of ${totalSalesReps} total`,
      icon: Users,
      gradient: "bg-gradient-warning",
      trend: "text-warning"
    },
    {
      title: "Business Loss Today",
      value: `₹${businessLoss.toLocaleString()}`,
      subtitle: "Due to absenteeism",
      icon: TrendingDown,
      gradient: "bg-gradient-destructive",
      trend: "text-destructive"
    },
    {
      title: "Potential Recovery",
      value: `₹${potentialRecovery.toLocaleString()}`,
      subtitle: "With AI agent calls",
      icon: DollarSign,
      gradient: "bg-gradient-success",
      trend: "text-success"
    },
    {
      title: "Recovery Rate",
      value: "85%",
      subtitle: "Average success rate",
      icon: Phone,
      gradient: "bg-gradient-info",
      trend: "text-info"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title}
          className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-card transition-all duration-300 hover:scale-105"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.gradient} shadow-glow`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <AlertTriangle className="h-4 w-4 text-muted-foreground opacity-50" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className={`text-3xl font-bold ${stat.trend}`}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {stat.subtitle}
              </p>
            </div>
          </div>
          
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
        </Card>
      ))}
    </div>
  );
};