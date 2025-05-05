import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />
          
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-light-border p-6 md:p-8">
              <h1 className="text-3xl font-bold mb-6 text-dark">Terms and Conditions</h1>
              
              <div className="prose max-w-none">
                <p className="text-neutral-dark mb-6">
                  Last Updated: May 5, 2025
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">1. Introduction</h2>
                <p className="mb-4">
                  Welcome to FounderSocials ("Platform", "we", "us", or "our"). By accessing or using our platform, 
                  you agree to be bound by these Terms and Conditions ("Terms") and our Privacy Policy. If you do not 
                  agree to these Terms, please do not use the Platform.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">2. Definitions</h2>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li><strong>"Content"</strong>: All text, information, graphics, audio, video, and data offered through the Platform.</li>
                  <li><strong>"User"</strong>: Any individual who accesses or uses the Platform.</li>
                  <li><strong>"User Content"</strong>: Content that users submit, post, or transmit to the Platform.</li>
                  <li><strong>"Subscription Services"</strong>: Premium features available to users who pay a subscription fee.</li>
                  <li><strong>"AI Features"</strong>: Artificial intelligence capabilities integrated into the Platform.</li>
                </ul>
                
                <h2 className="text-xl font-bold mt-8 mb-4">3. Account Registration</h2>
                <p className="mb-4">
                  To access certain features of the Platform, you must register for an account. You agree to provide 
                  accurate, current, and complete information during registration and to update such information to 
                  keep it accurate, current, and complete.
                </p>
                <p className="mb-4">
                  You are responsible for safeguarding your account credentials and for all activities that occur under your 
                  account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">4. Subscription Plans</h2>
                <p className="mb-4">
                  FounderSocials offers the following subscription plans:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li><strong>Free Plan</strong>: Basic access to the platform with limited features.</li>
                  <li><strong>Standard Plan</strong>: Enhanced access including basic AI features (£7/month).</li>
                  <li><strong>Founder Plan</strong>: Premium access with unlimited AI features and collaborative tools (£15/month).</li>
                </ul>
                <p className="mb-4">
                  Subscription fees are billed on a recurring basis. You can cancel your subscription at any time,
                  but refunds are subject to our refund policy.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">5. User Content and License</h2>
                <p className="mb-4">
                  By posting, uploading, or submitting any User Content to the Platform, you grant us a worldwide, 
                  non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute 
                  your User Content in connection with the Platform's services.
                </p>
                <p className="mb-4">
                  You represent and warrant that: (a) you own your User Content or have the right to grant the license 
                  described above; and (b) your User Content does not violate the privacy rights, publicity rights, 
                  copyright rights, or other rights of any person.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">6. Intellectual Property Rights</h2>
                <h3 className="text-lg font-bold mt-6 mb-2">6.1 Platform Content</h3>
                <p className="mb-4">
                  All content included on the Platform, such as text, graphics, logos, images, audio clips, 
                  digital downloads, data compilations, and software, is the property of FounderSocials or its 
                  content suppliers and protected by international copyright laws.
                </p>
                
                <h3 className="text-lg font-bold mt-6 mb-2">6.2 User-Generated Content</h3>
                <p className="mb-4">
                  Users retain ownership of the content they create and share on the Platform. However, by posting 
                  content, users grant FounderSocials a license to use, reproduce, and display that content as described 
                  in Section 5.
                </p>
                
                <h3 className="text-lg font-bold mt-6 mb-2">6.3 AI-Generated Content</h3>
                <p className="mb-4">
                  Content generated through our AI features is subject to the following terms:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>Users who initiate the AI generation retain rights to the resulting content, subject to the license granted to us.</li>
                  <li>FounderSocials may use anonymized AI interactions to improve its services.</li>
                  <li>When multiple users collaborate using AI tools, the resulting content is considered jointly owned unless otherwise agreed upon.</li>
                </ul>
                
                <h3 className="text-lg font-bold mt-6 mb-2">6.4 Collaborative Development Environments</h3>
                <p className="mb-4">
                  Code and other content created in collaborative development environments are subject to the licensing 
                  terms specified by the creator(s) at the time of creation. In the absence of a specified license, 
                  content is presumed to be for private use only and not licensed for redistribution.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">7. Prohibited Conduct</h2>
                <p className="mb-4">
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>Violating any laws or regulations.</li>
                  <li>Infringing upon the intellectual property rights of others.</li>
                  <li>Uploading or transmitting viruses or malicious code.</li>
                  <li>Attempting to interfere with, compromise, or disrupt the Platform.</li>
                  <li>Impersonating or misrepresenting your affiliation with any person or entity.</li>
                  <li>Using the Platform for any illegal or unauthorized purpose.</li>
                  <li>Harassing, abusing, or harming another person.</li>
                  <li>Collecting users' information without their consent.</li>
                </ul>
                
                <h2 className="text-xl font-bold mt-8 mb-4">8. Limitation of Liability</h2>
                <p className="mb-4">
                  To the maximum extent permitted by law, FounderSocials and its affiliates, officers, employees, agents, 
                  partners, and licensors will not be liable for any direct, indirect, incidental, special, consequential, 
                  or punitive damages resulting from your access to or use of, or inability to access or use, the Platform 
                  or any content on it.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">9. Termination</h2>
                <p className="mb-4">
                  We may terminate or suspend your account and access to the Platform immediately, without prior notice 
                  or liability, for any reason, including, without limitation, if you breach these Terms. Upon termination, 
                  your right to use the Platform will immediately cease.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">10. Changes to Terms</h2>
                <p className="mb-4">
                  We reserve the right to modify these Terms at any time. If we make changes, we will provide notice 
                  by posting the updated Terms on the Platform and updating the "Last Updated" date. Your continued use 
                  of the Platform after any such changes constitutes your acceptance of the new Terms.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">11. Governing Law</h2>
                <p className="mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the United Kingdom, 
                  without regard to its conflict of law provisions.
                </p>
                
                <h2 className="text-xl font-bold mt-8 mb-4">12. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about these Terms, please contact us at support@foundersocials.com.
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-lg border border-light-border p-4 sticky top-6">
              <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary hover:underline">1. Introduction</a></li>
                <li><a href="#" className="text-primary hover:underline">2. Definitions</a></li>
                <li><a href="#" className="text-primary hover:underline">3. Account Registration</a></li>
                <li><a href="#" className="text-primary hover:underline">4. Subscription Plans</a></li>
                <li><a href="#" className="text-primary hover:underline">5. User Content and License</a></li>
                <li><a href="#" className="text-primary hover:underline">6. Intellectual Property Rights</a></li>
                <li><a href="#" className="text-primary hover:underline">7. Prohibited Conduct</a></li>
                <li><a href="#" className="text-primary hover:underline">8. Limitation of Liability</a></li>
                <li><a href="#" className="text-primary hover:underline">9. Termination</a></li>
                <li><a href="#" className="text-primary hover:underline">10. Changes to Terms</a></li>
                <li><a href="#" className="text-primary hover:underline">11. Governing Law</a></li>
                <li><a href="#" className="text-primary hover:underline">12. Contact Us</a></li>
              </ul>
              <div className="mt-6 pt-4 border-t border-light-border">
                <a href="/privacy" className="text-primary hover:underline text-sm">View Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileNavigation />
    </>
  );
}
