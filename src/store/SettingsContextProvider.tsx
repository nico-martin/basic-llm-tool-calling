import React from "react";

import { Settings } from "../utils/settings/constants.ts";
import getSettings from "../utils/settings/getSettings.ts";
import saveSettings from "../utils/settings/saveSettings.ts";
import SettingsContext from "./SettingsContext.ts";

const SettingsContextProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [settings, setSettings] = React.useState<Settings>(getSettings());

  return (
    <SettingsContext
      value={{
        settings,
        setSettings: (settings: Partial<Settings>) => {
          console.log(settings);
          setSettings((s) => {
            console.log(settings);
            return saveSettings({ ...s, ...settings });
          });
        },
      }}
    >
      {children}
    </SettingsContext>
  );
};

export default SettingsContextProvider;
