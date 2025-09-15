import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StepGuidanceProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Data Source", description: "Configure your data source" },
  { number: 2, title: "Sales Rep", description: "Select sales representatives" },
  { number: 3, title: "Outlets", description: "Choose outlets to call" },
];

export const StepGuidance = ({ currentStep }: StepGuidanceProps) => {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Setup Guide</h2>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep > step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.number
                    ? "border-primary text-primary bg-background"
                    : "border-muted-foreground text-muted-foreground bg-background"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.number + 1
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};