import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Brain, Globe, RefreshCw, ShieldCheck, Zap, UserCircle2, FileCheck2, MessageSquare, Workflow } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />
          
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-light-border overflow-hidden">
              {/* Hero section */}
              <div className="bg-gradient-to-r from-primary to-primary-dark p-8 md:p-12 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">How FounderSocials Works</h1>
                <p className="text-lg md:text-xl opacity-90 max-w-3xl">
                  Connect with like-minded founders, build trust quickly, and collaborate effectively using our AI-powered platform designed specifically for entrepreneurs.
                </p>
              </div>
              
              {/* Main content */}
              <div className="p-6 md:p-8">
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2">The FounderSocials Advantage</h2>
                  <p className="text-neutral-dark mb-6">
                    FounderSocials is more than just a social network - it's a complete ecosystem designed to help founders connect, collaborate, and build successful ventures together.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-light-border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center mr-4 flex-shrink-0">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Build Trust Rapidly</h3>
                          <p className="text-neutral-dark">
                            Our platform helps founders who have just met to quickly establish trust through verified profiles, community endorsements, and transparent collaboration tools.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-light-border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center mr-4 flex-shrink-0">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Accelerate Collaboration</h3>
                          <p className="text-neutral-dark">
                            Reduce the time it takes to understand requirements and start working together through our streamlined communication tools and project templates.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-light-border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center mr-4 flex-shrink-0">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">AI-Powered Interactions</h3>
                          <p className="text-neutral-dark">
                            Our advanced AI features help moderate discussions, generate valuable insights, and facilitate better collaboration between founders.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-light-border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center mr-4 flex-shrink-0">
                          <Workflow className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Free Project Management</h3>
                          <p className="text-neutral-dark">
                            Access powerful project management tools at no additional cost, helping you organize tasks, track progress, and manage collaborative projects efficiently.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2">How to Use FounderSocials</h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-start">
                      <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                      <div>
                        <h3 className="font-bold text-xl mb-2">Create Your Account</h3>
                        <p className="text-neutral-dark mb-3">
                          Sign up using your Replit account and choose between our Standard Plan (£7/month) or Founder Plan (£15/month) with enhanced AI capabilities.
                        </p>
                        <div className="bg-light p-4 rounded-lg">
                          <p className="text-sm text-neutral-dark italic">
                            "The registration process was smooth, and I was able to quickly set up my profile with my entrepreneurial background and interests." - Sarah M., Tech Founder
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                      <div>
                        <h3 className="font-bold text-xl mb-2">Join & Create Communities</h3>
                        <p className="text-neutral-dark mb-3">
                          Explore existing communities focused on different industries, technologies, or founder challenges. Create your own communities to gather like-minded entrepreneurs.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-light text-neutral-dark rounded-full text-sm">startups</span>
                          <span className="px-3 py-1 bg-light text-neutral-dark rounded-full text-sm">saas</span>
                          <span className="px-3 py-1 bg-light text-neutral-dark rounded-full text-sm">fintech</span>
                          <span className="px-3 py-1 bg-light text-neutral-dark rounded-full text-sm">bootstrapping</span>
                          <span className="px-3 py-1 bg-light text-neutral-dark rounded-full text-sm">marketing</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                      <div>
                        <h3 className="font-bold text-xl mb-2">Share Ideas & Connect</h3>
                        <p className="text-neutral-dark mb-3">
                          Post questions, insights, and ideas to get feedback from the community. Our AI-moderated comments help maintain high-quality discussions.
                        </p>
                        <div className="flex space-x-4 mb-3">
                          <div className="flex items-center text-neutral">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>Comment</span>
                          </div>
                          <div className="flex items-center text-neutral">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            <span>Share</span>
                          </div>
                          <div className="flex items-center text-neutral">
                            <UserCircle2 className="h-4 w-4 mr-1" />
                            <span>Connect</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
                      <div>
                        <h3 className="font-bold text-xl mb-2">Collaborate with AI Workflows</h3>
                        <p className="text-neutral-dark mb-3">
                          Utilize our advanced AI workflows to generate ideas, analyze opportunities, and create process flows. Founder Plan members get unlimited access to premium AI features.
                        </p>
                        <div className="bg-primary-light p-4 rounded-lg text-primary-dark">
                          <h4 className="font-medium mb-1">Premium AI Features:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Advanced idea generation and validation</li>
                            <li>Market analysis and competitor research</li>
                            <li>Technical feasibility assessments</li>
                            <li>Process flows and project planning</li>
                            <li>Collaborative development environments</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">5</div>
                      <div>
                        <h3 className="font-bold text-xl mb-2">Manage Projects Together</h3>
                        <p className="text-neutral-dark mb-3">
                          Use our free project management tools to organize tasks, track progress, and collaborate effectively. Create temporary development environments for prototype collaboration.
                        </p>
                        <div className="flex items-center">
                          <FileCheck2 className="h-5 w-5 text-primary mr-2" />
                          <span className="text-neutral-dark">Streamlined from ideation to implementation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2">Start Your Founder Journey Today</h2>
                  <div className="bg-light p-6 rounded-lg text-center md:text-left md:flex items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="font-bold text-xl mb-2">Ready to connect with other founders?</h3>
                      <p className="text-neutral-dark">
                        Join FounderSocials today and experience a new way to collaborate and build successful ventures.
                      </p>
                    </div>
                    <Link href="/auth">
                      <Button className="bg-primary hover:bg-primary-hover text-white px-6 py-2">
                        Get Started Now
                      </Button>
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-lg border border-light-border p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-4">Subscription Plans</h3>
              
              <div className="space-y-6">
                <div className="border border-light-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold">Standard Plan</h4>
                    <span className="text-primary font-medium">£7/month</span>
                  </div>
                  <ul className="space-y-2 text-sm text-neutral-dark">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Access to all communities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Basic AI comment moderation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Limited AI workflow access (3 prompts)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Project management tools</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border-2 border-primary rounded-lg p-4 relative">
                  <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1/2 bg-primary text-white text-xs px-2 py-1 rounded">
                    POPULAR
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold">Founder Plan</h4>
                    <span className="text-primary font-medium">£15/month</span>
                  </div>
                  <ul className="space-y-2 text-sm text-neutral-dark">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Everything in Standard Plan</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Advanced AI comment moderation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Unlimited AI workflow access</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Collaborative dev environments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Priority community features</span>
                    </li>
                  </ul>
                  <Link href="/auth">
                    <Button className="w-full mt-4 bg-primary hover:bg-primary-hover text-white">
                      Start with Founder Plan
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral mb-2">Questions about our plans?</p>
                <Link href="#" className="text-primary text-sm font-medium hover:underline">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}
