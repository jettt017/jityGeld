import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { HelpCircle, ChevronDown, Mail, Clock } from "lucide-react";
import { HelpCenterNav } from "@/components/help-center-nav";

export const metadata: Metadata = {
  title: "Support Center",
};

const faqs = [
  {
    question: "How do I add a transaction?",
    answer:
      "Navigate to the Transactions page and click the 'Add Transaction' button in the header. Fill in the required fields such as amount, date, category, and whether it is an income or expense.",
  },
  {
    question: "How do I export my data?",
    answer:
      "Open the Transactions page. Beside the 'Add Transaction' button, click the 'Export' dropdown to download your data as an Excel (.xlsx), PDF (.pdf), or CSV (.csv) file.",
  },
  {
    question: "How do I create a savings goal?",
    answer:
      "Go to the Savings page from the sidebar. Click the 'Add Goal' button, enter the goal name, target amount, and a target date. You can then add funds towards this goal directly from the Savings dashboard.",
  },
  {
    question: "Can I edit transactions?",
    answer:
      "Yes. On the Transactions or Calendar page, click on any existing transaction to view its details. Select 'Edit' to update the amount, date, or category.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Currently, account deletion must be requested manually or handled through the profile settings if available. Please contact support if you need immediate assistance with data deletion.",
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <HelpCenterNav current="/support" />
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Support Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find answers to common questions or reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FAQs */}
        <div className="md:col-span-2">
          <Card className="p-6 md:p-8 rounded-2xl border-border/50 shadow-sm bg-card h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-1">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group border-b border-border/60 last:border-0"
                >
                  <summary className="flex cursor-pointer items-center justify-between py-4 font-medium text-foreground outline-none list-none [&::-webkit-details-marker]:hidden hover:text-primary transition-colors">
                    {faq.question}
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="pb-4 text-sm text-muted-foreground leading-relaxed pr-8">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </Card>
        </div>

        {/* Contact Support */}
        <div className="md:col-span-1">
          <Card className="p-6 rounded-2xl border-border/50 shadow-sm bg-card h-full flex flex-col justify-center text-center space-y-6">
            <div className="mx-auto p-4 bg-primary/5 rounded-full ring-8 ring-primary/5">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Still need help?
              </h3>
              <p className="text-sm text-muted-foreground mt-2 mb-4 leading-relaxed">
                Our support team is always ready to assist you with any issues or inquiries.
              </p>
              <a
                href="mailto:gamely017@gmail.com"
                className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
              >
                gamely017@gmail.com
              </a>
            </div>
            
            <div className="pt-4 border-t border-border/60 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Response time: 24–48 hours</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
