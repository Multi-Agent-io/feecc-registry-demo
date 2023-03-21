import React, { useState } from "react"
import ModalActionsContext from "@reducers/context/modal-context"


const ModalProvider = (props) => {

  const [visible, setVisibility] = useState(false)
  const [content, setContent] = useState('')

  function openModal(content) {
    setContent(content)
    setVisibility(true)
  }

  function closeModal() {
    setContent('')
    setVisibility(false)
  }

  const modalValues = {
    onOpen: openModal,
    onClose: closeModal,

    visible: visible,
    content: content
  }

  return (
    <ModalActionsContext.Provider value={ modalValues }>
      { props.children }
    </ModalActionsContext.Provider>
  )
}

export default ModalProvider