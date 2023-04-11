import { ContentCopy } from "@mui/icons-material";
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { invoke } from "@tauri-apps/api";
import { writeText } from "@tauri-apps/api/clipboard";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { any } from "zod";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  wordBreak: "break-all",
  color: theme.palette.text.secondary,
}));
const HashValueGrid = ({ param }: { param: any }) => {
  let [rows, setRows] = useState<
    Array<{ id: string; key: string; value: string }>
  >([]);
  useEffect(() => {
    let dynRows: Array<{ id: string; key: string; value: string }> = [];
    Object.keys(param).map((key) => {
      dynRows.push({
        id: key,
        key: key,
        value: param[key],
      });
    });
    setRows(dynRows);
  }, [param]);
  const columns: GridColDef[] = [
    { field: "key", headerName: "键", width: 200 },
    { field: "value", headerName: "值", width: 200 },
  ];
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} columnHeaderHeight={0} />
    </div>
  );
};
const ListValueGrid = ({ param }: { param: Array<string> }) => {
  let [rows, setRows] = useState<Array<{ id: string; value: string }>>([]);
  useEffect(() => {
    let dynRows: Array<{ id: string; value: string }> = [];
    param.map((value, index) => {
      dynRows.push({
        id: index.toString(),
        value: value,
      });
    });
    setRows(dynRows);
  }, [param]);
  const columns: GridColDef[] = [
    { field: "id", headerName: "索引", width: 200 },
    { field: "value", headerName: "值", width: 200 },
  ];
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} columnHeaderHeight={0} />
    </div>
  );
};

const SetValueGrid = ({ param }: { param: Array<string> }) => {
  let [rows, setRows] = useState<Array<{ id: string; key: string }>>([]);
  useEffect(() => {
    let dynRows: Array<{ id: string; key: string }> = [];
    param.map((value) => {
      dynRows.push({
        id: value,
        key: value,
      });
    });
    setRows(dynRows);
  }, [param]);
  const columns: GridColDef[] = [
    { field: "key", headerName: "key", width: 200 },
  ];
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} columnHeaderHeight={0} />
    </div>
  );
};
const ZsetValueGrid = ({
  param,
}: {
  param: Array<[key: string, score: number]>;
}) => {
  let [rows, setRows] = useState<
    Array<{ id: string; key: string; score: number }>
  >([]);
  useEffect(() => {
    let dynRows: Array<{ id: string; key: string; score: number }> = [];
    param.forEach((item) => {
      dynRows.push({
        id: item[0],
        key: item[0],
        score: item[1],
      });
    });
    setRows(dynRows);
  }, [param]);
  const columns: GridColDef[] = [
    { field: "key", headerName: "键", width: 200 },
    { field: "score", headerName: "分数", width: 200 },
  ];
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} columnHeaderHeight={0} />
    </div>
  );
};
const StreamValueGrid = ({ param }: { param: any }) => {
  let [rows, setRows] = useState<any>([]);
  let [gridColumns, setGridColumns] = useState<any>([]);
  useEffect(() => {
    let columns_remoat = [];
    columns_remoat.push({ field: "key", headerName: "Entry ID", width: 200 });
    param.columns.forEach((item: any) => {
      columns_remoat.push({ field: item, headerName: item, width: 150 });
    });
    let dynRows: Array<any> = [];
    Object.keys(param.data).forEach((key) => {
      let map = param.data[key];
      dynRows.push({
        id: key,
        key: key,
        ...map,
      });
    });
    setRows(dynRows);
    setGridColumns(columns_remoat);
  }, [param]);
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={gridColumns} />
    </div>
  );
};
const KeyInfo = ({ selectKey }: { selectKey: string }) => {
  let [keyType, setKeyType] = useState<String>();
  let [keySize, setKeySize] = useState(0);
  let [ttl, setTtl] = useState(0);
  let [stringValue, setStringValue] = useState<string>();
  let [hashValue, setHashValue] = useState<Object>({});
  let [listValue, setListValue] = useState<Array<string>>([]);
  let [setValue, setSetValue] = useState<Array<string>>([]);
  let [zsetValue, setZsetValue] = useState<any>([]);
  let [streamValue, setStreamValue] = useState<any>();
  useEffect(() => {
    invoke<{ size: number; ttl: number; type: string; value: Object }>(
      "redis_get_key_info",
      {
        key: selectKey,
      }
    )
      .then((response) => {
        setKeyType(response.type);
        setKeySize(response.size);
        setTtl(response.ttl);
        if (response.type === "string") {
          setStringValue(Object.values(response.value)[0]);
        } else if (response.type === "hash") {
          setHashValue(Object.values(response.value)[0]);
        } else if (response.type === "list") {
          setListValue(Object.values(response.value)[0]);
        } else if (response.type === "set") {
          setSetValue(Object.values(response.value)[0]);
        } else if (response.type === "zset") {
          setZsetValue(Object.values(response.value)[0]);
        } else if (response.type === "stream") {
          setStreamValue(Object.values(response.value)[0]);
        }
      })
      .catch((error) => enqueueSnackbar(`${error}`, { variant: "error" }));
  }, [selectKey]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>
            {selectKey}
            <IconButton
              aria-label="copy"
              size="small"
              onClick={async () => {
                await writeText(selectKey).then(() => {
                  enqueueSnackbar("复制成功", { variant: "success" });
                });
              }}
            >
              <ContentCopy sx={{ width: "15px" }}></ContentCopy>
            </IconButton>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Stack direction="row" spacing={1}>
              <Chip size="small" label={keyType} color="primary" />
              <Chip size="small" label={keySize + "B"} color="default" />
              <Chip
                size="small"
                label={ttl == -1 ? "No Limit" : "ttl: " + ttl}
                color="default"
              />
            </Stack>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            {keyType === "string" ? (
              <Typography variant="subtitle2" component="h2">
                {stringValue}
              </Typography>
            ) : (
              ""
            )}

            {keyType === "hash" ? <HashValueGrid param={hashValue} /> : ""}
            {keyType === "list" ? <ListValueGrid param={listValue} /> : ""}
            {keyType === "set" ? <SetValueGrid param={setValue} /> : ""}
            {keyType === "zset" ? <ZsetValueGrid param={zsetValue} /> : ""}
            {keyType === "stream" ? (
              <StreamValueGrid param={streamValue} />
            ) : (
              ""
            )}
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(KeyInfo);
