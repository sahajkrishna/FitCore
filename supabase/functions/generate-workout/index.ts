import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { goal, level, daysPerWeek } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert fitness coach. Create a personalized weekly workout plan. Be specific with exercises, sets, reps, rest times, and estimated duration. Include rest days. Add a short motivational tip for each workout day.`;

    const userPrompt = `Create a ${daysPerWeek}-day per week workout plan for someone with the following:
- Fitness goal: ${goal}
- Experience level: ${level}
- Workout days per week: ${daysPerWeek}

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
      if (status === 429)
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (status === 402)
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const t = await response.text();
      console.error("AI error:", status, t);
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No plan generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const plan = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-workout error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
