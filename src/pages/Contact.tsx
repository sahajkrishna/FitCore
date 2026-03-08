import { useState } from "react";
import Layout from "@/components/Layout";
import RevealSection from "@/components/RevealSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be under 1000 characters"),
});

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);
    // Simulate send
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", message: "" });
      toast({ title: "Message sent!", description: "We'll get back to you as soon as possible." });
    }, 1000);
  };

  return (
    <Layout>
      <section className="container max-w-3xl py-16 md:py-24">
        <RevealSection>
          <h1 className="font-heading text-4xl font-extrabold text-primary md:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Have a question, feedback, or need support? We'd love to hear from you. Reach out and our team will get back to you as soon as possible.
          </p>
        </RevealSection>

        <RevealSection delay={100}>
          <div className="mt-10 flex items-center gap-3 rounded-xl bg-accent/5 border border-accent/20 p-5">
            <Mail className="h-5 w-5 text-accent shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary">Email us directly</p>
              <a href="mailto:support@fitcore.app" className="text-sm text-accent hover:underline">support@fitcore.app</a>
            </div>
          </div>
        </RevealSection>

        <RevealSection delay={200}>
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5"
                maxLength={100}
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5"
                maxLength={255}
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1.5 min-h-[120px]"
                maxLength={1000}
              />
              <div className="flex justify-between mt-1">
                {errors.message ? <p className="text-xs text-destructive">{errors.message}</p> : <span />}
                <p className="text-xs text-muted-foreground">{form.message.length}/1000</p>
              </div>
            </div>
            <Button type="submit" variant="coral" size="lg" disabled={sending} className="w-full sm:w-auto">
              {sending ? "Sending…" : <>Send Message <Send className="h-4 w-4 ml-1" /></>}
            </Button>
          </form>
        </RevealSection>
      </section>
    </Layout>
  );
};

export default Contact;
