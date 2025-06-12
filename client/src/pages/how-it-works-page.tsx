import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Users, 
  Clock, 
  Sparkles, 
  Kanban, 
  BadgeCheck, 
  MessageSquare, 
  ListChecks, 
  PenLine,
  ArrowRight,
  Bot,
  Zap,
  GitBranch,
  Video,
  FileText,
  Settings,
  CreditCard,
  Shield
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              How FounderSocials Works
            </h1>
            <p className="text-xl text-neutral-dark max-w-3xl mx-auto mb-8">
              A comprehensive guide to understanding how our AI-powered social platform connects founders, enhances collaboration, and accelerates project development
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button className="rounded-full px-8 py-6 text-lg font-semibold">
                  Get Started Today
                </Button>
              </Link>
              <a href="#platform-overview">
                <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold border-primary text-primary">
                  Explore Platform
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Platform Overview */}
        <section id="platform-overview" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Overview</h2>
            
            <div className="max-w-4xl mx-auto text-center mb-12">
              <p className="text-lg text-neutral-dark leading-relaxed">
                FounderSocials combines the community-driven aspects of Reddit with the professional networking of LinkedIn 
                and the publishing capabilities of Medium. Our platform is enhanced with AI-powered collaboration tools 
                that help founders connect, communicate more effectively, and build projects together.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community-Driven</h3>
                <p className="text-neutral-dark">
                  Join specialized communities around industries, technologies, and interests to connect with like-minded founders.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Enhanced</h3>
                <p className="text-neutral-dark">
                  Our AI moderates discussions, generates insights, creates process flows, and facilitates better communication.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Kanban className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Project-Focused</h3>
                <p className="text-neutral-dark">
                  Access integrated project management tools and collaborative development environments.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* User Journey Section */}
        <section className="py-16 bg-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Complete User Journey</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Registration & Payment</h3>
                    <p className="text-neutral-dark mb-4">
                      Sign up with your profile details including username, email, name, address, industry, and preferences. 
                      Choose your subscription plan and complete payment to access the platform.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-light-border">
                      <p className="text-sm text-neutral-dark">
                        <strong>Registration Flow:</strong> Profile Details → Payment → Email Confirmation → Platform Access
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Explore Communities & Posts</h3>
                    <p className="text-neutral-dark mb-4">
                      Browse and join communities relevant to your interests. View posts from community members, 
                      similar to Reddit's feed system but focused on founder collaboration and professional networking.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-light-border">
                      <p className="text-sm text-neutral-dark">
                        <strong>Community Types:</strong> Public (anyone can join), Restricted (approval required), Private (invite-only)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Create Content & Engage</h3>
                    <p className="text-neutral-dark mb-4">
                      Share posts with rich formatting options including polls, HTML content, and multimedia. 
                      Your posts can appear as blog-style articles with SEO-friendly URLs (e.g., platform.com/article-name).
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-light-border">
                      <p className="text-sm text-neutral-dark">
                        <strong>Publishing Features:</strong> Rich text editor, polls, media uploads, HTML support, blog-style URLs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Workflow Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">AI-Enhanced Comment Workflow</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 rounded-xl mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Bot className="text-primary" />
                  How Our AI Transforms Simple Comments Into Collaborative Opportunities
                </h3>
                <p className="text-neutral-dark">
                  When premium users comment, our AI doesn't just post the comment immediately. Instead, it initiates an 
                  intelligent workflow that helps clarify intentions, generate actionable insights, and create opportunities 
                  for deeper collaboration.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Comment Submission & AI Analysis</h4>
                    <p className="text-neutral-dark mb-3">
                      When you type a comment, the AI analyzes your content and asks clarifying questions about your intentions and reasoning.
                    </p>
                    <div className="bg-light p-4 rounded-lg">
                      <p className="text-sm text-neutral-dark italic">
                        "Why did you make this comment? What specific problem are you trying to solve or question are you asking?"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Idea Development & Process Flow Generation</h4>
                    <p className="text-neutral-dark mb-3">
                      Based on your response, the AI generates multiple process flow diagrams (similar to Figma or Visio) that visualize your idea or solution.
                    </p>
                    <div className="bg-light p-4 rounded-lg">
                      <p className="text-sm text-neutral-dark">
                        <strong>AI generates:</strong> 3+ visual workflows, process diagrams, or solution architectures
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Collaborative Response</h4>
                    <p className="text-neutral-dark mb-3">
                      The original post author sees your workflow suggestion and can respond through the same AI-enhanced process, creating a structured dialogue.
                    </p>
                    <div className="bg-light p-4 rounded-lg">
                      <p className="text-sm text-neutral-dark">
                        Both parties engage in AI-moderated discussions that focus on solutions and actionable outcomes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Advanced Collaboration Options</h4>
                    <p className="text-neutral-dark mb-3">
                      After initial exchanges, the AI offers enhanced collaboration features:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-light p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <GitBranch className="w-4 h-4 text-primary" />
                          <strong className="text-sm">Prototype Generation</strong>
                        </div>
                        <p className="text-sm text-neutral-dark">
                          AI creates working prototypes in a development environment (3 prompts per user)
                        </p>
                      </div>
                      <div className="bg-light p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="w-4 h-4 text-primary" />
                          <strong className="text-sm">Live Meetings</strong>
                        </div>
                        <p className="text-sm text-neutral-dark">
                          Automatic video call setup via Zoom, Teams, or Google Meet
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Project Management Integration</h4>
                    <p className="text-neutral-dark mb-3">
                      Conversations can be exported to project management tools and converted into actionable items:
                    </p>
                    <div className="bg-light p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <span className="bg-white px-2 py-1 rounded">User Stories</span>
                        <span className="bg-white px-2 py-1 rounded">Epics</span>
                        <span className="bg-white px-2 py-1 rounded">Requirements</span>
                        <span className="bg-white px-2 py-1 rounded">Backlog Items</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Subscription Plans */}
        <section className="py-16 bg-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Subscription Plans</h2>
            <p className="text-center text-neutral-dark mb-12 max-w-2xl mx-auto">
              Choose the plan that fits your collaboration needs. Each plan offers different levels of AI assistance and project management features.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white rounded-xl border border-light-border p-6 flex flex-col">
                <h3 className="text-xl font-bold mb-2">Free Plan</h3>
                <div className="text-3xl font-bold mb-4">£0 <span className="text-sm font-normal text-neutral">/month</span></div>
                <p className="text-neutral-dark mb-6">Basic community access and standard posting features.</p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Join and create communities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Create and reply to posts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Standard commenting</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>AI features</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Project management tools</span>
                  </li>
                </ul>
                
                <Link href="/auth">
                  <Button variant="outline" className="w-full rounded-full border-primary text-primary">Sign Up Free</Button>
                </Link>
              </div>
              
              {/* Standard Plan */}
              <div className="bg-white rounded-xl border-2 border-primary p-6 flex flex-col relative">
                <div className="absolute -top-4 left-0 right-0 text-center">
                  <span className="bg-primary text-white text-sm font-semibold py-1 px-4 rounded-full">Most Popular</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">Standard Plan</h3>
                <div className="text-3xl font-bold mb-4">£7 <span className="text-sm font-normal text-neutral">/month</span></div>
                <p className="text-neutral-dark mb-6">Enhanced collaboration with AI assistance and project tools.</p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Everything in Free Plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>AI-enhanced commenting (3 prompts/day)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Process flow generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>TaskFlowPro access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Collaboration with Standard/Founder users</span>
                  </li>
                </ul>
                
                <Link href="/payment">
                  <Button className="w-full rounded-full">Choose Standard</Button>
                </Link>
              </div>
              
              {/* Founder Plan */}
              <div className="bg-white rounded-xl border border-light-border p-6 flex flex-col">
                <h3 className="text-xl font-bold mb-2">Founder Plan</h3>
                <div className="text-3xl font-bold mb-4">£15 <span className="text-sm font-normal text-neutral">/month</span></div>
                <p className="text-neutral-dark mb-6">Full access to all AI features and unlimited collaboration.</p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Everything in Standard Plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Enhanced AI features (10 prompts/day)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Collaboration with all user types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Advanced project management</span>
                  </li>
                </ul>
                
                <Link href="/payment">
                  <Button variant="outline" className="w-full rounded-full border-primary text-primary">Choose Founder</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Settings & Account Management */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Account Management & Settings</h2>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Settings className="text-primary" />
                  Profile & Preferences
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Upload profile pictures and customize your display</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Configure AI comment settings (direct or workflow mode)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Manage notification preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Set collaboration preferences</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="text-primary" />
                  Subscription Management
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Upgrade or downgrade your plan anytime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>View prompt usage and reset schedules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Cancel subscription or delete account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Access TaskFlowPro integration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Founder Journey?</h2>
            <p className="text-xl text-primary-light mb-8 max-w-2xl mx-auto">
              Join FounderSocials today and start building meaningful connections with AI-enhanced collaboration tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" variant="secondary" className="rounded-full px-8 py-6 text-lg font-semibold">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/payment">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold border-white text-white hover:bg-white hover:text-primary">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}