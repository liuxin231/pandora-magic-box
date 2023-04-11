import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Typography,
  styled,
} from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));
const StateDetail = (props: any) => {
  return (
    <>
      <Divider
        textAlign="left"
        sx={{ fontSize: "12px", margin: "10px 0px 10px 0px" }}
      >
        服务器基础信息
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Item>
            <Typography variant="caption" gutterBottom>
              os: {props.os}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              架构: {props.arch_bits}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              进程号: {props.process_id}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              端口: {props.tcp_port}
            </Typography>
          </Item>
        </Grid>
      </Grid>
      <Divider
        textAlign="left"
        sx={{ fontSize: "12px", margin: "10px 0px 10px 0px" }}
      >
        Redis基础信息
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              版本: {props.redis_version}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              运行模式: {props.redis_mode}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              事件处理机制: {props.multiplexing_api}
            </Typography>
          </Item>
        </Grid>
      </Grid>
      <Divider
        textAlign="left"
        sx={{ fontSize: "12px", margin: "10px 0px 10px 0px" }}
      >
        客户端信息
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              等待阻塞命令: {props.blocked_clients}
            </Typography>
          </Item>
        </Grid>
      </Grid>
      <Divider
        textAlign="left"
        sx={{ fontSize: "12px", margin: "10px 0px 10px 0px" }}
      >
        内存信息
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              数据大小: {props.used_memory_human}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              物理内存: {props.used_memory_rss}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              内存峰值: {props.used_memory_peak_human}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <Typography variant="caption" gutterBottom>
              内存碎片率: {props.mem_fragmentation_ratio + "%"}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <Typography variant="caption" gutterBottom>
              内存分配器: {props.mem_allocator}
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </>
  );
};
const StateCard = ({ name, value, loading }: { name: string; value: string, loading?: boolean }) => (
  <Card>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        { loading? <Skeleton />: name }
      </Typography>
      <Typography variant="h6" component="div">
        { loading? <Skeleton />: value }
      </Typography>
    </CardContent>
  </Card>
);
const RedisState = () => {
  let [loading, setLoading] = useState(true);
  let [dataMemory, setDataMemoryUse] = useState("0M");
  let [topMemory, setTopMemoryUse] = useState("0M");
  let [clients, setClients] = useState("0");
  let [runningDays, setRunningDays] = useState("0天");
  let [stateDetail, setStateDetail] = useState<any>();
  const get_redis_state = () => {
    invoke("get_redis_info")
    .then((response: any) => {
      setDataMemoryUse(response["used_memory_human"]);
      setTopMemoryUse(response["used_memory_peak_human"]);
      setClients(response["connected_clients"]);
      setRunningDays(response["uptime_in_seconds"] + "秒");
      setStateDetail(response);
      setLoading(false);
    })
    .catch((error) => enqueueSnackbar(`${error}`, { variant: "error" }));
  }
  useEffect(() => {
    get_redis_state();
    let timer = setInterval(() => {
      get_redis_state();
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <Accordion disabled={loading} sx={{ width: "100%", padding: "0", margin: "0", boxShadow: 'none' }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          width: "100%",
          padding: "0px",
          "& .MuiAccordionSummary-content": { margin: "0" },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <StateCard name="数据内存" value={dataMemory} loading={loading} />
          </Grid>
          <Grid item xs={3}>
            <StateCard name="内存峰值" value={topMemory} loading={loading} />
          </Grid>
          <Grid item xs={3}>
            <StateCard name="连接数" value={clients} loading={loading} />
          </Grid>
          <Grid item xs={3}>
            <StateCard name="运行时间" value={runningDays} loading={loading} />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <StateDetail {...stateDetail} />
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(RedisState);
