import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  scheduled_at: string | null;
  status: string;
  category: string;
}

interface BlogCalendarProps {
  posts: BlogPost[];
  onDateSelect: (date: Date) => void;
}

export const BlogCalendar = ({ posts, onDateSelect }: BlogCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const scheduledPosts = posts.filter(post => post.scheduled_at && post.status === 'scheduled');
  
  const postsOnSelectedDate = selectedDate
    ? scheduledPosts.filter(post => 
        post.scheduled_at && isSameDay(new Date(post.scheduled_at), selectedDate)
      )
    : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onDateSelect(date);
    }
  };

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => 
      post.scheduled_at && isSameDay(new Date(post.scheduled_at), date)
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Calendar</CardTitle>
          <CardDescription>View and manage scheduled blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              scheduled: (date) => getPostsForDate(date).length > 0,
            }}
            modifiersClassNames={{
              scheduled: "bg-primary/20 font-bold",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
          </CardTitle>
          <CardDescription>
            {postsOnSelectedDate.length > 0 
              ? `${postsOnSelectedDate.length} post${postsOnSelectedDate.length > 1 ? 's' : ''} scheduled`
              : "No posts scheduled for this date"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {postsOnSelectedDate.map(post => (
              <div key={post.id} className="p-3 border rounded-lg bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground">{post.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {post.scheduled_at && format(new Date(post.scheduled_at), "h:mm a")}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
