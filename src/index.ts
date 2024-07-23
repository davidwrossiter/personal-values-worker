import { Hono } from 'hono';
import { cors } from 'hono/cors';
import OpenAI from 'openai';

export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "AI" with the variable name you defined.
	AI: Ai;
	OPENAI_API_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use(cors());

app.post(
	'/upload',

	async (c) => {
		const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY });

		console.log('req opened');
		const body: any = await c.req.json();
		const words = body.words;
		console.log(words);
		// console.log(c.env.OPENAI_API_KEY);

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: `The following is a list of personal values, please group the words from the list by similarity. Give each
 					group a title (THAT IS STRICTLY ONE WORD LONG) that represents the group's theme but is not one of the words in the group and is not the word "values".
					Only use words from the provided list. Do Not repeat words in multiple groups. Keep the number of groups between 4 and 6. LIST OF WORDS: ${words}. Your response
					must look like this : ### Title \n - Word \n - Word \n - Word \n ### Title \n - Word \n - Word \n - Word \n Word
					STRICTLY DO NOT RETURN ANYTHING ELSE APART FROM THE GROUPS AND CONTAINED WORDS.`,
				},
			],
			model: 'gpt-4o',
		});

		console.log(completion.choices[0].message.content);
		return c.json({ response: completion.choices[0].message.content });
	}
);

export default app;

// const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY });

// 		console.log('req opened');
// 		const body: any = await c.req.json();
// 		const words = body.words;
// 		console.log(c.env.OPENAI_API_KEY);

// 		const completion = await openai.chat.completions.create({
// 			messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
// 			model: 'gpt-4o-mini',
// 		});

// 		console.log(completion.choices[0]);
// 		return c.json({ body: completion.choices[0].message.content });

// prompt:
// `Please group the words from the list by similarity. Give each
//  					group a title (THAT IS STRICTLY ONE WORD LONG) that represents the group's theme but is not one of the words in the group.
// 					Only use words from the provided list. Do Not repeat words in multiple groups. Keep the number of groups between 4 and 6. LIST OF WORDS: ${words}. Your response
// 					must look like this : ### Title \n - Word \n - Word \n - Word \n ### Title \n - Word \n - Word \n - Word \n Word
// 					STRICTLY DO NOT RETURN ANYTHING ELSE APART FROM THE GROUPS AND CONTAINED WORDS.`
