import React from "react";
import { Badge } from "@mui/material";

import { Notifications } from "@mui/icons-material";
import ThemeSwitch from "./ThemeSwitch";
import { useAppSelector } from "@/store";
import { selectAppSettings } from "@/store/settings";
import { ShowNavButton } from "./NavToggle";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  navWidth?: number;
}
const AppBar = styled(
  MuiAppBar,
  {}
)<AppBarProps>(({ theme, open }) => {
  const appSettingState = useAppSelector(selectAppSettings);
  return ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: appSettingState.navWidth,
      width: `calc(100% - ${appSettingState.navWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  });
});
export const DefaultHeader = React.memo(() => {
  const appSettingState = useAppSelector(selectAppSettings);

  return (
    <Box>
      <AppBar
        position="fixed"
        open={appSettingState.collapsed}
      >
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <ShowNavButton />
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
          <ThemeSwitch />
        </Toolbar>
      </AppBar>
    </Box>
  );
});
