import type { ModelInfo, OllamaApiResponse, OllamaModel } from './types';
import type { ProviderInfo } from '~/types/model';

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;
export const MODIFICATIONS_TAG_NAME = 'bolt_file_modifications';
export const MODEL_REGEX = /^\[Model: (.*?)\]\n\n/;
export const PROVIDER_REGEX = /\[Provider: (.*?)\]\n\n/;
export const DEFAULT_MODEL = 'qwen2.5-coder:0.5b';

const PROVIDER_LIST: ProviderInfo[] = [
  {
    name: 'Ollama',
    staticModels: [],
    getDynamicModels: getOllamaModels,
    getApiKeyLink: "https://ollama.com/download",
    labelForGetApiKey: "Download Ollama",
    icon: "i-ph:cloud-arrow-down",
    botName: 'FinBot'
  }
];

export const DEFAULT_PROVIDER = PROVIDER_LIST[0];

const staticModels: ModelInfo[] = PROVIDER_LIST.map(p => p.staticModels).flat();

export let MODEL_LIST: ModelInfo[] = [...staticModels];

const getOllamaBaseUrl = () => {
  const defaultBaseUrl = import.meta.env.OLLAMA_API_BASE_URL || 'http://localhost:11434';
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    // Frontend always uses localhost
    return defaultBaseUrl;
  }

  // Backend: Check if we're running in Docker
  const isDocker = process.env.RUNNING_IN_DOCKER === 'true';

  return isDocker
    ? defaultBaseUrl.replace('localhost', 'host.docker.internal')
    : defaultBaseUrl;
};

async function getOllamaModels(): Promise<ModelInfo[]> {
  try {
    const base_url = getOllamaBaseUrl();
    const response = await fetch(`${base_url}/api/tags`);
    const data = await response.json() as OllamaApiResponse;

    return data.models.map((model: OllamaModel) => ({
      name: model.name,
      label: `${model.name} (${model.details.parameter_size})`,
      provider: 'Ollama'
    }));
  } catch (e) {
    return [];
  }
}

async function getOpenAILikeModels(): Promise<ModelInfo[]> {
  try {
    const base_url = import.meta.env.OPENAI_LIKE_API_BASE_URL || '';
    if (!base_url) {
      return [];
    }
    const api_key = import.meta.env.OPENAI_LIKE_API_KEY ?? '';
    const response = await fetch(`${base_url}/models`, {
      headers: {
        Authorization: `Bearer ${api_key}`
      }
    });
    const res = await response.json() as any;
    return res.data.map((model: any) => ({
      name: model.id,
      label: model.id,
      provider: 'OpenAILike'
    }));
  } catch (e) {
    return [];
  }
}

type OpenRouterModelsResponse = {
  data: {
    name: string;
    id: string;
    context_length: number;
    pricing: {
      prompt: number;
      completion: number;
    }
  }[]
};

async function getOpenRouterModels(): Promise<ModelInfo[]> {
  const data: OpenRouterModelsResponse = await (await fetch('https://openrouter.ai/api/v1/models', {
    headers: {
      'Content-Type': 'application/json'
    }
  })).json();

  return data.data.sort((a, b) => a.name.localeCompare(b.name)).map(m => ({
    name: m.id,
    label: `${m.name} - in:$${(m.pricing.prompt * 1_000_000).toFixed(
      2)} out:$${(m.pricing.completion * 1_000_000).toFixed(2)} - context ${Math.floor(
      m.context_length / 1000)}k`,
    provider: 'OpenRouter'
  }));
}

async function getLMStudioModels(): Promise<ModelInfo[]> {
  try {
    const base_url = import.meta.env.LMSTUDIO_API_BASE_URL || 'http://localhost:1234';
    const response = await fetch(`${base_url}/v1/models`);
    const data = await response.json() as any;
    return data.data.map((model: any) => ({
      name: model.id,
      label: model.id,
      provider: 'LMStudio'
    }));
  } catch (e) {
    return [];
  }
}



async function initializeModelList(): Promise<ModelInfo[]> {
  MODEL_LIST = [...(await Promise.all(
    PROVIDER_LIST
      .filter((p): p is ProviderInfo & { getDynamicModels: () => Promise<ModelInfo[]> } => !!p.getDynamicModels)
      .map(p => p.getDynamicModels())))
    .flat(), ...staticModels];
  return MODEL_LIST;
}

export { getOllamaModels, getOpenAILikeModels, getLMStudioModels, initializeModelList, getOpenRouterModels, PROVIDER_LIST };
