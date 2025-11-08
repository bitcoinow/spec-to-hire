import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2 } from "lucide-react";

export const BlogAutomationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    frequency: 'weekly',
    auto_publish: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_automation_settings')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          enabled: data.enabled,
          frequency: data.frequency,
          auto_publish: data.auto_publish,
        });
      }
    } catch (error: any) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('blog_automation_settings')
        .update(settings)
        .eq('id', (await supabase.from('blog_automation_settings').select('id').single()).data?.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Automation settings updated successfully",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Automation Settings
        </CardTitle>
        <CardDescription>Configure automatic blog generation and posting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enabled">Enable Automation</Label>
            <p className="text-sm text-muted-foreground">
              Automatically generate blog posts
            </p>
          </div>
          <Switch
            id="enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Generation Frequency</Label>
          <Select
            value={settings.frequency}
            onValueChange={(value) => setSettings({ ...settings, frequency: value })}
          >
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto_publish">Auto-Publish</Label>
            <p className="text-sm text-muted-foreground">
              Publish generated posts immediately
            </p>
          </div>
          <Switch
            id="auto_publish"
            checked={settings.auto_publish}
            onCheckedChange={(checked) => setSettings({ ...settings, auto_publish: checked })}
          />
        </div>

        <Button onClick={saveSettings} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
