import React from "react";
import { Box, Fade, Toolbar } from "@mui/material";
import { useAppSelector } from "@/store";
import { selectAppSettings } from "@/store/settings";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import NotFoundPage from "@/pages/error/NotFoundPage";
import BaseDashboard from "@/pages/dashboard/BaseDashboard";
import Workspace from "@/pages/dashboard/Workspace";
import Redis from "@/pages/application/Redis";
import RedisDetail from "@/pages/application/Redis/RedisDetail";

export const DefaultContainer = React.memo(() => {
  const appSettingState = useAppSelector(selectAppSettings);
  return (
    <>
      {appSettingState.showHeader ? <Toolbar /> : ""}

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/redis/index" />}></Route>
          <Route path="/dashboard">
            <Route path="BaseDashboard" element={<BaseDashboard />} />
            <Route path="Workspace" element={<Workspace />} />
          </Route>
          <Route path="/redis" >
            <Route path="index" element={<Redis />}></Route>
            <Route path="detail/:redisId" element={<RedisDetail />}></Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </>
  );
});
