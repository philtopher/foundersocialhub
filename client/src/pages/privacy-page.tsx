import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />
          
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-light-border p-6 md:p-8">
              <h1 className="text-3xl font-bold mb-6 text-dark">Privacy Policy</h1>
              
              <div className="prose max-w-none">
                <p className="text-neutral-dark mb-6">
                  Last Updated: May 5, 2025
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">1. Introduction</h2>
                <p className="mb-4">
                  At FounderSocials ("Platform", "we", "us", or "our"), we respect your privacy and are committed to 
                  protecting your personal data. This Privacy Policy explains how we collect, use, process, and share 
                  your personal information when you use our Platform.
                </p>
                <p className="mb-4">
                  By using our Platform, you consent to our collection and use of your personal information as described 
                  in this Privacy Policy. If you do not agree with our policies and practices, please do not use our Platform.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">2. Information We Collect</h2>
                <h3 className="text-lg font-bold mt-6 mb-2">2.1 Personal Information You Provide</h3>
                <p className="mb-4">
                  When you register for an account or use our services, we collect the following types of personal information:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>Name and contact information (email address, username)</li>
                  <li>Profile information (bio, profile picture, professional background)</li>
                  <li>Content you create and share on the Platform</li>
                  <li>Payment information for subscription services</li>
                  <li>Communications with us and other users</li>
                </ul>
                
                <h3 className="text-lg font-bold mt-6 mb-2">2.2 Information Collected Automatically</h3>
                <p className="mb-4">
                  When you access or use our Platform, we automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, actions taken)</li>
                  <li>Location information (approximate location based on IP address)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
                
                <h3 className="text-lg font-bold mt-6 mb-2">2.3 Information from Third Parties</h3>
                <p className="mb-4">
                  We may receive information about you from third parties, including:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>Authentication providers (when you login using Replit)</li>
                  <li>Payment processors (for subscription-related information)</li>
                  <li>Other users of the Platform</li>
                </ul>
                
                <h2 className="text-xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">
                  We use your personal information for various purposes, including:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>Providing and improving our services</li>
                  <li>Creating and maintaining your account</li>
                  <li>Processing transactions and subscriptions</li>
                  <li>Personalizing your experience</li>
                  <li>Facilitating community features and communications</li>
                  <li>Analyzing usage patterns to improve the Platform</li>
                  <li>Training and improving our AI systems</li>
                  <li>Enforcing our Terms and Conditions</li>
                  <li>Complying with legal obligations</li>
                </ul>
                
                <h2 className="text-xl font-bold mt-8 mb-4">4. AI Features and Data Processing</h2>
                <p className="mb-4">
                  Our Platform uses artificial intelligence technologies to provide various features. When you use these 
                  AI features, we collect and process the following information:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>Content you input or create using AI tools</li>
                  <li>Your interactions with AI systems</li>
                  <li>Feedback you provide on AI-generated content</li>
                </ul>
                <p className="mb-4">
                  We use this information to:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>Deliver AI-powered services and features</li>
                  <li>Improve the performance and accuracy of our AI systems</li>
                  <li>Create new AI features and capabilities</li>
                </ul>
                <p className="mb-4">
                  You can control the use of your data for AI training in your account settings.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">5. How We Share Your Information</h2>
                <p className="mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li><strong>With Service Providers</strong>: We share information with third-party service providers who help us operate our Platform (e.g., hosting, payment processing, analytics).</li>
                  <li><strong>With Other Users</strong>: Information you post publicly (profiles, posts, comments) is visible to other users.</li>
                  <li><strong>For Legal Reasons</strong>: We may disclose information if required by law or to protect rights, property, or safety.</li>
                  <li><strong>Business Transfers</strong>: If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
                </ul>
                
                <h2 className="text-xl font-bold mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
                <p className="mb-4">
                  We use cookies and similar technologies to collect information about your browsing activities and to 
                  maintain your sessions. You can manage your cookie preferences through your browser settings, but note 
                  that disabling certain cookies may limit your ability to use all features of our Platform.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">7. Data Security</h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your personal information from unauthorized access, 
                  disclosure, alteration, or destruction. However, no internet transmission or electronic storage is 100% 
                  secure, and we cannot guarantee absolute security.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">8. Data Retention</h2>
                <p className="mb-4">
                  We retain your personal information for as long as necessary to fulfill the purposes for which it was 
                  collected, including legal, accounting, or reporting requirements. When your information is no longer 
                  needed, we will securely delete or anonymize it.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">9. Your Rights and Choices</h2>
                <p className="mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>Accessing your personal information</li>
                  <li>Correcting inaccurate information</li>
                  <li>Deleting your information</li>
                  <li>Restricting or objecting to processing</li>
                  <li>Data portability</li>
                  <li>Withdrawing consent</li>
                </ul>
                <p className="mb-4">
                  To exercise these rights, please contact us using the information provided in Section 13.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">10. Children's Privacy</h2>
                <p className="mb-4">
                  Our Platform is not intended for children under 16 years of age. We do not knowingly collect personal 
                  information from children under 16. If we learn we have collected personal information from a child 
                  under 16, we will delete that information promptly.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">11. International Data Transfers</h2>
                <p className="mb-4">
                  Your information may be transferred to and processed in countries other than your country of residence 
                  which may have different data protection laws. We ensure appropriate safeguards are in place to protect 
                  your information in compliance with applicable laws.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">12. Changes to This Privacy Policy</h2>
                <p className="mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review 
                  this Privacy Policy periodically for any changes.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">13. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="mb-4">
                  Email: privacy@foundersocials.com
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-lg border border-light-border p-4 sticky top-6">
              <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary hover:underline">1. Introduction</a></li>
                <li><a href="#" className="text-primary hover:underline">2. Information We Collect</a></li>
                <li><a href="#" className="text-primary hover:underline">3. How We Use Your Information</a></li>
                <li><a href="#" className="text-primary hover:underline">4. AI Features and Data Processing</a></li>
                <li><a href="#" className="text-primary hover:underline">5. How We Share Your Information</a></li>
                <li><a href="#" className="text-primary hover:underline">6. Cookies and Tracking Technologies</a></li>
                <li><a href="#" className="text-primary hover:underline">7. Data Security</a></li>
                <li><a href="#" className="text-primary hover:underline">8. Data Retention</a></li>
                <li><a href="#" className="text-primary hover:underline">9. Your Rights and Choices</a></li>
                <li><a href="#" className="text-primary hover:underline">10. Children's Privacy</a></li>
                <li><a href="#" className="text-primary hover:underline">11. International Data Transfers</a></li>
                <li><a href="#" className="text-primary hover:underline">12. Changes to This Privacy Policy</a></li>
                <li><a href="#" className="text-primary hover:underline">13. Contact Us</a></li>
              </ul>
              <div className="mt-6 pt-4 border-t border-light-border">
                <a href="/terms" className="text-primary hover:underline text-sm">View Terms and Conditions</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}
