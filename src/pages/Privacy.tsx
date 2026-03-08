import Layout from "@/components/Layout";
import RevealSection from "@/components/RevealSection";

const Privacy = () => (
  <Layout>
    <section className="container max-w-3xl py-16 md:py-24">
      <RevealSection>
        <h1 className="font-heading text-4xl font-extrabold text-primary md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: March 2026</p>
      </RevealSection>

      <div className="mt-10 space-y-10 text-foreground/85 leading-[1.8] text-base">
        <RevealSection>
          <h2 className="font-heading text-xl font-bold text-primary mb-3">Information We Collect</h2>
          <p>FitCore collects basic user data such as your name and email address for account creation and platform functionality. We may also collect usage data to improve our services and your experience.</p>
        </RevealSection>

        <RevealSection delay={80}>
          <h2 className="font-heading text-xl font-bold text-primary mb-3">How We Use Your Data</h2>
          <p>Your data is used to provide and improve FitCore's services, including personalized workout recommendations, progress tracking, and communication about your account. We do not sell or share your personal data with third parties.</p>
        </RevealSection>

        <RevealSection delay={160}>
          <h2 className="font-heading text-xl font-bold text-primary mb-3">Data Security</h2>
          <p>All user data is stored securely using industry-standard encryption and security practices. We take reasonable measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
        </RevealSection>

        <RevealSection delay={240}>
          <h2 className="font-heading text-xl font-bold text-primary mb-3">Cookies and Usage Data</h2>
          <p>FitCore may use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze platform usage. You can manage cookie preferences through your browser settings. Usage data such as pages visited and time spent helps us improve the platform.</p>
        </RevealSection>

        <RevealSection delay={320}>
          <h2 className="font-heading text-xl font-bold text-primary mb-3">Contact Us</h2>
          <p>If you have any privacy-related questions or concerns, please contact us at <a href="mailto:support@fitcore.app" className="text-accent hover:underline font-medium">support@fitcore.app</a>.</p>
        </RevealSection>
      </div>
    </section>
  </Layout>
);

export default Privacy;
