import { Paper, styled } from "@mui/material";
import React from "react";
import KeyForm from "./KeyForm";
import KeyInfo from "./KeyInfo";

const KeysContainer = ({
  selectKey,
}: {
  selectKey?: string;
}) => {
  if (selectKey) {
    return <KeyInfo selectKey={selectKey} />;
  } else {
    return <KeyForm />;
  }
};

export default React.memo(KeysContainer);
