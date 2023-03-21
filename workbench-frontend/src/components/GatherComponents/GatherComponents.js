import { withTranslation } from "react-i18next"
import { connect } from "react-redux"
import React from 'react'
import styles from './GatherComponents.module.css'
import { withTheme } from "@mui/styles";
import { LoadingButton } from "@mui/lab";
import { doGetSchema, doRaiseNotification, doRemoveUnit } from "@reducers/stagesActions";
import { CircularProgress, Paper } from "@mui/material";

export default withTheme(withTranslation()(connect(
  (store) => ({
    unitComponents: store.stages.getIn(['composition', 'unit_components'])?.toJS()
  }),
  (dispatch) => ({
    dropUnit: (successChecker, errorChecker) => doRemoveUnit(dispatch, successChecker, errorChecker),
    doGetSchema: (schemaId, successChecker, errorChecker) => doGetSchema(dispatch, schemaId, successChecker, errorChecker),
    raiseNotification: (notificationMessage) => doRaiseNotification(dispatch, notificationMessage),
  })
)(class GatherComponents extends React.Component {

  state = {
    loading: false,
    schemas: {}
  }
  componentDidMount () {
    if (this.props.unitComponents !== undefined && this.props.unitComponents !== null){
      for (let schemeID in this.props.unitComponents) {
        this.props.doGetSchema(
          schemeID,
          (res) => {
            if(res.status_code === 200){
              let obj = {...this.state.schemas}
              obj[schemeID] = res.production_schema
              this.setState({schemas: {...obj}})
              return true
            } else {
              this.props.raiseNotification('Error fetching schema information. Try rebooting the page.')
              return false
            }
          }, null
          )
      }
      // setTimeout(() => {
      //   // console.log('schemas received')
      //   // console.log(this.state.schemas)
      // },1000)


    }
  }

  render () {
    const {t, unitComponents} = this.props
    const {loading, schemas}  = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.cancelButton}>
          <LoadingButton
            loadingIndicator={<CircularProgress color='inherit' size={28}/>}
            variant='outlined'
            color='secondary'
            disabled={loading}
            loading={loading}
            onClick={() => {
              this.setState({loading: true})
              this.props.dropUnit(
                (res) => {
                  if(res.status_code === 200) {
                    setTimeout(() => this.setState({loading: false}), 400)
                    return true
                  } else {
                    return false
                  }
                }, null
              )
            }}
          >{t('CancelComposition')}</LoadingButton>
        </div>
        <div className={styles.header}>{t('RequiredComponents')}</div>
        <div className={styles.componentsWrapper}>
          {unitComponents && Object.keys(unitComponents).map((item, index) => {
            return (
              <Paper key={item} elevation={Object.values(unitComponents)[index] === null ? 10 : 5} sx={{padding: '20px', borderRadius: '20px'}}>
                <div
                  className={styles.component + ' ' + (Object.values(unitComponents)[index] === null ? styles.missingComponent : styles.addedComponent)}
                >{schemas[item]?.unit_name}</div>
              </Paper>
            )
          })}
        </div>
      </div>
    )
  }
})))
