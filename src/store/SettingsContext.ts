import React from "react";

import { Settings, defaultSettings } from "../utils/settings/constants.ts";

export interface SettingsContext {
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
}

const SettingsContext = React.createContext<SettingsContext>({
  settings: defaultSettings,
  setSettings: () => {},
});

export default SettingsContext;
