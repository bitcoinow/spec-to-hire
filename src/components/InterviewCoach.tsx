import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageSquare, Play, Loader2, ChevronRight, ChevronLeft,
  Sparkles, Target, CheckCircle2, AlertCircle, Trophy,
  RotateCcw, Mic
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  tips: string;
  answer?: string;
  feedback?: any;
}

type SessionState = 'setup' | 'practicing' | 'review' | 'complete';

export const InterviewCoach = () => {
  const [state, setState] = useState<SessionState>('setup');
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [overallFeedback, setOverallFeedback] = useState<any>(null);
  const { toast } = useToast();

  const generateQuestions = async () => {
    if (!jobTitle.trim()) {
      toast({
        title: "Job title required",
        description: "Please enter the job title you're interviewing for.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('interview-coach', {
        body: {
          action: 'generate_questions',
          jobTitle,
          companyName,
          jobDescription,
        }
      });

      if (error) throw error;

      if (data.result) {
        setQuestions(data.result.map((q: any) => ({ ...q, answer: '', feedback: null })));
        setState('practicing');
        toast({
          title: "Questions ready!",
          description: `${data.result.length} interview questions generated. Good luck!`,
        });
      }
    } catch (error: any) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate questions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide your answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('interview-coach', {
        body: {
          action: 'evaluate_answer',
          jobTitle,
          companyName,
          question: questions[currentIndex].question,
          answer: currentAnswer,
        }
      });

      if (error) throw error;

      // Update question with answer and feedback
      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex] = {
        ...updatedQuestions[currentIndex],
        answer: currentAnswer,
        feedback: data.result,
      };
      setQuestions(updatedQuestions);
      setState('review');
    } catch (error: any) {
      console.error('Error evaluating answer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to evaluate answer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer(questions[currentIndex + 1].answer || '');
      setState('practicing');
    } else {
      generateOverallFeedback();
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentAnswer(questions[currentIndex - 1].answer || '');
      setState(questions[currentIndex - 1].feedback ? 'review' : 'practicing');
    }
  };

  const generateOverallFeedback = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('interview-coach', {
        body: {
          action: 'overall_feedback',
          jobTitle,
          companyName,
          questions: questions.map(q => ({
            question: q.question,
            answer: q.answer,
          })),
        }
      });

      if (error) throw error;
      setOverallFeedback(data.result);
      setState('complete');
    } catch (error: any) {
      console.error('Error generating overall feedback:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate overall feedback.",
        variant: "destructive",
      });
      setState('complete');
    } finally {
      setIsLoading(false);
    }
  };

  const restartSession = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setCurrentAnswer("");
    setOverallFeedback(null);
    setState('setup');
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = questions.filter(q => q.answer).length;

  // Setup State
  if (state === 'setup') {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Interview Prep Coach
          </CardTitle>
          <CardDescription>
            Practice with AI-generated interview questions and get real-time feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Job Title *</Label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          <div>
            <Label>Company Name (optional)</Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Google"
            />
          </div>
          <div>
            <Label>Job Description (optional)</Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description for more relevant questions..."
              className="min-h-[120px]"
            />
          </div>
          <Button 
            onClick={generateQuestions} 
            disabled={isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Interview Practice
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Complete State
  if (state === 'complete') {
    const readinessColors: Record<string, string> = {
      not_ready: 'bg-red-500',
      needs_practice: 'bg-yellow-500',
      almost_ready: 'bg-blue-500',
      interview_ready: 'bg-green-500',
    };

    return (
      <div className="space-y-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Session Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Analyzing your performance...</span>
              </div>
            ) : overallFeedback ? (
              <>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {overallFeedback.overallScore}/100
                  </div>
                  <Badge className={`${readinessColors[overallFeedback.readiness] || 'bg-muted'} text-white`}>
                    {overallFeedback.readiness?.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </div>

                <p className="text-center text-muted-foreground">
                  {overallFeedback.summary}
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Top Strengths
                    </h4>
                    <ul className="space-y-1">
                      {overallFeedback.topStrengths?.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-yellow-500" />
                      Areas to Improve
                    </h4>
                    <ul className="space-y-1">
                      {overallFeedback.areasToImprove?.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {overallFeedback.recommendations?.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground">→ {r}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground">
                You answered {answeredCount} of {questions.length} questions.
              </p>
            )}

            <Button onClick={restartSession} className="w-full gap-2">
              <RotateCcw className="h-4 w-4" />
              Start New Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Practice/Review State
  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-4">
        <Progress value={progress} className="flex-1" />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{currentQuestion?.type}</Badge>
            <Badge variant="secondary">{currentQuestion?.difficulty}</Badge>
          </div>
          <CardTitle className="text-lg">
            {currentQuestion?.question}
          </CardTitle>
          {state === 'practicing' && currentQuestion?.tips && (
            <CardDescription className="flex items-start gap-2 mt-2">
              <Sparkles className="h-4 w-4 mt-0.5 text-accent shrink-0" />
              <span>Tip: {currentQuestion.tips}</span>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {state === 'practicing' ? (
            <>
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here... Be specific and use examples where possible."
                className="min-h-[200px]"
              />
              <Button 
                onClick={submitAnswer}
                disabled={isLoading || !currentAnswer.trim()}
                className="w-full gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Submit Answer
                  </>
                )}
              </Button>
            </>
          ) : (
            // Review State
            <>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Your Answer:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {currentQuestion?.answer}
                </p>
              </div>

              {currentQuestion?.feedback && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-primary">
                      {currentQuestion.feedback.score}/10
                    </div>
                    <Progress value={currentQuestion.feedback.score * 10} className="flex-1" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <h5 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Strengths
                      </h5>
                      <ul className="text-sm space-y-1">
                        {currentQuestion.feedback.strengths?.map((s: string, i: number) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                      <h5 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Improvements
                      </h5>
                      <ul className="text-sm space-y-1">
                        {currentQuestion.feedback.improvements?.map((s: string, i: number) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {currentQuestion.feedback.betterAnswer && (
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <h5 className="font-medium text-primary mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Model Answer
                      </h5>
                      <p className="text-sm whitespace-pre-wrap">
                        {currentQuestion.feedback.betterAnswer}
                      </p>
                    </div>
                  )}

                  {currentQuestion.feedback.tips && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> {currentQuestion.feedback.tips}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {state === 'review' && (
          <Button onClick={nextQuestion} className="gap-2">
            {currentIndex === questions.length - 1 ? (
              <>
                <Trophy className="h-4 w-4" />
                Finish & Get Feedback
              </>
            ) : (
              <>
                Next Question
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
