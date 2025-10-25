import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";

const logoPath = "/RepairRequest Logo Transparent_1750783382845.png";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img src={logoPath} alt="RepairRequest Logo" className="w-10 h-10" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">RepairRequest</h1>
                  <p className="text-sm text-gray-600">by SchoolHouse Logistics</p>
                </div>
              </div>
            </Link>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">
                FAQ
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <a href="https://calendly.com/schoolhouselogistics/30min" target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white ml-4">
                  Schedule Call
                </Button>
              </a>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <a href="https://calendly.com/schoolhouselogistics/30min" target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Schedule Call
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium text-left">
                🎉 Try RepairRequest Free for 30 Days! 
                <span className="hidden sm:inline ml-2">• No credit card required • Full access to all features • Cancel anytime</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <a href="/api/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center">
                Start Free Trial
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <button className="text-white hover:text-blue-100 transition-colors p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Terms of
            <span className="text-blue-600 block">Service</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Please read these terms carefully before using RepairRequest services.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            
            <Card>
              <CardHeader>
                <CardTitle>Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  By accessing or using RepairRequest ("Service"), operated by SchoolHouse Logistics ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description of Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  RepairRequest is a web-based platform that enables organizations to manage facility repair requests, track work orders, and coordinate maintenance activities. The Service includes features for request submission, status tracking, photo uploads, messaging, and reporting.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Accounts and Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Account Creation</h4>
                  <p className="text-gray-600">
                    To use our Service, you must create an account using Google OAuth authentication. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Eligibility</h4>
                  <p className="text-gray-600">
                    You must be at least 18 years old and have the authority to enter into this agreement on behalf of your organization to use this Service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Organization Access</h4>
                  <p className="text-gray-600">
                    Access to specific organizational data is controlled by email domain verification and administrator permissions. You may only access data for organizations you are authorized to view.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acceptable Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Upload or transmit malicious code, viruses, or harmful content</li>
                  <li>Attempt to gain unauthorized access to other accounts or systems</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use the Service to harass, abuse, or harm others</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Share login credentials with unauthorized individuals</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content and Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">User Content</h4>
                  <p className="text-gray-600">
                    You retain ownership of content you submit to the Service, including repair requests, photos, and messages. By submitting content, you grant us a license to use, store, and process it to provide the Service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Content Standards</h4>
                  <p className="text-gray-600">
                    All content must be appropriate for a professional workplace environment. We reserve the right to remove content that violates these standards or applicable laws.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Backup</h4>
                  <p className="text-gray-600">
                    While we maintain regular backups, you are responsible for maintaining your own backups of important data.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We strive to maintain high availability of our Service, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We will provide reasonable notice of planned maintenance when possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment and Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Subscription Fees</h4>
                  <p className="text-gray-600">
                    Use of the Service requires a valid subscription. Fees are charged in advance on a monthly or annual basis as selected during signup.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Terms</h4>
                  <p className="text-gray-600">
                    Payment is due in advance. Failure to pay fees may result in suspension or termination of service. All fees are non-refundable except as required by law.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Price Changes</h4>
                  <p className="text-gray-600">
                    We may change subscription prices with 30 days' notice. Price changes will take effect at your next billing cycle.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The Service and its original content, features, and functionality are owned by SchoolHouse Logistics and are protected by intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the Service without our written permission.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy and Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To the maximum extent permitted by law, SchoolHouse Logistics shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business interruption, arising from your use of the Service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indemnification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You agree to indemnify and hold harmless SchoolHouse Logistics from any claims, damages, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">By You</h4>
                  <p className="text-gray-600">
                    You may terminate your account at any time by contacting us. Upon termination, your access to the Service will cease.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">By Us</h4>
                  <p className="text-gray-600">
                    We may terminate or suspend your account for violation of these Terms, non-payment, or other reasonable cause with appropriate notice.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Effect of Termination</h4>
                  <p className="text-gray-600">
                    Upon termination, you will lose access to the Service and your data may be deleted according to our data retention policies.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Lee County, Florida.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 text-gray-600">
                  <p>Email: legal@schoolhouselogistics.com</p>
                  <p>Address: SchoolHouse Logistics, 123 Business Drive, Suite 100, Fort Myers, FL 33901</p>
                  <p>Phone: 1-800-REPAIR-1</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact and Calendly Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Schedule a Meeting - Calendly Widget */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Schedule a Meeting</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Book a call with our team to discuss your organization's needs and explore our solutions.
              </p>
              
              {/* Calendly Embed */}
              <div className="calendly-inline-widget" data-url="https://calendly.com/schoolhouselogistics/30min" style={{minWidth: '320px', height: '630px'}}></div>
              <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
            </div>

            {/* Get In Touch - Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Mail className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Get In Touch</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Ready to transform your operations? Send us a message and we'll get back to you promptly.
              </p>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input placeholder="First Name *" required />
                  </div>
                  <div>
                    <Input placeholder="Last Name *" required />
                  </div>
                </div>
                <div>
                  <Input type="email" placeholder="Email Address *" required />
                </div>
                <div>
                  <Input placeholder="Organization/Company" />
                </div>
                <div>
                  <Textarea 
                    placeholder="Message *" 
                    rows={4}
                    required
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link to="/">
                <div className="flex items-center space-x-3 mb-4 cursor-pointer">
                  <img src={logoPath} alt="RepairRequest Logo" className="w-8 h-8" />
                  <div>
                    <h3 className="text-lg font-bold">RepairRequest</h3>
                    <p className="text-sm text-gray-400">by SchoolHouse Logistics</p>
                  </div>
                </div>
              </Link>
              <p className="text-gray-400">
                Streamlining maintenance management for property managers and organizations across all industries.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Portal Login</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RepairRequest by SchoolHouse Logistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <ScrollToTop />
    </div>
  );
}