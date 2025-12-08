import { OpenRouter } from "@openrouter/sdk";
import dotenv from "dotenv";

dotenv.config();
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTERAI_KEY,
});

// Stream the response to get reasoning tokens in usage
const stream = await openrouter.chat.send({
  model: "amazon/nova-2-lite-v1:free",
  messages: [
    {
      role: "user",
      content:
        "If I gave you some information about my workout exercises in json format,will you be able to evaluate it and give me suggestions",
    },
  ],
  stream: true,
  streamOptions: {
    includeUsage: true,
  },
});

let response = "";
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    response += content;
    process.stdout.write(content);
  }

  // Usage information comes in the final chunk
  if (chunk.usage) {
    console.log("\nReasoning tokens:", chunk.usage.reasoningTokens);
  }
}
