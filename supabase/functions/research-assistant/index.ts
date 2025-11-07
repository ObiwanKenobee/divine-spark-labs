import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, searchQuery } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing research assistant request with", messages.length, "messages");

    const systemPrompt = `You are an AI Research Assistant for The Joseph-Marie Foundation (JMF). Your role is to help users explore and discover JMF's resources, research papers, projects, and initiatives.

Key Focus Areas:
- Divine Innovation: The intersection of faith, science, and technology
- Ethical AI Development: AI systems guided by moral principles and divine wisdom
- Research Initiatives: Studies on consciousness, ethical frameworks, and technological advancement
- Fellowship Programs: Supporting researchers working on divine innovation projects
- Publications: Research papers on ethics, AI, consciousness, and technology

Your Capabilities:
1. Search & Discovery: Help users find relevant papers, projects, and resources
2. Intelligent Recommendations: Suggest related research based on user interests
3. Project Exploration: Guide users through JMF's various initiatives
4. Resource Navigation: Connect users to appropriate materials and programs
5. Topic Synthesis: Explain complex concepts in divine innovation and ethical AI

Response Guidelines:
- Be scholarly yet accessible
- Provide specific resource recommendations when possible
- Connect concepts across different JMF initiatives
- Encourage deeper exploration of related topics
- Cite relevant research areas and fellowship opportunities
- Maintain focus on the intersection of faith, science, and technology

When users ask about specific topics, provide:
- Overview of relevant JMF research in that area
- Recommended reading materials or projects
- Related fellowship opportunities if applicable
- Key researchers or thought leaders in the field
- Next steps for deeper engagement`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Research assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
