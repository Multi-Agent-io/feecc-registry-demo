import React, { useContext } from 'react'
import ModalActionsContext from "@reducers/context/modal-context";
import { LoadingButton } from "@mui/lab"
import { CircularProgress } from '@mui/material'
import styles from './ToMainMenuModal.module.css'
import { useTranslation } from "react-i18next";

const ToMainMenuModal = (props) => {
  const {onClose} = useContext(ModalActionsContext)

  const {t} = useTranslation()

  return (<div className={ styles.contentWrapper }>
    <div className={ styles.contentHeader }>{t('ImportantMessage')}</div>
    <div className={ styles.contentText }>
      {t('YouAreTryingToCancel')} <strong>{t('Final')}</strong> {t('composition')}. {t('YouHaveToAcknowledge')}: {t('UsedComponentsAreNowNotAvailableForOthers')}. {t('RecommendToFinish')}. {t('YouCanRecoverThisCompositionByScanningCode')}.
      <br/>
      <br/>
      {t('YouCanChooseWhatToDoNext')}.
    </div>
    <div className={ styles.buttonsWrapper }>
      <LoadingButton
        size='large'
        loadingIndicator={ <CircularProgress color='inherit' size={ 28 }/> }
        loading={ false }
        color='secondary'
        variant='outlined'
        onClick={() => {
          props.onReturn && props.onReturn()
        }}
      >{t('BackToMenu')}
      </LoadingButton>
      <LoadingButton
        size='large'
        loadingIndicator={ <CircularProgress color="inherit" size={ 28 }/> }
        loading={ false }
        color='primary'
        variant='contained'
        onClick={() => {
          props.onProceed && props.onProceed()
        }}
      >{t('ProceedComposition')}</LoadingButton>
    </div>
  </div>)
}

export default ToMainMenuModal;
