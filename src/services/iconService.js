import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { searchIconPrompt } from '../config/prompts.js';
import { icons } from '../utils/icons.js';

export class IconService {
    constructor(apiKey) {
        this.llm = new ChatOpenAI({
            model: "gpt-4o",
            temperature: 0.1,
            apiKey: apiKey,
            modelKwargs: { response_format: { type: "json_object" } }
        });
    }

    async selectIcon(recipe) {
        const emojiResponse = await this.llm.invoke(searchIconPrompt(JSON.stringify(recipe)));

        const parserEmoji = new JsonOutputParser(); // Crea un parser per estrarre il JSON dalla risposta dell'LLM
        const emojiNameResult = await parserEmoji.invoke(emojiResponse.content);
        const iconsArray = icons;
        const selectedIcon = iconsArray.find(icon => icon.name === emojiNameResult.name);

        return selectedIcon;
    }
}