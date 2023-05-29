import React, { useContext } from "react";
import ModalActionsContext from "@reducers/context/modal-context";
import { LoadingButton } from "@mui/lab";
import { CircularProgress } from "@mui/material";
import styles from "./ProceedNotSaved.module.css";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import CloseActionButton from "../../CloseActionButton/CloseActionButton";

const ProceedNotSaved = (props) => {
  const { onClose } = useContext(ModalActionsContext);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.contentHeader}>{t("ImportantMessage")}</div>
      <div className={styles.contentText}>
        Продолжение <strong>без</strong> сохранения требует действий в дальнейшем.
        Без их выполнения изделие не будет завершенным. Данные об изделии <strong>не были</strong> выгружены в сеть IPFS,
        они были <strong>сохранены локально</strong>, вы всегда можете вернуться к сборке.
        <br />
        <br />
        Чтобы вернуться к сборке изделия, необходимо бужет выполнить следующее:
        <br />
        - Отсканировать штрих-код изделия.
        <br />
        - Сохранить сертификат изделия.
        <br />
        <br />
        При отсутствии ошибок сертификат будет выгружен в сеть IPFS и сеть Robonomics.
      </div>
      <div className={styles.buttonsWrapper}>
        <LoadingButton
          size="large"
          loadingIndicator={<CircularProgress color="inherit" size={28} />}
          loading={false}
          color="secondary"
          variant="outlined"
          onClick={() => {
            props.onNoSave && props.onNoSave();
            enqueueSnackbar(
              `Сертификат ${props.unitID} не был выгружен в сеть IPFS. необходимо вернуться к нему позже.`,
              { variant: "warning", action: CloseActionButton }
            );
            onClose();
          }}
        >
          Продолжить без сохранения
        </LoadingButton>
        <LoadingButton
          size="large"
          loadingIndicator={<CircularProgress color="inherit" size={28} />}
          loading={false}
          color="primary"
          variant="contained"
          onClick={onClose}
        >
          Назад
        </LoadingButton>
      </div>
    </div>
  );
};

export default ProceedNotSaved;
