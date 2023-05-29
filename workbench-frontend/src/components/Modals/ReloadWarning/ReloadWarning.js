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
        Вы собираетесь перезагрузить страницу. <br/>Это <strong>может</strong>, но <strong>не должно</strong> вызвать некоторые ошибки.
        По возможности не перезагружайте страницу.
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
          Перезагрузить
        </LoadingButton>
        <LoadingButton
          size="large"
          loadingIndicator={<CircularProgress color="inherit" size={28} />}
          loading={false}
          color="primary"
          variant="contained"
          onClick={onClose}
        >
          Закрыть
        </LoadingButton>
      </div>
    </div>
  );
};

export default ReloadWarning;
