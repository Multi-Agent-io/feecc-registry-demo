import React, { useContext } from "react";
import ModalActionsContext from "@reducers/context/modal-context";
import { LoadingButton } from "@mui/lab";
import { CircularProgress } from "@mui/material";
import styles from "./ReloadWarning.module.css";
import { useTranslation } from "react-i18next";

const ReloadWarning = (props) => {
  const { onClose } = useContext(ModalActionsContext);
  const { t } = useTranslation();

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.contentHeader}>{t("ImportantMessage")}</div>
      <div className={styles.contentText}>
        You are about to reload the page. <br/>This <strong>may</strong>, but <strong>should not</strong> lead to any errors on this stage.
        Do not reload the page if possible.
      </div>
      <div className={styles.buttonsWrapper}>
        <LoadingButton
          size="large"
          loadingIndicator={<CircularProgress color="inherit" size={28} />}
          loading={false}
          color="secondary"
          variant="outlined"
          onClick={props.reloadAction}
        >
          Reload
        </LoadingButton>
        <LoadingButton
          size="large"
          loadingIndicator={<CircularProgress color="inherit" size={28} />}
          loading={false}
          color="primary"
          variant="contained"
          onClick={onClose}
        >
          Close
        </LoadingButton>
      </div>
    </div>
  );
};

export default ReloadWarning;
