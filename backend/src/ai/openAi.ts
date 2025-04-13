import OpenAI from 'openai';
import { z } from 'zod';

type GenerateResponseParams = {
  input: string;
  instructions?: string;
  model?: string;
  apiKey?: string;
};

const ArticleSummarySchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string())
});

type ArticleSummary = z.infer<typeof ArticleSummarySchema>;

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

export async function getParsedOpenApiSummaryResponse<T>({
    input,
    instructions
}: GenerateResponseParams) : Promise<ArticleSummary | null> {
    try {
        let responseText = await generateOpenAiResponse({input: input, instructions: instructions});
        const result = responseText.substring(responseText.indexOf('{'), responseText.indexOf('}') + 1);
        if(!result){
            return null;
        }

        const parsedResponse = JSON.parse(result);
        const validatedData = ArticleSummarySchema.parse(parsedResponse);
        return validatedData;
   } catch(error){
        if (error instanceof Error) {
            console.log("Error parsing response", error.message);
        } else {
            console.log("Unknown error parsing response");
        }
        return null;
   }
}