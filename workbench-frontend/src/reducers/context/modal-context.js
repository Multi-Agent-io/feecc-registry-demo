import React from 'react'

const ModalActionsContext = React.createContext({
  onOpen: () => {},
  onClose: () => {}
})

export default  ModalActionsContext

