import {
  ArrowLeft,
} from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RedisState from "./RedisState";
import KeysGrid from "./KeysGrid";
import KeysContainer from "./KeysContainer";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const ContainerPaper = styled(Paper)(() => ({
  width: "100%",
  height: "100%",
  padding: "10px 10px 0px 10px",
  display: "flex",
  flexDirection: "column",
}));
const RedisDetail = () => {
  let [selectKey, setSelectKey] = useState<string>();
  const navigate = useNavigate();
  let { redisId } = useParams();
  const backup = () => {
    navigate("/redis/index");
  };
  const checkKey = (key: string) => {
    setSelectKey(key);
  }
  const addKey = () => {
    setSelectKey(undefined);
  };
  return (
    <ContainerPaper>
      <Box>
        <Stack direction="row" spacing={0}>
          <Box display="flex">
            <IconButton
              aria-label="arrow-left"
              size="small"
              sx={{ borderRadius: "0px" }}
              onClick={backup}
            >
              <ArrowLeft fontSize="inherit" />
            </IconButton>
          </Box>
          <Box flexGrow={1}>
            <RedisState />
          </Box>
        </Stack>
      </Box>
      <Paper sx={{ flexGrow: 1, marginTop: "10px" }}>
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid item xs={5} sx={{ height: "100%" }}>
            <Grid item xs={12} sx={{ height: "100%" }}>
              <Item sx={{ height: "100%" }}>
                <KeysGrid checkKey={checkKey} addKey={addKey} />
              </Item>
            </Grid>
          </Grid>
          <Grid item xs={7} sx={{ height: "100%" }}>
            <Item sx={{ height: "100%" }}>
              <KeysContainer selectKey={selectKey} />
            </Item>
          </Grid>
        </Grid>
      </Paper>
    </ContainerPaper>
  );
};

export default React.memo(RedisDetail);
