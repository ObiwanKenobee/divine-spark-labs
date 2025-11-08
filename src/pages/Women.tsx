import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Users, Map, BookOpen, TrendingUp, Globe, Calendar, Target, Sparkles } from "lucide-react";

const Women = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fellowship Application Form
  const [fellowshipForm, setFellowshipForm] = useState({
    applicant_name: "",
    email: "",
    why_apply: "",
    experience: "",
    goals: ""
  });

  // Journal Entry Form
  const [journalForm, setJournalForm] = useState({
    entry_type: "reflection",
    title: "",
    content: "",
    mood: "",
    tags: [] as string[],
    is_private: true
  });

  const handleFellowshipSubmit = async (fellowshipId: string) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to apply for fellowships.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from("fellowship_applications")
        .insert({
          fellowship_id: fellowshipId,
          user_id: user.id,
          ...fellowshipForm
        });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you soon."
      });

      setFellowshipForm({
        applicant_name: "",
        email: "",
        why_apply: "",
        experience: "",
        goals: ""
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJournalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create journal entries.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from("transformation_journal")
        .insert({
          user_id: user.id,
          ...journalForm
        });

      if (error) throw error;

      toast({
        title: "Journal entry saved",
        description: "Your reflection has been recorded."
      });

      setJournalForm({
        entry_type: "reflection",
        title: "",
        content: "",
        mood: "",
        tags: [],
        is_private: true
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">Mary Initiative</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Women's Empowerment Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Female-led innovation pathways, fellowships, and investment collaborations nurturing the next generation of women leaders.
          </p>
        </header>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
            <TabsTrigger value="overview" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="fellowships" className="gap-2">
              <Users className="h-4 w-4" />
              Fellowships
            </TabsTrigger>
            <TabsTrigger value="investment" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Investment
            </TabsTrigger>
            <TabsTrigger value="journal" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Journal
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <Heart className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Mary Magdalene Path</CardTitle>
                  <CardDescription>
                    Fellowships nurturing spiritual intelligence, leadership courage, and transformative product innovation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab("fellowships")} className="w-full">
                    Explore Fellowships
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Joanna Investment Collective</CardTitle>
                  <CardDescription>
                    Women-led capital syndicates backing regenerative ventures and sustainable enterprises.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab("investment")} className="w-full">
                    View Opportunities
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <Map className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Innovation Map</CardTitle>
                  <CardDescription>
                    A curated view of women pioneers, projects, and transformative initiatives across regions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Explore Map
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    To create pathways for women to lead innovation with spiritual intelligence, 
                    backed by collaborative capital and regenerative principles.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Holistic leadership development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Access to impact-driven capital</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Global network of women innovators</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Global Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary">250+</div>
                    <div className="text-sm text-muted-foreground">Women Leaders</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary">45</div>
                    <div className="text-sm text-muted-foreground">Countries</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary">$12M</div>
                    <div className="text-sm text-muted-foreground">Capital Deployed</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary">180</div>
                    <div className="text-sm text-muted-foreground">Projects Funded</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fellowships Tab */}
          <TabsContent value="fellowships" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mary Magdalene Path Fellowship</CardTitle>
                <CardDescription>
                  A transformative 6-month journey combining spiritual discernment, leadership development, 
                  and product innovation for women changemakers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Duration</div>
                      <div className="text-sm text-muted-foreground">6 months, part-time</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Cohort Size</div>
                      <div className="text-sm text-muted-foreground">20-25 fellows</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Format</div>
                      <div className="text-sm text-muted-foreground">Hybrid (online + retreats)</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Program Components</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Badge variant="outline" className="justify-start py-2">Spiritual Intelligence Workshops</Badge>
                    <Badge variant="outline" className="justify-start py-2">Leadership & Courage Building</Badge>
                    <Badge variant="outline" className="justify-start py-2">Product Innovation Labs</Badge>
                    <Badge variant="outline" className="justify-start py-2">Mentorship from Women Leaders</Badge>
                    <Badge variant="outline" className="justify-start py-2">Funding Pitch Training</Badge>
                    <Badge variant="outline" className="justify-start py-2">Global Network Access</Badge>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4">Apply for Fellowship</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Fellowship Application</DialogTitle>
                      <DialogDescription>
                        Share your journey and vision for transformative leadership.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="applicant_name">Full Name *</Label>
                        <Input
                          id="applicant_name"
                          value={fellowshipForm.applicant_name}
                          onChange={(e) => setFellowshipForm({ ...fellowshipForm, applicant_name: e.target.value })}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={fellowshipForm.email}
                          onChange={(e) => setFellowshipForm({ ...fellowshipForm, email: e.target.value })}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="why_apply">Why are you applying? *</Label>
                        <Textarea
                          id="why_apply"
                          value={fellowshipForm.why_apply}
                          onChange={(e) => setFellowshipForm({ ...fellowshipForm, why_apply: e.target.value })}
                          placeholder="Share your motivation and what draws you to this fellowship..."
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Relevant Experience</Label>
                        <Textarea
                          id="experience"
                          value={fellowshipForm.experience}
                          onChange={(e) => setFellowshipForm({ ...fellowshipForm, experience: e.target.value })}
                          placeholder="Your background in leadership, innovation, or social impact..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goals">Your Goals *</Label>
                        <Textarea
                          id="goals"
                          value={fellowshipForm.goals}
                          onChange={(e) => setFellowshipForm({ ...fellowshipForm, goals: e.target.value })}
                          placeholder="What do you hope to achieve through this fellowship?"
                          rows={3}
                        />
                      </div>
                      <Button 
                        onClick={() => handleFellowshipSubmit("example-fellowship-id")}
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Tab */}
          <TabsContent value="investment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Joanna Investment Collective</CardTitle>
                <CardDescription>
                  Women-led capital syndicates supporting regenerative ventures and sustainable enterprises.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2">Investment Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Renewable Energy</Badge>
                      <Badge>Education Tech</Badge>
                      <Badge>Healthcare Innovation</Badge>
                      <Badge>Sustainable Agriculture</Badge>
                      <Badge>Climate Solutions</Badge>
                      <Badge>Social Enterprise</Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">For Investors</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Join a collective of mission-driven investors backing women-led regenerative ventures.
                      </p>
                      <Button variant="outline" className="w-full">Join Collective</Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">For Founders</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Present your regenerative venture to our network of impact-focused investors.
                      </p>
                      <Button variant="outline" className="w-full">Submit Opportunity</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Journal Tab */}
          <TabsContent value="journal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Transformation Journaling</CardTitle>
                <CardDescription>
                  A reflective practice blending discernment prompts and project milestones to support your growth journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-primary/5 rounded-lg text-center">
                    <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Reflections</div>
                    <div className="text-sm text-muted-foreground">Daily insights</div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg text-center">
                    <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Milestones</div>
                    <div className="text-sm text-muted-foreground">Track progress</div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg text-center">
                    <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Discernment</div>
                    <div className="text-sm text-muted-foreground">Guided prompts</div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Create New Entry</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>New Journal Entry</DialogTitle>
                      <DialogDescription>
                        Record your reflections, milestones, or discernment insights.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="entry_type">Entry Type</Label>
                        <Select
                          value={journalForm.entry_type}
                          onValueChange={(value) => setJournalForm({ ...journalForm, entry_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reflection">Reflection</SelectItem>
                            <SelectItem value="milestone">Milestone</SelectItem>
                            <SelectItem value="discernment">Discernment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="journal_title">Title *</Label>
                        <Input
                          id="journal_title"
                          value={journalForm.title}
                          onChange={(e) => setJournalForm({ ...journalForm, title: e.target.value })}
                          placeholder="Give your entry a title..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          value={journalForm.content}
                          onChange={(e) => setJournalForm({ ...journalForm, content: e.target.value })}
                          placeholder="Write your thoughts, insights, or experiences..."
                          rows={6}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mood">Mood/Feeling</Label>
                        <Select
                          value={journalForm.mood}
                          onValueChange={(value) => setJournalForm({ ...journalForm, mood: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="How are you feeling?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hopeful">Hopeful</SelectItem>
                            <SelectItem value="grateful">Grateful</SelectItem>
                            <SelectItem value="challenged">Challenged</SelectItem>
                            <SelectItem value="inspired">Inspired</SelectItem>
                            <SelectItem value="reflective">Reflective</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleJournalSubmit}
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? "Saving..." : "Save Entry"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Women;