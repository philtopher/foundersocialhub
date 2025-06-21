import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Users, 
  Bot,
  MessageSquare,
  Search,
  HelpCircle,
  Lightbulb,
  Zap,
  Kanban
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
              Simple AI-powered commenting that turns basic responses into meaningful professional conversations
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
                Like Reddit for founders, but with AI that makes every comment more valuable. Join communities, share ideas, and let AI help you communicate better.
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
        
        {/* How It Works - Simple Steps */}
        <section className="py-16 bg-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works (3 Simple Steps)</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3">Write Your Comment</h3>
                  <p className="text-neutral-dark">
                    Type a normal comment on any post. Don't worry about making it perfect.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3">AI Asks Questions</h3>
                  <p className="text-neutral-dark">
                    AI asks clarifying questions to understand your point better and help you express it clearly.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3">Enhanced Comment Posted</h3>
                  <p className="text-neutral-dark">
                    Your improved comment gets posted, leading to better discussions and connections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Features</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl mb-8 text-center">
                <Bot className="text-primary w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Smart Comments That Build Projects</h3>
                <p className="text-neutral-dark">
                  AI transforms simple comments into structured collaboration opportunities with enhanced content and follow-up questions.
                </p>
              </div>

              {/* Quick Overview */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-light p-4 rounded-lg text-center">
                  <MessageSquare className="text-primary w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-bold mb-2">Comment Enhancement</h4>
                  <p className="text-sm text-neutral-dark">AI improves your comments for clarity and impact</p>
                </div>
                <div className="bg-light p-4 rounded-lg text-center">
                  <Bot className="text-primary w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-bold mb-2">Smart Questions</h4>
                  <p className="text-sm text-neutral-dark">AI asks follow-up questions to deepen discussions</p>
                </div>
                <div className="bg-light p-4 rounded-lg text-center">
                  <Zap className="text-primary w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-bold mb-2">Process Flows</h4>
                  <p className="text-sm text-neutral-dark">AI generates workflow diagrams from conversations</p>
                </div>
              </div>

              {/* Use Cases by User Type */}
              <h3 className="text-2xl font-bold mb-8 text-center">How Different Users Benefit</h3>
              
              <div className="space-y-8">
                {/* Researchers */}
                <div className="border border-light-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Search className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-bold">For Researchers</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">You write:</h5>
                      <div className="bg-gray-50 p-3 rounded text-sm italic">
                        "Interesting findings on user behavior"
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">AI enhances to:</h5>
                      <div className="bg-primary/5 p-3 rounded text-sm">
                        "These findings on user behavior align with my research on digital engagement patterns. What specific methodologies did you use for data collection? I'd be interested in comparing results with similar studies in the fintech sector."
                      </div>
                    </div>
                  </div>
                </div>

                {/* Domain Experts */}
                <div className="border border-light-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold">For Domain Experts</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">You write:</h5>
                      <div className="bg-gray-50 p-3 rounded text-sm italic">
                        "This won't work in enterprise environments"
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">AI enhances to:</h5>
                      <div className="bg-primary/5 p-3 rounded text-sm">
                        "Based on my experience with enterprise implementations, this approach faces several challenges: compliance requirements, integration complexity, and scalability concerns. Here's what I'd recommend instead... Have you considered these enterprise-specific factors?"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Newbies */}
                <div className="border border-light-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <HelpCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="text-xl font-bold">For Newbies</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">You write:</h5>
                      <div className="bg-gray-50 p-3 rounded text-sm italic">
                        "I'm confused about this"
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">AI enhances to:</h5>
                      <div className="bg-primary/5 p-3 rounded text-sm">
                        "I'm new to this concept and finding it challenging to understand. Could you break down the key components? Specifically, I'm unclear about how the different parts connect. What would be the best starting point for someone just learning?"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Founders */}
                <div className="border border-light-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Lightbulb className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-bold">For Founders</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">You write:</h5>
                      <div className="bg-gray-50 p-3 rounded text-sm italic">
                        "We should build this feature"
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">AI enhances to:</h5>
                      <div className="bg-primary/5 p-3 rounded text-sm">
                        "This feature could significantly impact user engagement. From a product strategy perspective, it aligns with our goal of improving retention. What's the business case? Have we validated user demand? I'd suggest A/B testing the concept first. Happy to share our implementation approach."
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
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-light-border text-center">
                  <h3 className="text-xl font-bold mb-2">Free</h3>
                  <p className="text-3xl font-bold mb-4">£0</p>
                  <ul className="text-sm text-left space-y-2 mb-6">
                    <li>✓ Browse communities</li>
                    <li>✓ Create posts</li>
                    <li>✓ Basic commenting</li>
                    <li>✗ AI features</li>
                  </ul>
                  <Button variant="outline" className="w-full">Current Plan</Button>
                </div>
                
                <div className="bg-white p-6 rounded-lg border-2 border-primary text-center relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </div>
                  <h3 className="text-xl font-bold mb-2">Standard</h3>
                  <p className="text-3xl font-bold mb-4">£3<span className="text-sm">/month</span></p>
                  <ul className="text-sm text-left space-y-2 mb-6">
                    <li>✓ Everything in Free</li>
                    <li>✓ AI comment enhancement</li>
                    <li>✓ Smart follow-up questions</li>
                    <li>✓ 3 AI prompts/month</li>
                    <li>✓ Premium communities</li>
                  </ul>
                  <Link href="/payment">
                    <Button className="w-full">Upgrade Now</Button>
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-light-border text-center">
                  <h3 className="text-xl font-bold mb-2">Founder</h3>
                  <p className="text-3xl font-bold mb-4">£7<span className="text-sm">/month</span></p>
                  <ul className="text-sm text-left space-y-2 mb-6">
                    <li>✓ Everything in Standard</li>
                    <li>✓ Unlimited AI prompts</li>
                    <li>✓ Process flow generation</li>
                    <li>✓ Direct posting option</li>
                    <li>✓ Founder badge</li>
                    <li>✓ Priority support</li>
                  </ul>
                  <Link href="/payment">
                    <Button className="w-full">Go Pro</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple FAQ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Quick Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="border border-light-border rounded-lg p-6">
                <h3 className="font-bold mb-2">How does AI commenting work?</h3>
                <p className="text-neutral-dark">Type your comment → AI asks clarifying questions → You respond → Enhanced comment gets posted with better engagement potential.</p>
              </div>
              
              <div className="border border-light-border rounded-lg p-6">
                <h3 className="font-bold mb-2">What happens to my data?</h3>
                <p className="text-neutral-dark">Your conversations help improve AI responses but are never shared publicly. You control privacy settings in your account.</p>
              </div>
              
              <div className="border border-light-border rounded-lg p-6">
                <h3 className="font-bold mb-2">Can I cancel anytime?</h3>
                <p className="text-neutral-dark">Yes, cancel anytime from your settings. You keep access until your billing period ends.</p>
              </div>
              
              <div className="border border-light-border rounded-lg p-6">
                <h3 className="font-bold mb-2">Is there a free trial?</h3>
                <p className="text-neutral-dark">All paid plans include a 7-day free trial. No charges until the trial ends.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}