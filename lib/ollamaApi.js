import dotenv from "dotenv";

const env = process.env.NODE_ENV || 'dev';
dotenv.config({path: `./.env.${env}`});
const OLLAMA_BASE_PATH = process.env.OLLAMA_BASE_PATH;

export default class OllamaApi {
    constructor(baseUrl = OLLAMA_BASE_PATH) {
        this.baseUrl = baseUrl;
        this.model = 'hf.co/elyza/Llama-3-ELYZA-JP-8B-GGUF';
    }

    async* streamGenerate(prompt, model) {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model, prompt })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, {stream: true});
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim()) {
                        const data = JSON.parse(line);
                        yield data;
                    }
                }
            }
        } catch (error) {
            throw new Error(`Generate request failed: ${error.message}`);
        }
    }

    async generate(prompt) {
        let fullResponse = '';
        const model = this.model;
        for await (const chunk of this.streamGenerate(prompt, model)) {
            fullResponse += chunk.response;
        }
        return { response: fullResponse };
    }

}