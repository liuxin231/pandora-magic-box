import CustomNoRowsOverlay from "@/components/grid/CustomNoRowsOverlay";
import { Add, ArrowDropDown, Delete, Refresh } from "@mui/icons-material";
import { Box, ButtonGroup, Grid, IconButton } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { invoke } from "@tauri-apps/api";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

const CustomToolBar = (
  refreshGrid: Function,
  addButtonClick: Function,
  deleteButtonClick: Function
) => (
  <Box sx={{ width: "100%", height: "100%" }}>
    <GridToolbarContainer sx={{}}>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <GridToolbarQuickFilter size="small" />
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "right" }}>
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled elevation buttons"
          >
            <IconButton
              size="small"
              aria-label="add"
              onClick={() => {
                addButtonClick();
              }}
            >
              <Add fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => {
                deleteButtonClick();
              }}
              size="small"
              aria-label="delete"
            >
              <Delete fontSize="small" />
            </IconButton>
            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
            >
              <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled elevation buttons"
              >
                <IconButton
                  onClick={() => {
                    refreshGrid();
                  }}
                  aria-label="delete"
                  size="small"
                  sx={{ borderRadius: "0px" }}
                >
                  <Refresh fontSize="inherit" />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="small"
                  sx={{ borderRadius: "0px" }}
                >
                  <ArrowDropDown fontSize="inherit" />
                </IconButton>
              </ButtonGroup>
            </ButtonGroup>
          </ButtonGroup>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  </Box>
);
const KeysGrid = ({
  checkKey,
  addKey,
}: {
  checkKey: Function;
  addKey: Function;
}) => {
  let [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  let [rows, setRows] = useState<GridRowsProp>([]);
  let [loading, setLoading] = useState(true);
  const searchKeys = () => {
    invoke<Array<Object>>("redis_search_key")
      .then((response) => {
        if (response.length > 0) {
          checkKey((response[0] as any)["key"]);
        }
        setRows(response);
        setLoading(false);
      })
      .catch((error) => enqueueSnackbar(`${error}`, { variant: "error" }));
  };

  const refreshGrid = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    searchKeys();
  };
  const rowClick = (params: GridRowParams) => {
    checkKey(params.id);
  };
  const addButtonClick = () => {
    addKey();
  };

  const deleteButtonClick = () => {
    if (rowSelectionModel.length === 0) {
      enqueueSnackbar("请选择要删除的数据", { variant: "warning" })
      return;
    }
    invoke<Array<Object>>("redis_info_delete_keys", {keys: rowSelectionModel})
      .then((response) => {
        enqueueSnackbar(`${response}`, { variant: "success" });
        refreshGrid();
      })
      .catch((error) => enqueueSnackbar(`${error}`, { variant: "error" }));
    console.log(rowSelectionModel);
  };
  useEffect(() => {
    searchKeys();
  }, []);

  const columns: GridColDef[] = [{ field: "key", headerName: "键", flex: 1 }];
  return (
    <DataGrid
      rows={rows}
      loading={loading}
      getRowId={(row) => row.key}
      onRowSelectionModelChange={(newRowSelectionModel) => {
        setRowSelectionModel(newRowSelectionModel);
      }}
      rowSelectionModel={rowSelectionModel}
      columns={columns}
      disableColumnFilter
      disableColumnMenu
      checkboxSelection
      disableRowSelectionOnClick
      columnHeaderHeight={0}
      onRowClick={rowClick}
      slots={{
        toolbar: () =>
          CustomToolBar(refreshGrid, addButtonClick, deleteButtonClick),
        noRowsOverlay: CustomNoRowsOverlay,
      }}
    />
  );
};

export default React.memo(KeysGrid);
