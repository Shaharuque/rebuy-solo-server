import { RequestHandler } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: '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',
});

const openAIText: RequestHandler = async (req, res) => {
  const { prompt, model } = req.body;
  try {
    const completion = await openai.completions.create({
        model: model,
        prompt: prompt,
        max_tokens: 100,
      });

    return res.status(200).json(completion.choices[0].text);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    } else {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  }
};

export default openAIText;
