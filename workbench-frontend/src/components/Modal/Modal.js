import React, { useContext } from 'react'
import ModalActionsContext from "@reducers/context/modal-context";

import styles from './Modal.module.css'

export const Modal = () => {
  const {visible, onClose, content} = useContext(ModalActionsContext)

  return (
    <div>
      { visible && (
        <div>
          <div className={ styles.modalBackdrop } onClick={ () => onClose() }/>
          <div className={ styles.modalContentWrapper }>
            <div className={styles.modalContent}>
              { content }
            </div>
          </div>
        </div>
      ) }
    </div>
  )
}