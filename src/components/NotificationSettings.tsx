import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Calendar, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreferences {
  email_deadline_reminders: boolean;
  email_interview_reminders: boolean;
  reminder_days_before: number;
}

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_deadline_reminders: true,
    email_interview_reminders: true,
    reminder_days_before: 2,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setPreferences({
          email_deadline_reminders: data.email_deadline_reminders,
          email_interview_reminders: data.email_interview_reminders,
          reminder_days_before: data.reminder_days_before,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Email Notifications
        </CardTitle>
        <CardDescription>
          Configure when and how you receive email reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <Label htmlFor="deadline-reminders" className="font-medium">
                Application Deadline Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified before job application deadlines
              </p>
            </div>
          </div>
          <Switch
            id="deadline-reminders"
            checked={preferences.email_deadline_reminders}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, email_deadline_reminders: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <Label htmlFor="interview-reminders" className="font-medium">
                Interview Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified about upcoming scheduled interviews
              </p>
            </div>
          </div>
          <Switch
            id="interview-reminders"
            checked={preferences.email_interview_reminders}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, email_interview_reminders: checked }))
            }
          />
        </div>

        <div className="pt-4 border-t">
          <Label htmlFor="reminder-days" className="font-medium">
            Reminder Timing
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            How many days before an event should we notify you?
          </p>
          <Select
            value={preferences.reminder_days_before.toString()}
            onValueChange={(value) => 
              setPreferences(prev => ({ ...prev, reminder_days_before: parseInt(value) }))
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 day before</SelectItem>
              <SelectItem value="2">2 days before</SelectItem>
              <SelectItem value="3">3 days before</SelectItem>
              <SelectItem value="5">5 days before</SelectItem>
              <SelectItem value="7">1 week before</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={savePreferences} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};