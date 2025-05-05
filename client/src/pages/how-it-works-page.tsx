import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Clock, Sparkles, Kanban, BadgeCheck, MessageSquare, ListChecks, PenLine } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Connect, Collaborate, Create
            </h1>
            <p className="text-xl text-neutral-dark max-w-3xl mx-auto mb-8">
              FounderSocials is where founders meet, share ideas, and build amazing projects together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button className="rounded-full px-8 py-6 text-lg font-semibold">
                  Join the Community
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold border-primary text-primary">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </section>
        
        {/* Key Benefits Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Benefits for Founders</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl border border-light-border shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <BadgeCheck className="text-primary w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Build Founder Trust</h3>
                <p className="text-neutral-dark">
                  Verify skills and establish trust through shared discussions, communities, and collaborative projects.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-light-border shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Clock className="text-primary w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Reduce Time to Launch</h3>
                <p className="text-neutral-dark">
                  Quickly understand requirements and start working together with our AI-assisted communication tools.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-light-border shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="text-primary w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Powered Collaboration</h3>
                <p className="text-neutral-dark">
                  Use our AI tools to improve idea sharing, generate process flows, and analyze project requirements.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-light-border shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Kanban className="text-primary w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Project Management</h3>
                <p className="text-neutral-dark">
                  Access built-in project management tools to track progress, assign tasks, and manage deadlines.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How FounderSocials Works</h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Join Communities</h3>
                      <p className="text-neutral-dark">
                        Find and join communities relevant to your interests, skills, or the types of projects you want to build.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Engage in Discussions</h3>
                      <p className="text-neutral-dark">
                        Participate in posts and comments to share knowledge, ask questions, and connect with like-minded founders.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Collaborate with AI</h3>
                      <p className="text-neutral-dark">
                        Use our AI tools to facilitate deeper discussions, generate ideas, and create project workflows.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Build Projects Together</h3>
                      <p className="text-neutral-dark">
                        Start collaborative projects with temporary development environments that let you work directly with other founders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-light-border shadow-md">
                <div className="aspect-video bg-light-darker rounded-lg mb-6 flex items-center justify-center">
                  <svg className="w-16 h-16 text-neutral" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">See FounderSocials in Action</h3>
                <p className="text-neutral-dark mb-4">
                  Watch how our platform helps founders connect, communicate, and collaborate efficiently.
                </p>
                <Button className="w-full rounded-full">Watch Demo</Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 border border-light-border rounded-xl">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Community Building</h3>
                <p className="text-neutral-dark">
                  Create and join communities around specific interests, technologies, or industries to find the right connections.
                </p>
              </div>
              
              <div className="p-6 border border-light-border rounded-xl">
                <MessageSquare className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">AI-Enhanced Discussions</h3>
                <p className="text-neutral-dark">
                  Our AI helps moderate discussions, generates insights from conversations, and facilitates clearer communication.
                </p>
              </div>
              
              <div className="p-6 border border-light-border rounded-xl">
                <PenLine className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Collaborative Editor</h3>
                <p className="text-neutral-dark">
                  Work together in real-time on documents, code, and project plans in a secure, shared environment.
                </p>
              </div>
              
              <div className="p-6 border border-light-border rounded-xl">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">AI Workflow Generation</h3>
                <p className="text-neutral-dark">
                  Convert ideas into actionable workflows with our AI-powered project planning tools.
                </p>
              </div>
              
              <div className="p-6 border border-light-border rounded-xl">
                <ListChecks className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Project Management</h3>
                <p className="text-neutral-dark">
                  Track tasks, milestones, and deadlines with built-in project management features.
                </p>
              </div>
              
              <div className="p-6 border border-light-border rounded-xl">
                <BadgeCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Reputation System</h3>
                <p className="text-neutral-dark">
                  Build your professional reputation through contributions, collaborations, and community engagement.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Subscription Plans */}
        <section className="py-16 bg-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Choose Your Plan</h2>
            <p className="text-center text-neutral-dark mb-12 max-w-2xl mx-auto">
              Select the plan that best fits your needs. All plans include access to communities and basic posting features.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white rounded-xl border border-light-border p-6 flex flex-col">
                <h3 className="text-xl font-bold mb-2">Free Plan</h3>
                <div className="text-3xl font-bold mb-4">£0 <span className="text-sm font-normal text-neutral">/month</span></div>
                <p className="text-neutral-dark mb-6">Basic access to communities and standard posting features.</p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Join communities</span>
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
                    <span>Collaborative environments</span>
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
                <p className="text-neutral-dark mb-6">Enhanced access with essential AI features.</p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>All Free Plan features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Basic AI-assisted comments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>3-day access to collaborative environments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Limited AI workflows (3 prompts)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Basic project management tools</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Advanced AI features</span>
                  </li>
                </ul>
                
                <Link href="/auth?plan=standard">
                  <Button className="w-full rounded-full">Subscribe Now</Button>
                </Link>
              </div>
              
              {/* Founder Plan */}
              <div className="bg-gradient-to-br from-primary/5 to-white rounded-xl border border-light-border p-6 flex flex-col">
                <h3 className="text-xl font-bold mb-2">Founder Plan</h3>
                <div className="text-3xl font-bold mb-4">£15 <span className="text-sm font-normal text-neutral">/month</span></div>
                <p className="text-neutral-dark mb-6">Premium access with unlimited AI features and collaborative tools.</p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>All Standard Plan features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Advanced AI-assisted comments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited collaborative environments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited AI workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Advanced project management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Priority customer support</span>
                  </li>
                </ul>
                
                <Link href="/auth?plan=founder">
                  <Button variant="outline" className="w-full rounded-full border-primary text-primary bg-white hover:bg-light">Choose Founder Plan</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Start Building with Fellow Founders Today</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Join FounderSocials to connect with like-minded entrepreneurs, share ideas, and collaborate on projects that matter.
            </p>
            <Link href="/auth">
              <Button variant="secondary" size="lg" className="rounded-full px-8">
                Join Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNavigation />
    </>
  );
}
