import { useAppDispatch, useAppSelector } from "@/store";
import { selectAppSettings, toggleNav } from "@/store/settings";
import { ChevronLeft, Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

export const ShowNavButton = React.memo(() => {
  const appSettingState = useAppSelector(selectAppSettings);
  const dispatch = useAppDispatch();
  const showNav = () => {
    dispatch(toggleNav(true));
  };
  return (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="open drawer"
      onClick={() => showNav()}
      sx={{
        marginRight: "36px",
        ...(appSettingState.collapsed && { display: "none" }),
      }}
    >
      <Menu />
    </IconButton>
  );
});

export const HideNavButton = React.memo(() => {
  const appSettingState = useAppSelector(selectAppSettings);
  const dispatch = useAppDispatch();
  const hideNav = () => {
    dispatch(toggleNav(false));
  };
  return (
    <IconButton onClick={() => hideNav()}>
      <ChevronLeft />
    </IconButton>
  );
});
