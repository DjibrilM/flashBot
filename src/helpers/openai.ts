const { Configuration, OpenAIApi } = require("openai");


export class openAi {
    async createMessage(prompt: string) {
        try {
            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: "Hello world" }],
            });
            console.log(completion.data.choices[0].message);

        } catch (error) {
            console.log(error.message);
            throw new Error("Internal server error !")
        }

    }
}