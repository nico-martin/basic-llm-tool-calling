import { SETTINGS_KEY, Settings } from "./constants.ts";
import getSettings from "./getSettings.ts";

export const saveSettings = (settings: Partial<Settings>): Settings => {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  return getSettings();
};

export default saveSettings;
