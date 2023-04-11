import { Settings } from "@mui/icons-material";
import { Box, Fab, IconButton, Tooltip, useTheme } from "@mui/material";
import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const AppSetting = () => {
  const x = useMotionValue(0);
  const theme = useTheme();
  return (
    <>
      <motion.div 
        drag
        dragConstraints={{ left: 0, right: 0 }}
      >
        <Tooltip title="Live Customize">
          <Fab
            component="div"
            size="medium"
            variant="circular"
            color="primary"
            sx={{
              borderRadius: 0,
              borderTopLeftRadius: "50%",
              borderBottomLeftRadius: "50%",
              borderTopRightRadius: "50%",
              borderBottomRightRadius: "4px",
              top: "25%",
              position: "fixed",
              right: 10,
              zIndex: theme.zIndex.speedDial,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 5,
                repeatDelay: 0,
              }}
            >
              <IconButton color="inherit" size="large" disableRipple>
                <Settings />
              </IconButton>
            </motion.div>
          </Fab>
        </Tooltip>
      </motion.div>
    </>
  );
};

export default React.memo(AppSetting);
