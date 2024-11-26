
## Run

1. Install dependencies using Terminal (or CMD in Windows with admin permissions):

```
pnpm install
```

If you get an error saying "command not found: pnpm" or similar, then that means pnpm isn't installed. You can install it via this:

```
sudo npm install -g pnpm
```

2. Start the application with the command:

```bash
pnpm run dev
```

## Super Important Note on Running Ollama Models

Ollama models by default only have 2048 tokens for their context window. Even for large models that can easily handle way more.
This is not a large enough window to handle the FinBolt/oTToDev prompt! You have to create a version of any model you want
to use where you specify a larger context window. Luckily it's super easy to do that.

All you have to do is:

- Create a file called "Modelfile" (no file extension) anywhere on your computer
- Put in the two lines:

```
FROM [Ollama model ID such as qwen2.5-coder:7b]
PARAMETER num_ctx 32768
```

- Run the command: 

```
ollama create -f Modelfile [your new model ID, can be whatever you want (example: qwen2.5-coder-extra-ctx:7b)]
```

Now you have a new Ollama model that isn't heavily limited in the context length like Ollama models are by default for some reason.
You'll see this new model in the list of Ollama models along with all the others you pulled!

## Adding New LLMs:

To make new LLMs available to use in this version of FinBolt, head on over to `app/utils/constants.ts` and find the constant MODEL_LIST. Each element in this array is an object that has the model ID for the name (get this from the provider's API documentation), a label for the frontend model dropdown, and the provider. 

By default, Anthropic, OpenAI, Groq, and Ollama are implemented as providers, but the YouTube video for this repo covers how to extend this to work with more providers if you wish!

When you add a new model to the MODEL_LIST array, it will immediately be available to use when you run the app locally or reload it. For Ollama models, make sure you have the model installed already before trying to use it here!

## Available Scripts

- `pnpm run dev`: Starts the development server.
- `pnpm run build`: Builds the project.
- `pnpm run start`: Runs the built application locally using Wrangler Pages. This script uses `bindings.sh` to set up necessary bindings so you don't have to duplicate environment variables.
- `pnpm run preview`: Builds the project and then starts it locally, useful for testing the production build. Note, HTTP streaming currently doesn't work as expected with `wrangler pages dev`.
- `pnpm test`: Runs the test suite using Vitest.
- `pnpm run typecheck`: Runs TypeScript type checking.
- `pnpm run typegen`: Generates TypeScript types using Wrangler.
- `pnpm run deploy`: Builds the project and deploys it to Cloudflare Pages.

## Development

To start the development server:

```bash
pnpm run dev
```

This will start the Remix Vite development server. You will need Google Chrome Canary to run this locally if you use Chrome! It's an easy install and a good browser for web development anyway.

