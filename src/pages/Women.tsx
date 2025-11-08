import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Sparkles, TrendingUp, Users, Globe, BookOpen, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Women = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Mary Initiative</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Women's Empowerment Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nurturing female-led innovation through spiritual intelligence, transformative leadership, and regenerative investment
          </p>
        </header>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fellowships">Fellowships</TabsTrigger>
            <TabsTrigger value="collective">Investment</TabsTrigger>
            <TabsTrigger value="pioneers">Pioneers Map</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("fellowships")}>
                <Sparkles className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mary Magdalene Path</h3>
                <p className="text-sm text-muted-foreground">
                  Fellowships nurturing spiritual intelligence, leadership courage, and purpose-driven innovation
                </p>
                <Button variant="link" className="p-0 mt-4">Explore Fellowships →</Button>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("collective")}>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Joanna Investment Collective</h3>
                <p className="text-sm text-muted-foreground">
                  Women-led capital syndicates backing regenerative ventures and sustainable innovation
                </p>
                <Button variant="link" className="p-0 mt-4">View Opportunities →</Button>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("pioneers")}>
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Innovation Map</h3>
                <p className="text-sm text-muted-foreground">
                  A curated global view of women pioneers and transformative projects across regions
                </p>
                <Button variant="link" className="p-0 mt-4">Explore Map →</Button>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("journal")}>
                <BookOpen className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Transformation Journal</h3>
                <p className="text-sm text-muted-foreground">
                  Reflective practice blending discernment prompts, milestones, and wellbeing insights
                </p>
                <Button variant="link" className="p-0 mt-4">Start Journaling →</Button>
              </Card>
            </div>

            {/* Impact Stats */}
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
              <h2 className="text-2xl font-semibold mb-6">Our Collective Impact</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Women Fellows</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">75+</div>
                  <div className="text-sm text-muted-foreground">Countries Reached</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">$12M+</div>
                  <div className="text-sm text-muted-foreground">Invested in Ventures</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">1200+</div>
                  <div className="text-sm text-muted-foreground">Journal Entries</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Fellowships Tab */}
          <TabsContent value="fellowships" className="space-y-6">
            <FellowshipsSection />
          </TabsContent>

          {/* Investment Collective Tab */}
          <TabsContent value="collective" className="space-y-6">
            <InvestmentCollectiveSection />
          </TabsContent>

          {/* Pioneers Map Tab */}
          <TabsContent value="pioneers" className="space-y-6">
            <PioneersMapSection />
          </TabsContent>

          {/* Journal Tab */}
          <TabsContent value="journal" className="space-y-6">
            <JournalSection />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

// Fellowships Section Component
const FellowshipsSection = () => {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async (fellowshipId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for fellowships.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: "Your fellowship application has been received. We'll review it shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Mary Magdalene Path Fellowships</h2>
        <p className="text-muted-foreground">
          Transformative programs nurturing spiritual intelligence, ethical leadership, and innovation courage
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Badge className="mb-4">Open for Applications</Badge>
          <h3 className="text-2xl font-semibold mb-3">Spiritual Intelligence Cohort</h3>
          <p className="text-muted-foreground mb-4">
            12-week intensive program integrating contemplative practices with design thinking and innovation frameworks.
          </p>
          <div className="space-y-2 text-sm mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Cohort Size: 20 fellows</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Duration: 12 weeks</span>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Apply Now</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Apply for Spiritual Intelligence Cohort</DialogTitle>
                <DialogDescription>
                  Tell us about yourself and why you're drawn to this fellowship.
                </DialogDescription>
              </DialogHeader>
              <FellowshipApplicationForm onSubmit={handleApply} />
            </DialogContent>
          </Dialog>
        </Card>

        <Card className="p-6">
          <Badge variant="secondary" className="mb-4">Starting Soon</Badge>
          <h3 className="text-2xl font-semibold mb-3">Product Courage Accelerator</h3>
          <p className="text-muted-foreground mb-4">
            8-week program for women founders building regenerative ventures with bold, purpose-driven products.
          </p>
          <div className="space-y-2 text-sm mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Cohort Size: 15 founders</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Duration: 8 weeks</span>
            </div>
          </div>
          <Button className="w-full" variant="outline">Join Waitlist</Button>
        </Card>
      </div>
    </div>
  );
};

