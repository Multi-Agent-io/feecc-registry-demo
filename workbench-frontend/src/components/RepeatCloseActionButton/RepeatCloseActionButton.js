import React from "react";
import styles from "./RepeatCloseActionButton.module.css";
import { useSnackbar } from "notistack";

function RepeatCloseActionButton(key) {
  const { closeSnackbar } = useSnackbar();

  return (
    <div className={styles.notificationButtons}>
      <button
        className={styles.notificationButton}
        onClick={this.action}
      >
        {this.actionName}
      </button>
      <button
        className={styles.notificationButton}
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        Закрыть
      </button>
    </div>
  );
}

export default RepeatCloseActionButton;
