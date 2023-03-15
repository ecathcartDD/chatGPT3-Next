// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt missing" });
  }

  if (prompt.length > 100) {
    return res.status(400).json({ error: "Prompt too long" });
  }

  const completion = await openai.createCompletion({
    model: "text-curie-001",
    prompt: `"I want you to act as a song recommender. 
    I will provide you with a song and you will create a 
    playlist of 10 songs that are similar to the given song. 
    You should also provide a name for the playlist. 
    Do not choose songs that same name or artist. 
    Do not write any explanations or other words, just reply with 
    the playlist name, description and the songs. The song is ${prompt}"`,
    max_tokens: 500,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  const quote = completion.data.choices[0].text;

  return res.status(200).json({ quote });
}
