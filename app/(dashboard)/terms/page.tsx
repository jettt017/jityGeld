import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Scale } from "lucide-react";
import { HelpCenterNav } from "@/components/help-center-nav";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Last updated: June 2026
        </p>
      </div>

      <Card className="p-6 md:p-8 rounded-2xl border-border/50 shadow-sm bg-card space-y-8">
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Acceptance of Terms
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By accessing and using JityGeld, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue your use of the application immediately. These terms apply to all users, visitors, and others who access or use the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            User Responsibilities
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            As a user of JityGeld, you agree to the following responsibilities:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>Maintain the confidentiality and security of your account credentials.</li>
            <li>Ensure that the financial transaction data you input is accurate and lawful.</li>
            <li>Do not misuse the application, attempt to breach security, or interfere with its proper functioning.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Availability
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            While we strive to provide uninterrupted access to JityGeld, we do not guarantee that the service will be available at all times. The service may be suspended temporarily and without notice in the case of system failure, maintenance, repair, or for reasons beyond our control. We reserve the right to modify or discontinue the service at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Disclaimer
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            JityGeld is a personal financial tracking application designed to help you monitor your income, expenses, and savings. <strong>JityGeld is not a bank, financial institution, or investment advisory service.</strong> Any insights, analytics, or summaries provided by the application are for informational purposes only and should not be construed as professional financial advice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Limitation of Liability
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In no event shall JityGeld, its developers, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the service. Users are solely responsible for the financial data they input and any decisions made based on the application's insights.
          </p>
        </section>
      </Card>

      <HelpCenterNav current="/terms" />
    </div>
  );
}
