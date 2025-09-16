import { 
  UserX, 
  CreditCard, 
  Rocket, 
  ShoppingCart, 
  MessageSquare, 
  Package, 
  Megaphone,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const callTriggerScenarios = [
  { 
    title: "Absentism", 
    url: "/", 
    icon: UserX, 
    description: "Track and follow up on absent sales reps",
    status: "active"
  },
  { 
    title: "Payment Reminder", 
    url: "/payment-reminder", 
    icon: CreditCard, 
    description: "Remind customers about pending payments",
    status: "coming-soon"
  },
  { 
    title: "New Product Launch", 
    url: "/product-launch", 
    icon: Rocket, 
    description: "Announce new products to outlets",
    status: "coming-soon"
  },
  { 
    title: "Order Follow-up", 
    url: "/order-followup", 
    icon: ShoppingCart, 
    description: "Follow up on pending orders",
    status: "coming-soon"
  },
  { 
    title: "Customer Feedback", 
    url: "/customer-feedback", 
    icon: MessageSquare, 
    description: "Collect customer feedback and reviews",
    status: "coming-soon"
  },
  { 
    title: "Inventory Update", 
    url: "/inventory-update", 
    icon: Package, 
    description: "Notify about stock availability",
    status: "coming-soon"
  },
  { 
    title: "Promotional Campaign", 
    url: "/promotional-campaign", 
    icon: Megaphone, 
    description: "Launch promotional campaigns",
    status: "coming-soon"
  },
  { 
    title: "Appointment Reminder", 
    url: "/appointment-reminder", 
    icon: Calendar, 
    description: "Remind about scheduled appointments",
    status: "coming-soon"
  }
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-80"}
      collapsible="icon"
    >
      <SidebarContent className="bg-background border-r">
        <div className="p-6 border-b">
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors group"
            onClick={toggleSidebar}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Megaphone className="h-6 w-6 text-primary" />
              </div>
              {!collapsed && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Call Triggers</h2>
                  <p className="text-sm text-muted-foreground">AI-Powered Communication</p>
                </div>
              )}
            </div>
            {!collapsed && (
              <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
            {collapsed && (
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors absolute right-2" />
            )}
          </div>
        </div>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2"}>
            Scenarios
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {callTriggerScenarios.map((scenario) => (
                <SidebarMenuItem key={scenario.title}>
                  <SidebarMenuButton asChild className="h-auto p-0">
                    <NavLink 
                      to={scenario.url} 
                      end 
                      className={`${getNavCls({ isActive: isActive(scenario.url) })} p-3 rounded-lg transition-all duration-200 ${scenario.status === 'coming-soon' ? 'opacity-60 cursor-not-allowed' : ''}`}
                      onClick={(e) => {
                        if (scenario.status === 'coming-soon') {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <scenario.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm truncate">{scenario.title}</span>
                              {scenario.status === 'active' && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                                  Active
                                </Badge>
                              )}
                              {scenario.status === 'coming-soon' && (
                                <Badge variant="outline" className="text-xs">
                                  Soon
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {scenario.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}