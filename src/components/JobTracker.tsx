import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, Briefcase, Building2, MapPin, Calendar, 
  DollarSign, Loader2, Trash2, Edit, ExternalLink,
  Target, Clock, CheckCircle2, XCircle
} from "lucide-react";

interface JobApplication {
  id: string;
  company_name: string;
  job_title: string;
  job_url?: string;
  job_description?: string;
  status: string;
  applied_date?: string;
  deadline?: string;
  salary_min?: number;
  salary_max?: number;
  location?: string;
  notes?: string;
  contact_name?: string;
  contact_email?: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  saved: { label: "Saved", color: "bg-muted text-muted-foreground", icon: Target },
  applied: { label: "Applied", color: "bg-blue-500/20 text-blue-500", icon: Clock },
  interviewing: { label: "Interviewing", color: "bg-yellow-500/20 text-yellow-500", icon: Calendar },
  offer: { label: "Offer", color: "bg-green-500/20 text-green-500", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-500", icon: XCircle },
  withdrawn: { label: "Withdrawn", color: "bg-gray-500/20 text-gray-500", icon: XCircle },
};

export const JobTracker = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    company_name: "",
    job_title: "",
    job_url: "",
    job_description: "",
    status: "saved",
    applied_date: "",
    deadline: "",
    salary_min: "",
    salary_max: "",
    location: "",
    notes: "",
    contact_name: "",
    contact_email: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load job applications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      job_title: "",
      job_url: "",
      job_description: "",
      status: "saved",
      applied_date: "",
      deadline: "",
      salary_min: "",
      salary_max: "",
      location: "",
      notes: "",
      contact_name: "",
      contact_email: "",
    });
    setEditingJob(null);
  };

  const handleEdit = (job: JobApplication) => {
    setEditingJob(job);
    setFormData({
      company_name: job.company_name,
      job_title: job.job_title,
      job_url: job.job_url || "",
      job_description: job.job_description || "",
      status: job.status,
      applied_date: job.applied_date || "",
      deadline: job.deadline || "",
      salary_min: job.salary_min?.toString() || "",
      salary_max: job.salary_max?.toString() || "",
      location: job.location || "",
      notes: job.notes || "",
      contact_name: job.contact_name || "",
      contact_email: job.contact_email || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.company_name || !formData.job_title) {
      toast({
        title: "Required fields",
        description: "Company name and job title are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const jobData = {
        user_id: user.id,
        company_name: formData.company_name,
        job_title: formData.job_title,
        job_url: formData.job_url || null,
        job_description: formData.job_description || null,
        status: formData.status,
        applied_date: formData.applied_date || null,
        deadline: formData.deadline || null,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        location: formData.location || null,
        notes: formData.notes || null,
        contact_name: formData.contact_name || null,
        contact_email: formData.contact_email || null,
      };

      if (editingJob) {
        const { error } = await supabase
          .from('job_applications')
          .update(jobData)
          .eq('id', editingJob.id);
        if (error) throw error;
        toast({ title: "Job updated!" });
      } else {
        const { error } = await supabase
          .from('job_applications')
          .insert(jobData);
        if (error) throw error;
        toast({ title: "Job added!" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchApplications();
    } catch (error: any) {
      console.error('Error saving job:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save job.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Job deleted" });
      fetchApplications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete job.",
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      fetchApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = filter === "all" 
    ? applications 
    : applications.filter(app => app.status === filter);

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    interviewing: applications.filter(a => a.status === 'interviewing').length,
    offers: applications.filter(a => a.status === 'offer').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-500">{stats.applied}</div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-500">{stats.interviewing}</div>
            <div className="text-sm text-muted-foreground">Interviewing</div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-500">{stats.offers}</div>
            <div className="text-sm text-muted-foreground">Offers</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit Job" : "Add New Job"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name *</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Google"
                  />
                </div>
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    placeholder="Senior Software Engineer"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <Label>Job URL</Label>
                <Input
                  value={formData.job_url}
                  onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Applied Date</Label>
                  <Input
                    type="date"
                    value={formData.applied_date}
                    onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Salary Min</Label>
                  <Input
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                    placeholder="80000"
                  />
                </div>
                <div>
                  <Label>Salary Max</Label>
                  <Input
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                    placeholder="120000"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Contact Name</Label>
                  <Input
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="recruiter@company.com"
                  />
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Interview notes, follow-up reminders..."
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingJob ? "Update Job" : "Add Job"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Job List */}
      {filteredApplications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No job applications yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start tracking your job applications to stay organized
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((job) => {
            const status = STATUS_CONFIG[job.status] || STATUS_CONFIG.saved;
            const StatusIcon = status.icon;
            
            return (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-4 items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{job.job_title}</h3>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {job.company_name}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                        )}
                        {(job.salary_min || job.salary_max) && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary_min && job.salary_max 
                              ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                              : job.salary_min?.toLocaleString() || job.salary_max?.toLocaleString()
                            }
                          </span>
                        )}
                        {job.applied_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Applied: {new Date(job.applied_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select 
                        value={job.status} 
                        onValueChange={(v) => updateStatus(job.id, v)}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {job.job_url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={job.job_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(job.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
