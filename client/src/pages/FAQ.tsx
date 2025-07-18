import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, HelpCircle, Users, Building2, Settings, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logoPath from "@assets/RepairRequest Logo Transparent_1750783382845.png";

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      color: "blue",
      questions: [
        {
          question: "How do I get access to RepairRequest?",
          answer: "Contact your organization's administrator to get access credentials. They can create an account for you and assign the appropriate role (requester, maintenance staff, or admin)."
        },
        {
          question: "What do I need to sign in?",
          answer: "RepairRequest uses Google OAuth for secure authentication. You'll need a Google account with an email address that's been authorized by your organization."
        },
        {
          question: "How do I submit my first repair request?",
          answer: "After logging in, click 'New Request' from your dashboard. Choose between Facility Request (for events/scheduling) or Repair Request (for maintenance/repairs), fill out the form with details and photos, then submit."
        },
        {
          question: "Can I attach photos to my requests?",
          answer: "Yes! You can upload multiple photos when creating a request to help maintenance staff better understand the issue. This speeds up resolution time significantly."
        }
      ]
    },
    {
      title: "Request Management",
      icon: Settings,
      color: "green",
      questions: [
        {
          question: "What's the difference between Facility and Building requests?",
          answer: "Facility requests are for scheduling events, room bookings, and equipment needs. Building requests are for maintenance issues, repairs, and building-related problems."
        },
        {
          question: "How do I track the status of my request?",
          answer: "All your requests are visible in 'My Requests' section. You'll see real-time status updates: Pending, Approved, In Progress, or Completed. You'll also receive email notifications for status changes."
        },
        {
          question: "Can I edit a request after submitting it?",
          answer: "You can add comments and additional photos to existing requests, but you cannot edit the original details. If you need to make significant changes, contact your administrator or submit a new request."
        },
        {
          question: "How do I communicate with maintenance staff?",
          answer: "Each request has a messaging system where you can communicate directly with assigned maintenance staff. You'll receive email notifications for new messages."
        },
        {
          question: "What happens if my request is urgent?",
          answer: "Set the priority level to 'High' or 'Urgent' when submitting. Urgent requests are highlighted for administrators and maintenance staff, ensuring faster response times."
        }
      ]
    },
    {
      title: "User Roles & Permissions",
      icon: Users,
      color: "purple",
      questions: [
        {
          question: "What are the different user roles?",
          answer: "There are four main roles: Requester (submit requests), Maintenance Staff (handle requests), Admin (manage organization), and Super Admin (manage multiple organizations)."
        },
        {
          question: "Can I see other people's requests?",
          answer: "Requesters can only see their own requests. Maintenance staff can see assigned requests. Admins can see all requests within their organization."
        },
        {
          question: "How do I become a maintenance staff member?",
          answer: "Your organization's administrator needs to change your role from 'requester' to 'maintenance'. Contact them to request this change if you need to handle maintenance requests."
        },
        {
          question: "Can I manage multiple buildings or organizations?",
          answer: "Admin users can manage multiple buildings within their organization. Super Admin users can manage multiple organizations entirely."
        }
      ]
    },
    {
      title: "Technical & Security",
      icon: Shield,
      color: "red",
      questions: [
        {
          question: "Is my data secure?",
          answer: "Yes. RepairRequest uses enterprise-grade security with Google OAuth authentication, encrypted data transmission, and secure cloud storage. Your data is protected and private."
        },
        {
          question: "What browsers are supported?",
          answer: "RepairRequest works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience."
        },
        {
          question: "Can I use RepairRequest on mobile devices?",
          answer: "Absolutely! RepairRequest is fully responsive and works great on phones and tablets. You can submit requests, upload photos, and track status from any device."
        },
        {
          question: "What if I forget my password?",
          answer: "RepairRequest uses Google authentication, so you don't have a separate password. If you can't access your Google account, use Google's password recovery process."
        },
        {
          question: "How long is my data stored?",
          answer: "Request data is stored according to your organization's data retention policy. Contact your administrator for specific details about data retention and deletion policies."
        }
      ]
    },
    {
      title: "Organizations & Buildings",
      icon: Building2,
      color: "orange",
      questions: [
        {
          question: "How do I switch between buildings?",
          answer: "If your organization has multiple buildings, you can select the specific building when creating a request. Your dashboard will show requests from all buildings you have access to."
        },
        {
          question: "Can I see the history of a specific room?",
          answer: "Yes! Use the 'Room History' feature to see all past requests for a specific building and room. This helps track recurring issues and maintenance patterns."
        },
        {
          question: "How do I add a new building to our organization?",
          answer: "Only organization administrators can add new buildings. Contact your admin to request new buildings be added to your organization's account."
        },
        {
          question: "What if I work at multiple organizations?",
          answer: "Each organization requires a separate account. You'll need different login credentials for each organization you work with."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src={logoPath} alt="RepairRequest Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">RepairRequest</h1>
                <p className="text-sm text-gray-600">by SchoolHouse Logistics</p>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link to="/faq" className="text-blue-600 font-medium">
                FAQ
              </Link>
              <Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors">
                Support
              </Link>
              <Link to="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white ml-4">
                  Login to Portal
                </Button>
              </Link>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link to="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Login to Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Frequently Asked Questions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Your Questions
            <span className="text-blue-600 block">Answered</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find answers to common questions about using RepairRequest for your maintenance management needs.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                    <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const itemIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openItems.includes(itemIndex);
                    
                    return (
                      <Card key={faqIndex} className="border border-gray-200">
                        <Collapsible>
                          <CollapsibleTrigger 
                            className="w-full"
                            onClick={() => toggleItem(itemIndex)}
                          >
                            <CardHeader className="hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-left text-lg font-semibold text-gray-900">
                                  {faq.question}
                                </CardTitle>
                                <ChevronDown 
                                  className={`h-5 w-5 text-gray-500 transition-transform ${
                                    isOpen ? 'transform rotate-180' : ''
                                  }`} 
                                />
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our support team is here to help you get the most out of RepairRequest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/support">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Contact Support
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src={logoPath} alt="RepairRequest Logo" className="w-8 h-8" />
                <div>
                  <h3 className="text-lg font-bold">RepairRequest</h3>
                  <p className="text-sm text-gray-400">by SchoolHouse Logistics</p>
                </div>
              </div>
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
    </div>
  );
}