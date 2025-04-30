import { SETTINGS_KEY, Settings, defaultSettings } from "./constants.ts";

export const getSettings = (): Settings => {
  const stored = window.localStorage.getItem(SETTINGS_KEY);
  const parsed = JSON.parse(stored ? stored : "{}");
  return { ...defaultSettings, ...parsed };
};

export default getSettings;
