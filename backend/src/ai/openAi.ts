import OpenAI from 'openai';
import { z } from 'zod';

type GenerateResponseParams = {
  input: string;
  instructions?: string;
  model?: string;
  apiKey?: string;
};

// Define schema for a single article summary
const ArticleSummarySchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string())
});

// Define schema for an array of article summaries
const ArticleSummariesSchema = z.array(ArticleSummarySchema);

type ArticleSummary = z.infer<typeof ArticleSummarySchema>;
type ArticleSummaries = z.infer<typeof ArticleSummariesSchema>;

export async function generateOpenAiResponse({
    input,
    instructions,
    model = 'gpt-4o-mini',
    apiKey = process.env.OPEN_AI_API_KEY,
}: GenerateResponseParams) {

    const openAiClient = new OpenAI({apiKey: apiKey,});

     const requestParams = {
        input,
        instructions,
        model,
     };

     try{
         const response = await openAiClient.responses.create(requestParams);
         return response.output_text;
     } catch (error) {
           console.error('Error making request to OpenAi:', error);
           throw error;
     }
}

export async function getParsedOpenApiSummaryResponse({
    input,
    instructions
}: GenerateResponseParams) : Promise<ArticleSummaries | null> {
    try {
        let responseText = await generateOpenAiResponse({input: input, instructions: instructions});
        const result = responseText.substring(responseText.indexOf('['), responseText.lastIndexOf(']') + 1);
        console.log("res", result);
        if(!result){
            return null;
        }

        const parsedResponse = JSON.parse(result);
        // Validate the entire array of summaries
        const validatedData = ArticleSummariesSchema.parse(parsedResponse);
        return validatedData;
   } catch(error){
        if (error instanceof z.ZodError) {
            console.log("Validation error:", error.errors);
        } else if (error instanceof Error) {
            console.log("Error parsing response:", error.message);
        } else {
            console.log("Unknown error parsing response");
        }
        return null;
   }
}