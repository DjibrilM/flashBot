import { OpenAI } from "openai";

export class openAiHelper {
    async createMessage(prompt: string) {
        try {

            const openai = new OpenAI({
                apiKey: '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'
            });
            
            openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                max_tokens: 3000,
                temperature: 0,
                messages: [{ role: "user", content: prompt }],
            });

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                max_tokens: 3000,
                temperature: 0,
                messages: [{ role: "user", content: prompt }],
            });

            return completion.choices[0].message;
        } catch (error) {
            console.log(error);
            throw new Error("Failed to reach openai chack your api-key");
        }

    }
}