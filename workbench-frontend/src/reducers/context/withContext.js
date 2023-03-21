import ModalActionsContext from "@reducers/context/modal-context"
import React from 'react'

export const withContext = Component => {
  return props => {
    return (
    <ModalActionsContext.Consumer>
      { context => {
        return <Component { ...props } context={ context }/>
      } }
    </ModalActionsContext.Consumer>
    )
  }
}