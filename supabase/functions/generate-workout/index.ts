import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VALID_LEVELS = ["beginner", "intermediate", "advanced"];

function errorResponse(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    // --- Authentication ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse(401, "Unauthorized");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !data?.claims) {
      return errorResponse(401, "Unauthorized");
    }

    // --- Premium Subscription Check ---
    const userId = data.claims.sub as string;
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .eq("subscription_status", "active")
      .gte("subscription_end_date", new Date().toISOString())
      .limit(1)
      .single();
    if (!sub) {
      return errorResponse(403, "Premium subscription required");
    }

    // --- Input Validation ---
    const body = await req.json();
    const { goal, level, daysPerWeek } = body;

    if (!goal || typeof goal !== "string" || goal.trim().length === 0 || goal.length > 500) {
      return errorResponse(400, "Invalid goal: must be a non-empty string up to 500 characters");
    }

    if (!level || !VALID_LEVELS.includes(level)) {
      return errorResponse(400, `Invalid level: must be one of ${VALID_LEVELS.join(", ")}`);
    }

    const days = Number(daysPerWeek);
    if (!Number.isInteger(days) || days < 1 || days > 7) {
      return errorResponse(400, "Invalid daysPerWeek: must be an integer between 1 and 7");
    }

    const sanitizedGoal = goal.trim().slice(0, 500);

    // --- AI Generation ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert fitness coach. Create a personalized weekly workout plan. Be specific with exercises, sets, reps, rest times, and estimated duration. Include rest days. Add a short motivational tip for each workout day.`;

    const userPrompt = `Create a ${days}-day per week workout plan for someone with the following:
- Fitness goal: ${sanitizedGoal}
- Experience level: ${level}
- Workout days per week: ${days}

Fill all 7 days of the week. Mark non-workout days as rest days.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "create_workout_plan",
                description: "Return a structured weekly workout plan.",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Name of the workout plan" },
                    summary: { type: "string", description: "Brief motivational summary of the plan (1-2 sentences)" },
                    days: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          day: { type: "string", description: "Day name e.g. Monday" },
                          isRestDay: { type: "boolean" },
                          focus: { type: "string", description: "Workout focus e.g. Upper Body, Cardio, Rest & Recovery" },
                          duration: { type: "string", description: "Estimated duration e.g. 45 min" },
                          motivationalTip: { type: "string", description: "Short motivational message for this day" },
                          exercises: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                name: { type: "string" },
                                sets: { type: "string" },
                                reps: { type: "string" },
                                rest: { type: "string", description: "Rest between sets e.g. 60s" },
                              },
                              required: ["name", "sets", "reps", "rest"],
                              additionalProperties: false,
                            },
                          },
                        },
                        required: ["day", "isRestDay", "focus", "duration", "motivationalTip", "exercises"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["title", "summary", "days"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "create_workout_plan" } },
        }),
      }
    );

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return errorResponse(429, "Rate limited");
      if (status === 402) return errorResponse(402, "Payment required");
      const t = await response.text();
      console.error("AI error:", status, t);
      return errorResponse(500, "AI error");
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return errorResponse(500, "No plan generated");
    }

    const plan = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-workout error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
