import { Backup, Cancel } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Divider,
  Drawer,
  DrawerProps,
  Paper,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { coerce, number, object, optional, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoke } from "@tauri-apps/api";
import { useSnackbar } from "notistack";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
interface InfoFormDrawerProps extends DrawerProps {
  redis_id?: string;
  closeForm?: Function;
}

export interface RedisInfoType {
  id: string | null | undefined;
  name: string;
  ip: string;
  port: number | null;
  account: string | null;
  password: string | null;
}
const registerSchema = object({
  name: string()
    .nonempty("Name is required")
    .max(32, "Name must be less than 100 characters"),
  ip: string().nonempty("ip is required").ip("ip is invalid"),
  port: coerce
    .number()
    .int("must be integer")
    .min(1, "port is invalid")
    .max(65533, "port is invalid"),
  account: string().nullable(),
  password: string().nullable(),
}).refine(
  (data) =>
    data.port > 65532 ||
    data.port < 0 ||
    !(number().isNullable() || number().isOptional()),
  {
    message: "port is invalid",
  }
);
const InfoForm = (props: InfoFormDrawerProps) => {
  let [initFormValue, setInitFormValue] = useState<RedisInfoType>({
    id: null,
    name: "",
    ip: "",
    port: 6379,
    account: null,
    password: null,
  });
  const { enqueueSnackbar } = useSnackbar();
  const { redis_id, closeForm, ...other } = props;
  useEffect(() => {
    if (redis_id) {
      invoke<RedisInfoType>("redis_info_find_by_id", { id: redis_id }).then(
        (response: RedisInfoType) => {
          reset({
            id: response.id,
            name: response.name,
            ip: response.ip,
            port: response.port,
            account: response.account,
            password: response.password,
          });
        }
      );
    }
  }, [redis_id]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RedisInfoType>({
    defaultValues: initFormValue,
    resolver: zodResolver(registerSchema),
  });
  const closeDrawer = () => {
    reset(initFormValue);
    closeForm!();
  };
  const onSubmit: SubmitHandler<RedisInfoType> = (data) => {
    data.id = redis_id;
    invoke("redis_info_save", { redisInfo: { ...data } }).then((response) => {
      enqueueSnackbar(`${response}`, { variant: "success" });
      closeDrawer();
    }).catch((error) => {
      enqueueSnackbar(`${error}`, { variant: "error" });
    });
  };
  return (
    <Drawer
      PaperProps={{
        sx: {
          width: "40%",
        },
      }}
      onClose={closeDrawer}
      {...other}
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "10px",
          flexDirection: "column",
          "& .MuiTextField-root": { m: 1 },
        }}
      >
        <Stack spacing={2}>
          <Item>
            <TextField
              required
              id="name"
              label="名称"
              fullWidth
              error={!!errors["name"]}
              helperText={errors["name"] ? errors["name"].message : ""}
              {...register("name")}
            />
          </Item>
          <Item>
            <TextField
              required
              id="ip"
              label="IP地址"
              fullWidth
              error={!!errors["ip"]}
              helperText={errors["ip"] ? errors["ip"].message : ""}
              {...register("ip")}
            />
          </Item>
          <Item>
            <TextField
              required
              id="port"
              label="端口"
              fullWidth
              type="number"
              error={!!errors["port"]}
              helperText={errors["port"] ? errors["port"].message : ""}
              {...register("port")}
            />
          </Item>
          <Item>
            <TextField
              required
              id="account"
              label="账号"
              fullWidth
              error={!!errors["account"]}
              helperText={errors["account"] ? errors["account"].message : ""}
              {...register("account")}
            />
          </Item>
          <Item>
            <TextField
              required
              id="password"
              type="password"
              label="密码"
              fullWidth
              error={!!errors["password"]}
              helperText={errors["password"] ? errors["password"].message : ""}
              {...register("password")}
            />
          </Item>
        </Stack>
        <Box sx={{ flexGrow: 1, paddingLeft: "5px" }}></Box>
        <Divider />
        <BottomNavigation
          showLabels
          sx={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          <BottomNavigationAction
            type="submit"
            label="提交"
            icon={<Backup />}
          />
          <BottomNavigationAction
            onClick={closeDrawer}
            label="关闭"
            icon={<Cancel />}
          />
        </BottomNavigation>
      </Box>
    </Drawer>
  );
};

export default React.memo(InfoForm);
