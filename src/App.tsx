import { Cog6ToothIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import React, { FormEvent } from "react";
import { z } from "zod";

import Agent from "./ai/Agent.ts";
import About from "./app/About.tsx";
import Message from "./app/Message.tsx";
import SettingsModal from "./app/SettingsModal.tsx";
import SettingsContextProvider from "./store/SettingsContextProvider.tsx";
import useSettings from "./store/useSettings.ts";
import { Loader } from "./theme";
import tool from "./utils/agent/tool.ts";
import { LLM_CONFIG } from "./utils/settings/constants.ts";

const App: React.FC = () => {
  const promptRef = React.useRef<HTMLInputElement>(null);
  const [thinking, setThinking] = React.useState<boolean>(false);
  const { settings } = useSettings();
  const [settingsModalOpen, setSettingsModalOpen] =
    React.useState<boolean>(false);
  const [loadingEngine, setLoadingEngine] = React.useState<boolean>(false);
  const listRef = React.useRef<HTMLUListElement>(null);
  const messagesLengthRef = React.useRef<number>(0);

  const agent = React.useMemo(() => {
    const agent = new Agent();
    agent.addTool(
      "getWeather",
      tool({
        description: "Get the weather in a location",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = 72 + Math.floor(Math.random() * 21) - 10;
          const weather = "sunny";
          return `Tell the user the temperature in ${location} is ${temperature} degrees and the weather is ${weather}`;
        },
        examples: [
          {
            query: "Whats the weather in Bern?",
            parameters: {
              location: "Bern",
            },
          },
          {
            query: "I am in London right now. Do I need an Umbrella?",
            parameters: {
              location: "London",
            },
          },
        ],
      })
    );

    agent.addTool(
      "searchFlights",
      tool({
        description: "Search for flights between two locations on a given date",
        parameters: z.object({
          from: z.string().describe("The departure city"),
          to: z.string().describe("The destination city"),
          date: z
            .string()
            .describe("The date of the flight in YYYY-MM-DD format"),
        }),
        execute: async ({ from, to, date }) => {
          const airlines = ["SkyJet", "FlyFast", "AirNico", "GlobalWings"];
          const airline = airlines[Math.floor(Math.random() * airlines.length)];
          const price = 80 + Math.floor(Math.random() * 300);
          const time = `${8 + Math.floor(Math.random() * 10)}:${Math.random() > 0.5 ? "00" : "30"}`;
          return `Tell the user you found a flight from ${from} to ${to} on ${date} with ${airline} at ${time}, priced at $${price}.`;
        },
        examples: [
          {
            query: "Find me a flight from Zurich to Berlin next Monday",
            parameters: {
              from: "Zurich",
              to: "Berlin",
              date: "2025-05-05",
            },
          },
          {
            query:
              "Are there flights from New York to San Francisco on May 10th?",
            parameters: {
              from: "New York",
              to: "San Francisco",
              date: "2025-05-10",
            },
          },
        ],
      })
    );
    return agent;
  }, []);

  const messages = React.useSyncExternalStore(
    (cb) => agent.llm.onMessagesChange(cb),
    () => agent.llm.messages
  );

  React.useEffect(() => {
    agent.setModel(LLM_CONFIG[settings.llm].model);
    agent.setConversation(settings.systemPrompt);
  }, [settings, agent]);

  const messagesLength = React.useMemo(
    () =>
      messages.reduce(
        (acc, message) => acc + (message?.content || "").toString().length,
        0
      ),
    [messages]
  );

  React.useEffect(() => {
    if (messagesLength === messagesLengthRef.current) return;
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
    messagesLengthRef.current = messagesLength;
  }, [messagesLength]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!promptRef.current) return;
    setThinking(true);
    setLoadingEngine(true);
    const prompt = promptRef.current.value;
    promptRef.current.value = "";
    if (prompt) {
      await agent.processPrompt(
        prompt,
        settings.maxRounds,
        () => setLoadingEngine(false),
        settings.temperature,
        settings.filterDuplicateFunctionCalls,
        settings.enableThinking
      );
      promptRef.current.focus();
    }
    setThinking(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center gap-8 bg-gray-100 p-8">
      <div className="flex w-1/2 items-center justify-center">
        <About />
      </div>
      <div className="flex h-full w-1/2 flex-col justify-end gap-2 space-y-2 rounded-xl bg-white p-6 shadow">
        <ul ref={listRef} className="space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <li key={message.id}>
              <Message message={message} />
            </li>
          ))}
        </ul>
        {loadingEngine && (
          <p className="flex w-19/20 items-center gap-4 self-end rounded-md border border-gray-300 bg-gray-50 p-4">
            <Loader /> loading the model. Check the console for more infos.
          </p>
        )}
        <form className="flex w-full items-stretch gap-2" onSubmit={onSubmit}>
          <input
            type="text"
            name="prompt"
            ref={promptRef}
            className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
          <button
            disabled={thinking}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:pointer-events-none disabled:bg-indigo-400"
          >
            <PaperAirplaneIcon fontSize={5} />
          </button>
        </form>
        <div>
          <SettingsModal
            open={settingsModalOpen}
            setOpen={setSettingsModalOpen}
          />
          <button
            className="flex cursor-pointer items-center gap-1 pt-1 text-xs"
            onClick={() => setSettingsModalOpen(true)}
          >
            <Cog6ToothIcon className="h-4 w-4" />{" "}
            <span className="whitespace-nowrap">
              {LLM_CONFIG[settings.llm]?.label}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default () => (
  <SettingsContextProvider>
    <App />
  </SettingsContextProvider>
);
