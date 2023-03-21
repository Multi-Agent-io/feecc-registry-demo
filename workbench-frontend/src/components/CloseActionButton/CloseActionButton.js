import React from "react";
import styles from "./CloseActionButton.module.css";
import { useSnackbar } from "notistack";

const CloseActionButton = (key) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <button
      className={styles.notificationButton}
      onClick={() => closeSnackbar(key)}
    >
      Close
    </button>
  );
};

export default CloseActionButton;
