import { Box } from "@mui/material";
import React from "react";
import { DefaultHeader } from "./AppHeader";
import { DefaultNav } from "./AppNav";
import { DefaultContainer } from "./AppContainer";
import AppSetting from "./AppSetting";
import { useAppSelector } from "@/store";
import { selectAppSettings } from "@/store/settings";

export const DefaultLayout = React.memo(() => {
  const appSettingState = useAppSelector(selectAppSettings);
  return (
    <Box sx={{ display: "flex" }}>
      {appSettingState.showHeader?<DefaultHeader />:''}
      <DefaultNav />
      <DefaultContainer />
      {appSettingState.showSettings?<AppSetting />:''}
    </Box>
  );
});