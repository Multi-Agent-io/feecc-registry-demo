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
        Continuing <strong>without</strong> requires you to do some exact actions later.
        Without them the unit will not considered finished. Unit data <strong>was not</strong> uploaded to IPFS,
        but they <strong>are stored locally</strong> and you can always return to this unit later.
        <br />
        <br />
        When possible to save, yuo are required to:
        <br />
        - Scan unit barcode.
        <br />
        - Save the certificate.
        <br />
        <br />
        If succeeded? the unit certificate will be saved in the blockchain. If any error appears, contact administrator.
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
              `Certificate ${props.unitID} was not saved in IPFS. You are to return to it later.`,
              { variant: "warning", action: CloseActionButton }
            );
            onClose();
          }}
        >
          Proceed without save
        </LoadingButton>
        <LoadingButton
          size="large"
          loadingIndicator={<CircularProgress color="inherit" size={28} />}
          loading={false}
          color="primary"
          variant="contained"
          onClick={onClose}
        >
          Back
        </LoadingButton>
      </div>
    </div>
  );
};

export default ProceedNotSaved;
