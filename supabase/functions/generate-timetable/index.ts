
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { nanoid } from "https://esm.sh/nanoid@5.0.4";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { constraints, constraintId } = await req.json();
    console.log("Received constraints for AI timetable generation:", constraints);

    // Format the prompt for GPT
    const prompt = `
      Generate a timetable with the following constraints:
      - Institution type: ${constraints.institutionType}
      - Operating days: ${constraints.operatingDays}
      - Daily hours: ${constraints.startTime} to ${constraints.endTime}
      - Break periods: ${JSON.stringify(constraints.breakPeriods)}
      - Subjects (with lecture count and duration): ${JSON.stringify(constraints.subjects)}
      
      Create 3 different timetable options that respect all constraints. 
      For each option, provide a list of class blocks with:
      - Subject ID
      - Day of the week
      - Start time (HH:MM format)
      - End time (HH:MM format)
      - Faculty 
      - Room
      
      Format the response as a JSON object with this structure:
      {
        "options": [
          {
            "name": "Timetable Option 1",
            "blocks": [
              { 
                "subjectId": "subject-id",
                "day": "Monday", 
                "startTime": "09:00", 
                "endTime": "10:30",
                "faculty": "Dr. Smith",
                "room": "Room 101"
              },
              ...more blocks
            ]
          },
          ...more options
        ]
      }
      
      Ensure there are no time conflicts between classes and breaks.
      Ensure end times are calculated based on the subject duration.
      Do not include any explanations, just return the JSON object.
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a timetable generation assistant that creates optimized class schedules based on constraints.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData?.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("OpenAI response received");
    
    let parsedOptions;
    try {
      // Parse the response from OpenAI which should be JSON
      const content = data.choices[0].message.content;
      // Find JSON content (in case there's additional text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      
      const parsedContent = JSON.parse(jsonContent);
      parsedOptions = parsedContent.options;
      
      // Add IDs to each option and block
      parsedOptions = parsedOptions.map(option => ({
        ...option,
        id: nanoid(),
        blocks: option.blocks.map(block => ({
          ...block,
          id: nanoid()
        }))
      }));
      
      console.log("Successfully processed AI timetable options");
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.error("Raw content:", data.choices[0].message.content);
      throw new Error("Failed to parse the AI response into valid timetable options");
    }

    return new Response(JSON.stringify({ options: parsedOptions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-timetable function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
