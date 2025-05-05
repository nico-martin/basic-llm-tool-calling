import React from "react";

import useSettings from "../store/useSettings.ts";
import { Modal } from "../theme";
import {
  LLM_CONFIG,
  Llm,
  LlmConfigElement,
  Settings,
} from "../utils/settings/constants.ts";

const llmOptions = Object.entries(LLM_CONFIG);
const llmOptionsGrouped: Record<
  string,
  Partial<Record<Llm, LlmConfigElement>>
> = {};
llmOptions.map(([key, element]) => {
  if (!llmOptionsGrouped[element.group]) {
    llmOptionsGrouped[element.group] = {};
  }
  llmOptionsGrouped[element.group][key as unknown as Llm] = element;
  return element;
});

const SettingsModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  onSaved?: (settings: Settings) => Promise<void>;
}> = ({ open, setOpen, onSaved = () => {} }) => {
  const { settings, setSettings } = useSettings();
  const [loading, setLoading] = React.useState<boolean>(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <Modal open={open} setOpen={setOpen} title="Settings">
      <form
        className="flex flex-col gap-4"
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!formRef?.current) return;
          const formData = new FormData(formRef.current!);

          setSettings({
            llm: formData.get("llm") as unknown as Llm,
            systemPrompt: formData.get("systemPrompt")?.toString(),
            maxRounds: Number(formData.get("maxRounds")),
            temperature: Number(formData.get("temperature")),
            filterDuplicateFunctionCalls:
              formData.get("filterDuplicateFunctionCalls") !== null,
            enableThinking: formData.get("enableThinking") !== null,
          });
          setLoading(true);
          await onSaved(settings);
          setLoading(false);
          setOpen(false);
        }}
      >
        <div className="flex gap-2">
          <label htmlFor="llm" className="w-1/3 pt-2.5 text-left">
            Model:
          </label>
          <select
            className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            id="llm"
            name="llm"
          >
            {Object.entries(llmOptionsGrouped).map(([group, options]) => {
              return (
                <optgroup key={group} label={group}>
                  {Object.entries(options).map(([key, value]) => (
                    <option
                      key={key}
                      value={key}
                      selected={settings.llm.toString() === key}
                    >
                      {value.label}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>
        <div className="flex gap-2">
          <label htmlFor="systemPrompt" className="w-1/3 pt-2.5 text-left">
            System Prompt:
          </label>
          <textarea
            id="systemPrompt"
            name="systemPrompt"
            className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            defaultValue={settings.systemPrompt}
            rows={7}
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="maxRounds" className="w-1/3 pt-2.5 text-left">
            Max. Rounds:
          </label>
          <input
            id="maxRounds"
            name="maxRounds"
            type="number"
            className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            defaultValue={settings.maxRounds}
            step={1}
            min={1}
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="temperature" className="w-1/3 pt-2.5 text-left">
            Temperature:
          </label>
          <input
            id="temperature"
            name="temperature"
            type="number"
            className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            defaultValue={settings.temperature}
            step={1}
            min={0}
            max={10}
          />
        </div>
        <div className="flex gap-2">
          <label
            htmlFor="filterDuplicateFunctionCalls"
            className="w-1/3 pt-2.5 text-left"
          >
            Filter duplicate function calls:
          </label>
          <input
            name="filterDuplicateFunctionCalls"
            id="filterDuplicateFunctionCalls"
            type="checkbox"
            className="mt-2 h-6 w-6 rounded-md bg-white text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            defaultChecked={settings.filterDuplicateFunctionCalls}
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="enableThinking" className="w-1/3 pt-2.5 text-left">
            Enable Thinking (if supported by the model):
          </label>
          <input
            name="enableThinking"
            id="enableThinking"
            type="checkbox"
            className="mt-2 h-6 w-6 rounded-md bg-white text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            defaultChecked={settings.enableThinking}
          />
        </div>
        <div className="flex justify-end">
          <button
            disabled={loading}
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:pointer-events-none disabled:bg-indigo-400"
          >
            Create new Conversation
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
