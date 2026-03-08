import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Dumbbell, Loader2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import RevealSection from "@/components/RevealSection";
import heroPricingImg from "@/assets/hero-pricing.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started with the essentials",
    icon: Dumbbell,
    highlighted: false,
    features: [
      "Access workout library",
      "Limited nutrition guides",
      "Save workouts to your profile",
      "Basic workout tracking",
      "Community support",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    isPremiumPlan: false,
  },
  {
    name: "Premium",
    price: "₹499",
    period: "/month",
    description: "Unlock your full potential",
    icon: Zap,
    highlighted: true,
    features: [
      "Full structured workout programs",
      "Workout progress analytics",
      "Advanced nutrition guides",
      "Priority access to new content",
      "Personalized recommendations",
      "Ad-free experience",
      "Priority support",
    ],
    cta: "Upgrade to Premium",
    ctaVariant: "coral" as const,
    isPremiumPlan: true,
  },
];

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Pricing = () => {
  const { user } = useAuth();
  const { isPremium } = usePremiumStatus();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isPremium) {
      toast({ title: "Already Premium", description: "You're already on the Premium plan!" });
      return;
    }

    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast({ title: "Error", description: "Failed to load payment gateway.", variant: "destructive" });
        return;
      }

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await supabase.functions.invoke("create-razorpay-order", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.error || !res.data?.order_id) {
        toast({ title: "Error", description: "Could not create order. Please try again.", variant: "destructive" });
        return;
      }

      const { order_id, key_id, amount, currency } = res.data;

      const options = {
        key: key_id,
        amount,
        currency,
        name: "FitCore",
        description: "Premium Plan — ₹499/month",
        order_id,
        handler: async (response: any) => {
          const verifyRes = await supabase.functions.invoke("verify-razorpay-payment", {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            headers: { Authorization: `Bearer ${token}` },
          });

          if (verifyRes.error || !verifyRes.data?.success) {
            toast({ title: "Verification Failed", description: "Payment could not be verified.", variant: "destructive" });
          } else {
            toast({ title: "🎉 Welcome to Premium!", description: "Your subscription is now active." });
            setTimeout(() => navigate("/dashboard"), 1500);
          }
        },
        prefill: { email: user.email },
        theme: { color: "#ff6b6b" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast({ title: "Payment Failed", description: "Please try again.", variant: "destructive" });
      });
      rzp.open();
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHero
        image={heroPricingImg}
        headline="Unlock Your Full Fitness Potential"
        description="Upgrade to premium and access advanced workout programs and personalized fitness tools."
        ctaLabel="Upgrade to Premium"
        ctaHref="#plans"
      />

      <section className="container -mt-10 pb-20 md:-mt-14">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {plans.map((plan, i) => (
            <RevealSection key={plan.name} delay={i * 150}>
            <div
              className={`relative flex flex-col rounded-2xl bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover ${
                plan.highlighted
                  ? "ring-2 ring-accent scale-[1.02] md:scale-105"
                  : "border border-border/60"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground px-4 py-1 text-xs font-semibold shadow-md">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    plan.highlighted ? "bg-accent/10" : "bg-primary/5"
                  }`}
                >
                  <plan.icon
                    className={`h-5 w-5 ${plan.highlighted ? "text-accent" : "text-primary"}`}
                  />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="font-heading text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.highlighted ? "text-accent" : "text-success"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.isPremiumPlan ? (
                <Button
                  variant={plan.ctaVariant}
                  size="lg"
                  className="w-full"
                  onClick={handleUpgrade}
                  disabled={loading || isPremium}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                  ) : isPremium ? (
                    "✓ You're Premium"
                  ) : (
                    plan.cta
                  )}
                </Button>
              ) : (
                <Button variant={plan.ctaVariant} size="lg" className="w-full" asChild>
                  <a href="/signup">{plan.cta}</a>
                </Button>
              )}
            </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <RevealSection>
      <section className="container pb-20">
        <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">Compare Plans</h2>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 text-left font-heading font-semibold text-foreground">Feature</th>
                <th className="p-4 text-center font-heading font-semibold text-foreground">Free</th>
                <th className="p-4 text-center font-heading font-semibold text-accent">Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Workout Library", true, true],
                ["Save Workouts", true, true],
                ["Basic Nutrition Guides", true, true],
                ["Workout Tracking", true, true],
                ["Structured Programs", false, true],
                ["Progress Analytics", false, true],
                ["AI Workout Generator", false, true],
                ["Premium Nutrition Guides", false, true],
                ["Priority Support", false, true],
                ["Ad-Free Experience", false, true],
              ].map(([feature, free, premium]) => (
                <tr key={feature as string} className="border-b border-border/50 last:border-0">
                  <td className="p-4 text-foreground/80">{feature as string}</td>
                  <td className="p-4 text-center">
                    {free ? <Check className="mx-auto h-4 w-4 text-success" /> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="p-4 text-center">
                    {premium ? <Check className="mx-auto h-4 w-4 text-accent" /> : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </RevealSection>

      <RevealSection>
      <section className="border-t border-border bg-muted/30">
        <div className="container py-16 text-center">
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">
            Questions about pricing?
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            We're here to help. Reach out to our team and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>
      </RevealSection>
    </Layout>
  );
};

export default Pricing;