// Investment Collective Section
const InvestmentCollectiveSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Joanna Investment Collective</h2>
        <p className="text-muted-foreground">
          Women-led capital syndicates backing regenerative ventures and sustainable innovation
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <h3 className="text-xl font-semibold mb-4">Active Investment Opportunities</h3>
        <div className="space-y-4">
          <InvestmentCard 
            projectName="Solar Sisters Network"
            description="Expanding clean energy access to 100,000 rural households across East Africa"
            sector="Renewable Energy"
            stage="Growth"
            goal={250000}
            raised={187500}
            founder="Amina Okonjo"
          />
          <InvestmentCard 
            projectName="Tech4Girls Academy"
            description="AI and coding bootcamps for young women in underserved communities"
            sector="Education Technology"
            stage="Seed"
            goal={150000}
            raised={98000}
            founder="Dr. Sarah Chen"
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">How the Collective Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary font-bold">1</span>
            </div>
            <h4 className="font-semibold mb-2">Curated Deal Flow</h4>
            <p className="text-sm text-muted-foreground">
              Vetted opportunities from women-led ventures aligned with regenerative principles
            </p>
          </div>
          <div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary font-bold">2</span>
            </div>
            <h4 className="font-semibold mb-2">Syndicate Pooling</h4>
            <p className="text-sm text-muted-foreground">
              Co-invest with other mission-aligned women investors and allies
            </p>
          </div>
          <div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-primary font-bold">3</span>
            </div>
            <h4 className="font-semibold mb-2">Impact Tracking</h4>
            <p className="text-sm text-muted-foreground">
              Transparent reporting on social, environmental, and financial returns
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Pioneers Map Section
const PioneersMapSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Women Pioneers Global Map</h2>
        <p className="text-muted-foreground">
          Discover and connect with women leading transformative innovation worldwide
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-muted/50 to-background">
        <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center mb-6">
          <div className="text-center space-y-3">
            <MapPin className="h-16 w-16 text-primary mx-auto" />
            <p className="text-muted-foreground">Interactive map visualization coming soon</p>
            <p className="text-sm text-muted-foreground">Showcasing 500+ pioneers across 75 countries</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <PioneerCard 
            name="Dr. Aisha Patel"
            title="Climate Tech Innovator"
            location="Nairobi, Kenya"
            focusAreas={["Carbon Capture", "Regenerative Agriculture"]}
          />
          <PioneerCard 
            name="Maria Santos"
            title="Social Enterprise Leader"
            location="São Paulo, Brazil"
            focusAreas={["Education", "Community Development"]}
          />
          <PioneerCard 
            name="Leila Yamamoto"
            title="AI Ethics Researcher"
            location="Tokyo, Japan"
            focusAreas={["Responsible AI", "Digital Rights"]}
          />
        </div>
      </Card>
    </div>
  );
};

// Journal Section
const JournalSection = () => {
  const [entries, setEntries] = useState<any[]>([]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Personal Transformation Journal</h2>
          <p className="text-muted-foreground">
            Reflective practice blending discernment prompts and project milestones
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Journal Entry</DialogTitle>
            </DialogHeader>
            <JournalEntryForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">24</div>
          <div className="text-sm text-muted-foreground">Total Entries</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">12</div>
          <div className="text-sm text-muted-foreground">Milestones</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">8</div>
          <div className="text-sm text-muted-foreground">Reflections</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Entries</h3>
        <p className="text-muted-foreground text-sm">Sign in to view and create journal entries.</p>
      </Card>
    </div>
  );
};

// Helper Components
const FellowshipApplicationForm = ({ onSubmit }: { onSubmit: (id: string) => void }) => (
  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit("fellowship-1"); }}>
    <div>
      <Label>Full Name</Label>
      <Input placeholder="Your name" required />
    </div>
    <div>
      <Label>Email</Label>
      <Input type="email" placeholder="your@email.com" required />
    </div>
    <div>
      <Label>Why are you applying?</Label>
      <Textarea placeholder="Share your motivation..." rows={4} required />
    </div>
    <div>
      <Label>Relevant Experience</Label>
      <Textarea placeholder="Tell us about your background..." rows={3} />
    </div>
    <div>
      <Label>Your Goals</Label>
      <Textarea placeholder="What do you hope to achieve..." rows={3} />
    </div>
    <Button type="submit" className="w-full">Submit Application</Button>
  </form>
);

const InvestmentCard = ({ projectName, description, sector, stage, goal, raised, founder }: any) => (
  <Card className="p-4">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-semibold text-lg">{projectName}</h4>
        <p className="text-sm text-muted-foreground">Founded by {founder}</p>
      </div>
      <Badge>{stage}</Badge>
    </div>
    <p className="text-sm mb-3">{description}</p>
    <div className="flex items-center gap-2 mb-3">
      <Badge variant="outline">{sector}</Badge>
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Raised</span>
        <span className="font-semibold">${(raised / 1000).toFixed(0)}K of ${(goal / 1000).toFixed(0)}K</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${(raised / goal) * 100}%` }} />
      </div>
    </div>
    <Button className="w-full mt-4" variant="outline">Learn More</Button>
  </Card>
);

const PioneerCard = ({ name, title, location, focusAreas }: any) => (
  <Card className="p-4">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Heart className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
      <MapPin className="h-4 w-4" />
      <span>{location}</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {focusAreas.map((area: string, i: number) => (
        <Badge key={i} variant="secondary" className="text-xs">{area}</Badge>
      ))}
    </div>
  </Card>
);

const JournalEntryForm = () => {
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create journal entries.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Entry Saved",
      description: "Your journal entry has been saved successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Entry Type</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reflection">Reflection</SelectItem>
            <SelectItem value="milestone">Milestone</SelectItem>
            <SelectItem value="discernment">Discernment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Title</Label>
        <Input placeholder="Entry title" required />
      </div>
      <div>
        <Label>Content</Label>
        <Textarea placeholder="Write your thoughts..." rows={6} required />
      </div>
      <div>
        <Label>Mood (optional)</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="How are you feeling?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hopeful">Hopeful</SelectItem>
            <SelectItem value="grateful">Grateful</SelectItem>
            <SelectItem value="challenged">Challenged</SelectItem>
            <SelectItem value="inspired">Inspired</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Save Entry</Button>
    </form>
  );
};

export default Women;
