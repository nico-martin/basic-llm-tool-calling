import formatBytes from "../formatBytes.ts";

export const SETTINGS_KEY = "function-calling-demo";
export const CACHED_LLMS_SETTINGS_KEY = "function-calling-demo-llms";

export enum Llm {
  GEMMA2_2B,
  GEMMA2_9B,
  SMOLLM2_1_7,
  SMOLLM2_360,
  SMOLLM2_135,
  QWEN25_0_5,
  QWEN25_1_5,
  QWEN25_3,
}

export interface Settings {
  llm: Llm;
  systemPrompt: string;
  maxRounds: number;
  temperature: number;
  filterDuplicateFunctionCalls: boolean;
}

export const defaultSettings: Settings = {
  llm: Llm.QWEN25_1_5,
  systemPrompt: "You are a helpful AI Assistant",
  maxRounds: 5,
  temperature: 0,
  filterDuplicateFunctionCalls: true,
};

export type LlmConfigString = string;

export interface LlmConfigObject {
  model: string;
  model_id: string;
  model_lib: string;
}

export type LlmConfig = LlmConfigString | LlmConfigObject;

const llmIsCached = (llm: Llm) => getLlmCached().includes(llm);

export const setLlmCached = (key: Llm) => {
  const item = getLlmCached();
  if (!item.includes(key)) {
    item.push(key);
  }
  window.localStorage.setItem(CACHED_LLMS_SETTINGS_KEY, JSON.stringify(item));
};

export const getLlmCached = (): Array<Llm> => {
  const item = window.localStorage.getItem(CACHED_LLMS_SETTINGS_KEY);
  return item ? JSON.parse(item) : [];
};

export interface LlmConfigElement {
  label: string;
  cached: boolean;
  size: number;
  model: LlmConfig;
  group: string;
}

export const LLM_CONFIG: Record<Llm, LlmConfigElement> = Object.entries({
  [Llm.GEMMA2_2B]: {
    size: 1477070487,
    model: "gemma-2-2b-it-q4f16_1-MLC",
    cached: llmIsCached(Llm.GEMMA2_2B),
    label: "Gemma2 2B q4f16",
    group: "Gemma2",
  },
  [Llm.SMOLLM2_1_7]: {
    size: 970919274,
    model: "SmolLM2-1.7B-Instruct-q4f16_1-MLC",
    cached: llmIsCached(Llm.SMOLLM2_1_7),
    label: "SmolLM2 1.7B q4f16",
    group: "SmolLM",
  },
  [Llm.SMOLLM2_360]: {
    size: 210861736,
    model: "SmolLM2-360M-Instruct-q4f16_1-MLC",
    cached: llmIsCached(Llm.SMOLLM2_360),
    label: "SmolLM2 360M q4f16",
    group: "SmolLM",
  },
  [Llm.SMOLLM2_135]: {
    size: 275938201,
    model: "SmolLM2-135M-Instruct-q0f16-MLC",
    cached: llmIsCached(Llm.SMOLLM2_135),
    label: "SmolLM2 135M q4f16",
    group: "SmolLM",
  },
  [Llm.QWEN25_0_5]: {
    size: 289238166,
    model: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
    cached: llmIsCached(Llm.QWEN25_0_5),
    label: "Qwen1.5 0.5B IT q4f16",
    group: "Qwen",
  },
  [Llm.QWEN25_1_5]: {
    size: 884354432,
    model: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
    cached: llmIsCached(Llm.QWEN25_1_5),
    label: "Qwen1.5 1.5B IT q4f16",
    group: "Qwen",
  },
  [Llm.QWEN25_3]: {
    size: 1749977890,
    model: "Qwen2.5-3B-Instruct-q4f16_1-MLC",
    cached: llmIsCached(Llm.QWEN25_3),
    label: "Qwen1.5 3B IT q4f16",
    group: "Qwen",
  },
  [Llm.GEMMA2_9B]: {
    size: 4677059380,
    model: {
      model: "https://uploads.nico.dev/mlc-llm-libs/gemma-2-9b-it_q4f16_MLC/",
      model_id: "nicos-gemma2-9B",
      model_lib:
        "https://uploads.nico.dev/mlc-llm-libs/gemma-2-9b-it_q4f16_MLC/lib/gemma-2-9b-it-q4f16_1-webgpu.wasm",
    },
    cached: llmIsCached(Llm.GEMMA2_9B),
    label: "Gemma2 9B q4f16",
    group: "Gemma2",
  },
}).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: {
      ...value,
      label:
        value.label +
        ` (${formatBytes(value.size) + (value.cached ? " - cached" : "")})`,
    },
  }),
  {} as Record<Llm, LlmConfigElement>
);
