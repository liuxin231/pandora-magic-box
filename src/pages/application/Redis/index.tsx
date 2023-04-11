import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  Paper,
  Popover,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Add, ContentCopy, Delete, MoreVert } from "@mui/icons-material";
import "./index.less";
import InfoForm from "./InfoForm";
import { invoke } from "@tauri-apps/api";
import moment from "moment";
import { useSnackbar } from "notistack";
import { writeText } from "@tauri-apps/api/clipboard";
import { useNavigate, useLocation } from "react-router-dom";
import CustomNoRowsOverlay from "@/components/grid/CustomNoRowsOverlay";


const CustomToolBar = (redis_info_find_all: Function, deleteInfo: Function) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const toggleGridSettings = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;
  let [isShowInfoDrawer, setIsShowInfoDrawer] = useState(false);
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <InfoForm
        anchor="right"
        open={isShowInfoDrawer}
        closeForm={() => {
          redis_info_find_all();
          setIsShowInfoDrawer(false);
        }}
      />
      <GridToolbarContainer sx={{}}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <GridToolbarQuickFilter />
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "right" }}>
            <Button
              startIcon={<Add />}
              onClick={() => setIsShowInfoDrawer(true)}
            >
              新增
            </Button>
            <Button onClick={() => deleteInfo()} startIcon={<Delete />}>
              删除
            </Button>
            <IconButton
              onClick={toggleGridSettings}
              size="small"
              edge="end"
              color="primary"
            >
              <MoreVert />
            </IconButton>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
              <GridToolbarDensitySelector />
              <GridToolbarExport />
            </Popover>
          </Grid>
        </Grid>
      </GridToolbarContainer>
    </Box>
  );
};
interface RedisGridColumnsType {
  id: string;
  name: string;
  ip: string;
  port: number;
  account: string;
  password: string;
  visit_num: number;
  visit_time: number;
  create_time: number;
  modify_time: number;
}
const Redis = () => {
  let [rows, setRows] = useState(new Array<RedisGridColumnsType>());
  let [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);
  let [selectRedisId, setSelectRedisId] = useState<string | undefined>(
    undefined
  );
  let [isShowInfoDrawer, setIsShowInfoDrawer] = useState(false);
  let [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const redis_info_find_all = () => {
    setIsLoading(true);
    invoke("redis_info_find_all")
      .then((response: any) => {
        setRows(response);
        setIsLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar(`${error}`, { variant: "error" });
        setIsLoading(false);
      });
  };
  const deleteInfo = (param?: string) => {
    let ids = new Array();
    if (param) {
      ids = [param];
    } else {
      if (rowSelection.length === 0) {
        enqueueSnackbar("请选择数据", { variant: "warning" });
        return;
      }
      ids = rowSelection;
    }
    invoke("redis_info_delete", { ids })
      .then((response: any) => {
        enqueueSnackbar(`${response}`, { variant: "success" });
        redis_info_find_all();
      })
      .catch((error) => enqueueSnackbar(`${error}`, { variant: "error" }));
  };
  useEffect(() => {
    redis_info_find_all();
  }, []);
  const navigate = useNavigate();
  const toRedisDetail = (redisId: string) => {
    invoke("set_redis_connection_state", { redisId })
      .then((response) => {
        enqueueSnackbar(`${response}`, { variant: "success" });
        navigate(`/redis/detail/${redisId}`);
      })
      .catch((error) => enqueueSnackbar(`${error}`, { variant: "error" }));
  };
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "名称",
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => toRedisDetail(params.id.toString())}>
          {params.value}
        </Button>
      ),
    },
    {
      field: "ip",
      headerName: "ip",
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => toRedisDetail(params.id.toString())}>
          {params.value}
        </Button>
      ),
    },
    { field: "port", headerName: "端口", width: 70 },
    {
      field: "account",
      headerName: "账号",
      width: 150,
      renderCell: (params) => (
        <>
          {params.value}
          <IconButton
            aria-label="copy"
            size="small"
            onClick={async () => {
              await writeText(params.value);
            }}
          >
            <ContentCopy sx={{ width: "15px" }}></ContentCopy>
          </IconButton>
        </>
      ),
    },
    {
      field: "password",
      headerName: "密码",
      renderCell: (params) => (
        <>
          ******
          <IconButton
            aria-label="copy"
            size="small"
            onClick={async () => {
              await writeText(params.value);
            }}
          >
            <ContentCopy sx={{ width: "15px" }}></ContentCopy>
          </IconButton>
        </>
      ),
    },
    {
      field: "visit_time",
      headerName: "上次使用时间",
      width: 200,
      valueFormatter(params) {
        let visit_time = moment(params.value * 1000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        return `${visit_time}`;
      },
    },
    {
      field: "col6",
      headerName: "操作",
      align: "left",
      headerAlign: "left",
      width: 200,
      renderCell: (params) => (
        <ButtonGroup size="small" variant="text" aria-label="text button group">
          <Button
            onClick={() => {
              setSelectRedisId(params.id.toString());
              setIsShowInfoDrawer(true);
            }}
          >
            修改
          </Button>
          <Button onClick={() => deleteInfo(params.id.toString())}>删除</Button>
        </ButtonGroup>
      ),
    },
  ];
  return (
    <Paper elevation={3} sx={{ width: "100%", height: "100%" }}>
      <InfoForm
        anchor="right"
        open={isShowInfoDrawer}
        redis_id={selectRedisId}
        closeForm={() => {
          redis_info_find_all();
          setIsShowInfoDrawer(false);
          setSelectRedisId(undefined);
        }}
      />
      <DataGrid
        loading={isLoading}
        rows={rows}
        columns={columns}
        checkboxSelection
        showCellVerticalBorder={false}
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelection(newRowSelectionModel);
        }}
        localeText={{
          toolbarDensity: "排版",
          toolbarDensityLabel: "排版",
          toolbarDensityCompact: "紧凑",
          toolbarDensityStandard: "一般",
          toolbarDensityComfortable: "大间距",
          toolbarColumns: "列",
          toolbarColumnsLabel: "列",
          toolbarExport: "导出",
          toolbarExportCSV: "导出CSV",
          toolbarExportPrint: "打印",
          toolbarFilters: "过滤",
          columnsPanelHideAllButton: "隐藏所有",
          columnsPanelShowAllButton: "显示所有",
          MuiTablePagination: {
            labelRowsPerPage: "每页条数",
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        slots={{
          toolbar: () => CustomToolBar(redis_info_find_all, deleteInfo),
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: "visit_time", sort: "desc" }],
          },
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        slotProps={{}}
      />
    </Paper>
  );
};

export default Redis;
