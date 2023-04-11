import { PaletteMode } from "@mui/material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

const appSettingsNamespace = 'appSettings';

export interface AppSettings {
    /**
     * 是否展开菜单
     */
    collapsed: boolean;
    /**
     * 导航菜单宽度
     */
    navWidth: number;
    /**
     * 是否展示设置按钮
     */
    showSettings: boolean;
    showHeader: boolean;
    theme: PaletteMode;
    /**
     * 是否开启跟随系统主题
     */
    systemTheme: boolean;
    /**
     * 圆角度
     */
    radius: string | number;
}

const initialState: AppSettings = {
  collapsed: false,
  showSettings: false,
  theme: 'dark',
  systemTheme: false,
  radius: 5,
  navWidth: 240,
  showHeader: false
};

const appSettingsSlice = createSlice({
    name: appSettingsNamespace,
    initialState,
    reducers: {
      toggleNav: (state, action) => {
        if (action.payload === null) {
          state.collapsed = !state.collapsed;
        } else {
          state.collapsed = !!action.payload;
        }
      },
      toggleShowSettings: (state) => {
        state.showSettings = !state.showSettings;
      },
      toggleTheme: (state, action) => {
        state.theme = action.payload;
      },
    },
    extraReducers: () => {},
});

export const selectAppSettings = (state: RootState) => state.appSettings;

export const {
    toggleNav,
    toggleShowSettings,
    toggleTheme,
  } = appSettingsSlice.actions;

export default appSettingsSlice.reducer;