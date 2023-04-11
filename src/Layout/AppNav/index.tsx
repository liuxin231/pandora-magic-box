import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Popover,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ModelTraining, Settings, Update } from "@mui/icons-material";
import React, { useEffect, useRef } from "react";
import { HideNavButton } from "../AppHeader/NavToggle";
import { useAppSelector } from "@/store";
import { AppSettings, selectAppSettings } from "@/store/settings";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "../AppHeader/ThemeSwitch";

const MuiDrawer = styled(
  Drawer,
  {}
)(({ theme }) => {
  const appSettingState: AppSettings = useAppSelector(selectAppSettings);
  return {
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: appSettingState.navWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!appSettingState.collapsed && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  };
});
export const DefaultNav = React.memo(() => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const appSettingState = useAppSelector(selectAppSettings);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpenSettings = Boolean(anchorEl);
  const id = isOpenSettings ? "simple-popover" : undefined;
  let settingsRef = useRef<HTMLDivElement>(null);
  let toolBarRef = useRef<HTMLDivElement>(null);
  let drawerBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {});
  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <MuiDrawer
        ref={drawerBarRef}
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
        variant="permanent"
      >
        {appSettingState.showHeader ? (
          <Toolbar
            ref={toolBarRef}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <HideNavButton />
          </Toolbar>
        ) : (
          ""
        )}
        <Divider />
        <List
          component="nav"
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            flexGrow: 1,
          }}
        >
          <ListItemButton component={NavLink} to={"/dashboard/BaseDashboard"}>
            <ListItemIcon>
              <svg
                viewBox="0 0 1024 1024"
                p-id="3465"
                width="32"
                height="32"
              >
                <path
                  d="M217.6 659.2c0-19.2-6.4-38.4-19.2-51.2s-32-25.6-51.2-25.6c-19.2 0-38.4 12.8-51.2 25.6-12.8 12.8-25.6 32-25.6 51.2 0 19.2 6.4 38.4 19.2 51.2s32 19.2 51.2 19.2c19.2 0 38.4-6.4 51.2-19.2s25.6-32 25.6-51.2z m108.8-256c0-19.2-6.4-38.4-19.2-51.2s-32-25.6-51.2-25.6c-19.2 0-38.4 6.4-51.2 19.2s-19.2 38.4-19.2 57.6c0 19.2 6.4 38.4 19.2 51.2 12.8 12.8 32 19.2 51.2 19.2 19.2 0 38.4-6.4 51.2-19.2s19.2-32 19.2-51.2zM576 678.4l57.6-217.6c0-12.8 0-19.2-6.4-25.6-6.4-12.8-12.8-19.2-19.2-19.2H576c-6.4 6.4-12.8 12.8-12.8 25.6l-57.6 217.6c-25.6 0-44.8 12.8-64 25.6-19.2 12.8-32 32-38.4 57.6-6.4 32-6.4 57.6 12.8 83.2 12.8 25.6 38.4 44.8 64 51.2s57.6 6.4 83.2-12.8c25.6-12.8 44.8-38.4 51.2-64 6.4-25.6 6.4-44.8-6.4-64 0-25.6-12.8-44.8-32-57.6z m377.6-19.2c0-19.2-6.4-38.4-19.2-51.2-12.8-12.8-32-19.2-51.2-19.2-19.2 0-38.4 6.4-51.2 19.2-12.8 12.8-19.2 32-19.2 51.2 0 19.2 6.4 38.4 19.2 51.2 12.8 12.8 32 19.2 51.2 19.2 19.2 0 38.4-6.4 51.2-19.2 6.4-12.8 19.2-32 19.2-51.2zM582.4 294.4c0-19.2-6.4-38.4-19.2-51.2-12.8-19.2-32-25.6-51.2-25.6-19.2 0-38.4 6.4-51.2 19.2-12.8 19.2-19.2 38.4-19.2 57.6 0 19.2 6.4 38.4 19.2 51.2 12.8 12.8 32 19.2 51.2 19.2 19.2 0 38.4-6.4 51.2-19.2 12.8-12.8 19.2-32 19.2-51.2z m256 108.8c0-19.2-6.4-38.4-19.2-51.2-12.8-12.8-32-19.2-51.2-19.2-19.2 0-38.4 6.4-51.2 19.2-12.8 12.8-19.2 32-19.2 51.2 0 19.2 6.4 38.4 19.2 51.2 12.8 12.8 32 19.2 51.2 19.2 19.2 0 38.4-6.4 51.2-19.2 12.8-12.8 19.2-32 19.2-51.2z m185.6 256c0 102.4-25.6 192-83.2 275.2-6.4 12.8-19.2 19.2-32 19.2H108.8c-12.8 0-25.6-6.4-32-19.2C25.6 851.2 0 755.2 0 659.2c0-70.4 12.8-134.4 38.4-198.4s64-115.2 108.8-166.4 102.4-83.2 166.4-108.8 128-38.4 198.4-38.4 134.4 12.8 198.4 38.4 115.2 64 166.4 108.8c44.8 44.8 83.2 102.4 108.8 166.4 25.6 64 38.4 128 38.4 198.4z"
                  fill="#409EFF"
                  p-id="3466"
                ></path>
              </svg>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={NavLink} to={"/redis/index"}>
            <ListItemIcon>
              <svg viewBox="0 0 1024 1024" p-id="2235" width="32" height="32">
                <path
                  d="M1023.786667 611.84c-0.426667 9.770667-13.354667 20.693333-39.893334 34.56-54.613333 28.458667-337.749333 144.896-397.994666 176.298667-60.288 31.402667-93.738667 31.104-141.354667 8.32-47.616-22.741333-348.842667-144.469333-403.114667-170.368-27.093333-12.970667-40.917333-23.893333-41.386666-34.218667v103.509333c0 10.325333 14.250667 21.290667 41.386666 34.261334 54.272 25.941333 355.541333 147.626667 403.114667 170.368 47.616 22.784 81.066667 23.082667 141.354667-8.362667 60.245333-31.402667 343.338667-147.797333 397.994666-176.298667 27.776-14.464 40.106667-25.728 40.106667-35.925333v-102.058667l-0.213333-0.085333z"
                  fill="#d81e06"
                  p-id="2236"
                ></path>
                <path
                  d="M1023.744 443.093333c-0.426667 9.770667-13.354667 20.650667-39.850667 34.517334-54.613333 28.458667-337.749333 144.896-397.994666 176.298666-60.288 31.402667-93.738667 31.104-141.354667 8.362667-47.616-22.741333-348.842667-144.469333-403.114667-170.410667-27.093333-12.928-40.917333-23.893333-41.386666-34.176v103.509334c0 10.325333 14.250667 21.248 41.386666 34.218666 54.272 25.941333 355.498667 147.626667 403.114667 170.368 47.616 22.784 81.066667 23.082667 141.354667-8.32 60.245333-31.402667 343.338667-147.84 397.994666-176.298666 27.776-14.506667 40.106667-25.770667 40.106667-35.968v-102.058667l-0.256-0.042667z"
                  fill="#d81e06"
                  p-id="2237"
                ></path>
                <path
                  d="M1023.744 268.074667c0.512-10.410667-13.098667-19.541333-40.490667-29.610667-53.248-19.498667-334.634667-131.498667-388.522666-151.253333-53.888-19.712-75.818667-18.901333-139.093334 3.84C392.234667 113.706667 92.629333 231.253333 39.338667 252.074667c-26.666667 10.496-39.68 20.181333-39.253334 30.506666V386.133333c0 10.325333 14.250667 21.248 41.386667 34.218667 54.272 25.941333 355.498667 147.669333 403.114667 170.410667 47.616 22.741333 81.066667 23.04 141.354666-8.362667 60.245333-31.402667 343.338667-147.84 397.994667-176.298667 27.776-14.506667 40.106667-25.770667 40.106667-35.968V268.074667h-0.341334zM366.72 366.08l237.269333-36.437333-71.68 105.088-165.546666-68.650667z m524.8-94.634667l-140.330667 55.466667-15.232 5.973333-140.245333-55.466666 155.392-61.44 140.373333 55.466666z m-411.989333-101.674666l-22.954667-42.325334 71.594667 27.989334 67.498666-22.101334-18.261333 43.733334 68.778667 25.770666-88.704 9.216-19.882667 47.786667-32.085333-53.290667-102.4-9.216 76.416-27.562666z m-176.768 59.733333c70.058667 0 126.805333 21.973333 126.805333 49.109333s-56.746667 49.152-126.805333 49.152-126.848-22.058667-126.848-49.152c0-27.136 56.789333-49.152 126.848-49.152z"
                  fill="#d81e06"
                  p-id="2238"
                ></path>
              </svg>
            </ListItemIcon>
            <ListItemText primary="redis" />
          </ListItemButton>
        </List>

        <Divider />
        <List
          ref={settingsRef}
          component="nav"
          sx={{
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <ListItemButton
            aria-describedby={id}
            onClick={(event: any) => handleClick(event)}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>

          <Popover
            id={id}
            open={isOpenSettings}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Paper elevation={3}>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
                subheader={<ListSubheader>系统设置</ListSubheader>}
              >
                <ListItem>
                  <ListItemIcon>
                    <ModelTraining />
                  </ListItemIcon>
                  <ListItemText id="switch-list-label-wifi" primary="" />
                  <ThemeSwitch />
                </ListItem>
              </List>
            </Paper>
          </Popover>
        </List>
      </MuiDrawer>
    </Box>
  );
});
