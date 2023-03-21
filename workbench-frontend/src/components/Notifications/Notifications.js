import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import React from 'react'
import styles from './Notifications.module.css'
import { ReactComponent as Close } from '../../icons/close_popup.svg'
import { doRemoveNotification } from "@reducers/stagesActions";
import { Paper } from "@mui/material"
import { withStyles } from "@mui/styles"

const stylesMaterial = {
  root: {
    display : 'flex',
    flexWrap: 'wrap',
    borderRadius: '15px',
    marginTop: '20px',
    // border: '2px solid red',
    '& > *' : {
      margin: '20px',
    },
  },
}

export default withStyles(stylesMaterial)(withTranslation()(connect(
  (store) => ({
    notifications: store.stages.get('modalsNotifications').toJS()
  }),
  (dispatch) => ({
    closeNotification: (notificationID) => doRemoveNotification(dispatch, notificationID)
  })
)(class Notifications extends React.Component {

  renderNotificationCard = (id, message) => {
    const { classes } = this.props
    // console.log(this.props.notifications)
    return (
      <Paper key={message + id.toString()} elevation={10} className={classes.root}>
        <div key={message + id.toString()} className={styles.messageFrame}>
          <div className={styles.messageText}>
            {message}
          </div>
          <Close className={styles.close} onClick={() => this.props.closeNotification(id)}/>
        </div>
      </Paper>
    )
  }

  render() {
    const { notifications } = this.props
    return (
      <div className={styles.messagesWrapper}>
        {Object.entries(notifications)?.map(item => (
          this.renderNotificationCard(item[0], item[1])
        ))}
      </div>
    )
  }
})))
