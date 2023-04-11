import * as React from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import "./styles/App.less";
import { DefaultLayout } from "./Layout";
import { useAppSelector } from "./store";
import { selectAppSettings } from "./store/settings";
import { SnackbarProvider } from "notistack";

function App() {
  const appSettingsState = useAppSelector(selectAppSettings);
  const theme = createTheme({
    palette: {
      mode: appSettingsState.theme,
    },
  });
  theme.components = {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: appSettingsState.radius,
        },
      },
    },
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-root">
        <SnackbarProvider
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          maxSnack={3}
        >
          <DefaultLayout />
        </SnackbarProvider>
      </div>
    </ThemeProvider>
  );
}

export default React.memo(App);