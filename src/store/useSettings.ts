import React from "react";

import SettingsContext from "./SettingsContext.ts";

const useSettings = () => React.useContext(SettingsContext);

export default useSettings;
