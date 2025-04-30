import {
  ChatCompletionMessageParam,
  CreateMLCEngine,
  MLCEngine,
  prebuiltAppConfig,
} from "@mlc-ai/web-llm";
import { v4 as uuidv4 } from "uuid";

import { LlmConfig } from "../utils/settings/constants.ts";

const EVENT_KEY = "messagesChange";

console.log(
  prebuiltAppConfig.model_list
    .map((m) => m.model_id)
    .filter((id) => id.toLowerCase().includes("qwen"))
);

export type Message = ChatCompletionMessageParam & {
  id: string;
  processing?: boolean;
};

export type Conversation = {
  generate: (
    prompt: string,
    temperature?: number,
    onEngineReady?: () => void,
    role?: "user" | "tool"
  ) => Promise<string>;
};

class WebLLM extends EventTarget {
  private engine: MLCEngine | null = null;
  private model: LlmConfig | null = null;
  private _messages: Array<Message> = [];

  public get messages() {
    return this._messages;
  }

  public set messages(messages: Array<Message>) {
    this._messages = messages;
    this.dispatchEvent(new Event(EVENT_KEY));
  }

  public onMessagesChange = (callback: (log: Array<Message>) => void) => {
    const listener = () => {
      callback(this.messages);
    };
    this.addEventListener(EVENT_KEY, listener);
    return () => this.removeEventListener(EVENT_KEY, listener);
  };

  public setModel = (model: LlmConfig) => {
    this.model = model;
    this.engine = null;
  };

  public createConversation = (systemPrompt: string): Conversation => {
    if (!this.model) {
      console.error("Model not set");
      throw new Error("Model not set");
    }

    this.messages = [
      {
        role: "system",
        content: systemPrompt,
        id: uuidv4(),
      },
    ];

    console.log("-- SYSTEM PROMPT --");
    console.log(systemPrompt);

    return {
      generate: async (
        prompt: string,
        temperature: number = 0,
        onEngineReady: () => void = () => {},
        role = "user"
      ) => {
        const userId = uuidv4();

        if (role === "tool") {
          this.messages.push({
            role: "tool",
            content: prompt,
            id: userId,
            tool_call_id: uuidv4(),
          });
        } else {
          this.messages.push({
            role: "user",
            content: prompt,
            id: userId,
          });
        }
        console.log("-- MESSAGES --");
        console.log(this.messages);

        if (!this.engine) {
          console.log("Creating engine:", this.model);
          if (typeof this.model === "string") {
            this.engine = await CreateMLCEngine(this.model, {
              initProgressCallback: console.log,
            });
          } else if (this.model) {
            this.engine = await CreateMLCEngine(this.model.model_id, {
              initProgressCallback: console.log,
              appConfig: {
                model_list: [this.model],
              },
            });
          } else {
            throw new Error("Model not set");
          }
        }
        onEngineReady();
        const id = uuidv4();

        const chunks = await this.engine.chat.completions.create({
          messages: this.messages.map((m) => ({
            role:
              m.role === "system"
                ? "system"
                : m.role === "assistant"
                  ? "assistant"
                  : "user",
            content: m.content as string,
          })),
          temperature,
          stream: true,
          stream_options: {
            include_usage: true,
          },
        });

        this.messages.push({
          role: "assistant",
          content: "",
          id,
        });

        let reply = "";
        for await (const chunk of chunks) {
          reply += chunk.choices[0]?.delta.content || "";
          this.messages = this.messages.map((m) => {
            if (m.id === id) {
              return {
                ...m,
                content: reply,
              };
            } else {
              return m;
            }
          });
        }

        this.messages = this.messages.map((m) => {
          if (m.id === id) {
            return {
              ...m,
              content: reply,
            };
          } else {
            return m;
          }
        });
        return reply;
      },
    };
  };
}

export default WebLLM;
