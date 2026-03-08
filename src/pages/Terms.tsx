import Layout from "@/components/Layout";
import RevealSection from "@/components/RevealSection";

const Terms = () => (
  <Layout>
    <section className="container max-w-3xl py-16 md:py-24">
      <RevealSection>
        <h1 className="font-heading text-4xl font-extrabold text-primary md:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: March 2026</p>
      </RevealSection>

      <div className="mt-10 space-y-10 text-foreground/85 leading-[1.8] text-base">
        <RevealSection>
          <h2 className="font-heading text-xl font-bold text-primary mb-3">Responsible Use</h2>
          <p>By using FitCore, you agree to use the platform responsibly and in accordance with these terms. You must not misuse the platform, attempt to gain unauthorized access, or use FitCore for any unlawful purpose.</p>
        </RevealSection>

        <RevealSection delay={80}>
          <h2 className="font-heading text-xl font-bold text-primary mb-3">Educational Purpose</h2>
          <p>All workouts, nutrition guides, and fitness content provided on FitCore are for educational and informational purposes only. The content is designed to support your fitness journey but should be adapted to your individual fitness level and health condition.</p>
        </RevealSection>

        <RevealSection delay={160}>
          <h2 className="font-heading text-xl font-bold text-primary mb-3">Not Medical Advice</h2>
          <p>FitCore is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before starting any new exercise or nutrition program, especially if you have pre-existing health conditions or injuries.</p>
        </RevealSection>

        <RevealSection delay={240}>
          <h2 className="font-heading text-xl font-bold text-primary mb-3">User Responsibility</h2>
          <p>You are responsible for your own fitness activities and for using the platform safely. FitCore is not liable for any injuries, health issues, or damages that may result from following the workouts, nutrition advice, or other content provided on the platform.</p>
        </RevealSection>

        <RevealSection delay={320}>
          <h2 className="font-heading text-xl font-bold text-primary mb-3">Changes to Terms</h2>
          <p>FitCore reserves the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms. We encourage you to review this page periodically.</p>
        </RevealSection>
      </div>
    </section>
  </Layout>
);

export default Terms;
