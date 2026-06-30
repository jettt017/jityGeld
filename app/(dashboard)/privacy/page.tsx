import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Last updated: June 2026
        </p>
      </div>

      <Card className="p-6 md:p-8 rounded-2xl border-border/50 shadow-sm bg-card space-y-8">
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Introduction
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            At JityGeld, we are deeply committed to maintaining the trust and confidence of our users. We believe that your financial data is highly sensitive, and we prioritize the security and privacy of your information above all else. This policy explains what information we collect, how we use it, and how we protect it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Information We Collect
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            To provide you with a comprehensive financial tracking experience, we collect the following types of information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>Name and profile information</li>
            <li>Email address</li>
            <li>Financial transactions (income and expenses)</li>
            <li>Savings goals and progress</li>
            <li>User preferences and settings</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            How We Use Your Data
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>To display your personalized dashboard analytics</li>
            <li>To calculate spending trends and categorized summaries</li>
            <li>To generate actionable financial insights</li>
            <li>To improve overall application performance and user experience</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Data Security
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your data is stored securely using <strong>Supabase</strong> with a robust PostgreSQL database architecture. All data transmitted between your browser and our servers is encrypted using modern TLS standards. Authentication is handled securely via Supabase Auth, and Row Level Security (RLS) ensures that your financial records can only be accessed by you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Third-Party Services
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            JityGeld is built using modern, industry-standard technologies to ensure reliability and security:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li><strong>Supabase</strong> (Database, Authentication, Storage)</li>
            <li><strong>PostgreSQL</strong> (Relational Database)</li>
            <li><strong>Prisma ORM</strong> (Database Query Engine)</li>
            <li><strong>Next.js & Vercel</strong> (Application Framework and Hosting)</li>
          </ul>
        </section>

        <section className="space-y-3 border-t pt-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Contact
          </h2>
          <p className="text-sm text-muted-foreground">
            Need help or have questions about your privacy?
            <br />
            Contact us at: <a href="mailto:support@jitygeld.com" className="text-primary hover:underline font-medium">support@jitygeld.com</a>
          </p>
        </section>
      </Card>
    </div>
  );
}
