import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, FileText, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SourceSectionProps {
  onDataSource?: (source: 'configured' | 'manual') => void;
  onFiltersChange?: (filters: any) => void;
}

export const SourceSection = ({ onDataSource, onFiltersChange }: SourceSectionProps) => {
  const [activeTab, setActiveTab] = useState("configured");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [showMapping, setShowMapping] = useState(false);
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onDataSource?.(value as 'configured' | 'manual');
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template Downloaded",
      description: "CSV template for sales rep data has been downloaded.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setShowMapping(true);
      // Simulate validation
      setTimeout(() => {
        setValidationResults({
          total: 150,
          valid: 142,
          errors: 8,
          warnings: 12,
          issues: [
            { type: 'error', field: 'phone', count: 5, message: 'Invalid phone numbers' },
            { type: 'error', field: 'time', count: 3, message: 'Invalid time format' },
            { type: 'warning', field: 'outlet', count: 12, message: 'Missing outlet names' }
          ]
        });
      }, 1000);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange?.({ [key]: value });
  };

  return (
    <Card className="bg-card border-border/50 shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Data Source</h2>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="configured" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Configured Data
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Manual Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configured" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Region</label>
                <Select onValueChange={(value) => handleFilterChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    <SelectItem value="north">North India</SelectItem>
                    <SelectItem value="south">South India</SelectItem>
                    <SelectItem value="west">West India</SelectItem>
                    <SelectItem value="east">East India</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Team</label>
                <Select onValueChange={(value) => handleFilterChange('team', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All teams</SelectItem>
                    <SelectItem value="metro">Metro</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Language</label>
                <Select onValueChange={(value) => handleFilterChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleDownloadTemplate} className="h-auto p-6 flex-col gap-3">
                <Download className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <div className="font-medium">Download Template</div>
                  <div className="text-sm text-muted-foreground">CSV format with sample data</div>
                </div>
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full h-auto p-6 flex-col gap-3">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <div className="font-medium">Upload File</div>
                    <div className="text-sm text-muted-foreground">CSV or Excel format</div>
                  </div>
                </Button>
              </div>
            </div>

            {uploadedFile && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>

                {showMapping && (
                  <Card className="bg-muted/30 border-border/30">
                    <div className="p-4">
                      <h4 className="font-medium mb-3">Column Mapping</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">CSV Column</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Maps to</span>
                        </div>
                        <div>Rep Name</div><div>name ✓</div>
                        <div>Territory</div><div>territory ✓</div>
                        <div>Phone</div><div>phone ✓</div>
                        <div>Outlets</div><div>outlets ✓</div>
                      </div>
                    </div>
                  </Card>
                )}

                {validationResults && (
                  <Card className="border-border/50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Validation Results</h4>
                        <Button variant="ghost" size="sm" onClick={() => setValidationResults(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success">{validationResults.valid}</div>
                          <div className="text-sm text-muted-foreground">Valid rows</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-destructive">{validationResults.errors}</div>
                          <div className="text-sm text-muted-foreground">Errors</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-warning">{validationResults.warnings}</div>
                          <div className="text-sm text-muted-foreground">Warnings</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {validationResults.issues.map((issue: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {issue.type === 'error' ? (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-warning" />
                            )}
                            <span className="font-medium">{issue.field}:</span>
                            <span>{issue.message}</span>
                            <Badge variant="secondary" className="ml-auto">
                              {issue.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};