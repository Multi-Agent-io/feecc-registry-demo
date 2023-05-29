import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from "react";
import styles from "./Menu.module.css";
import {
  doAssignUnit,
  doCreateUnit,
  doGetSchema,
  doGetSchemasNames,
  doLogout,
  doRaiseNotification,
  doSetSteps,
} from "@reducers/stagesActions";
import PropTypes from "prop-types";
import { push } from "connected-react-router";
import { Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { withSnackbar } from "notistack";
import { withTheme } from "@mui/styles";
import { doFetchRevisions } from "@reducers/RevisionsActions";
import {
  newDoAssignUnit,
  newDoCreateUnit,
  newDoGetSchema,
} from "../../reducers/stagesActions";

export default withSnackbar(
  withTheme(
    withTranslation()(
      connect(
        (store) => ({
          unitID: store.stages.getIn(["unit", "unit_internal_id"]),
          schemas: store.stages.get("productionSchemas").toJS(),
          authorized: store.stages.getIn(["composition", "employee_logged_in"]),
        }),
        (dispatch) => ({
          raiseNotification: (notificationMessage) =>
            doRaiseNotification(dispatch, notificationMessage),
          createUnit: (schemaID, successChecker, errorChecker) =>
            doCreateUnit(dispatch, schemaID, successChecker, errorChecker),
          newCreateUnit: (schemaID) => newDoCreateUnit(dispatch, schemaID),
          doAssignUnit: (unit_id, successChecker, errorChecker) =>
            doAssignUnit(dispatch, unit_id, successChecker, errorChecker),
          newDoAssignUnit: (unitID) => newDoAssignUnit(dispatch, unitID),
          doGetSchema: (schemaId, successChecker, errorChecker) =>
            doGetSchema(dispatch, schemaId, successChecker, errorChecker),
          newDoGetSchema: (schemaId) => newDoGetSchema(dispatch, schemaId),
          doGetSchemasNames: (successChecker, errorChecker) =>
            doGetSchemasNames(dispatch, successChecker, errorChecker),
          doLogout: (successChecker, errorChecker) =>
            doLogout(dispatch, successChecker, errorChecker),
          doRedirectToComposition: () => dispatch(push("/composition")),
          fetchRevisions: (successChecker, errorChecker) =>
            doFetchRevisions(dispatch, successChecker, errorChecker),
          setSteps: (steps) => doSetSteps(dispatch, steps),
        })
      )(
        class Menu extends React.Component {
          static propTypes = {
            authorized: PropTypes.bool,
            unitID: PropTypes.string,
            raiseNotification: PropTypes.func.isRequired,
            createUnit: PropTypes.func.isRequired,
            doLogout: PropTypes.func.isRequired,
          };

          state = {
            logoutLoading: false,
            chooseVariantModal: 0,
            loading: [],
            selectedScheme: {},
          };

          componentDidMount() {
            // Getting all products marked for revision
            this.props.fetchRevisions((res) => {
              return true;
            }, null);


            this.props.doGetSchemasNames((res) => {
              if (res.status_code === 200) {
                if (
                  res.available_schemas.length === 0 &&
                  this.props.authorized
                ) {
                  this.props.enqueueSnackbar(
                    "Внимание! Доступно 0 схем, обратитесь к администратору.",
                    { variant: "warning" }
                  );
                }
                return true;
              } else {
                return false;
              }
            }, null);
          }

          toggleButtonLoading(index, setCallback = () => {}) {
            let loading = this.state.loading;
            loading[index] = !loading[index];
            this.setState({ loading }, setCallback);
          }

          handleCreateUnit = (item, index) => {
            this.toggleButtonLoading(index);
            this.props
              .newDoGetSchema(item.schema_id)
              .then(
                (res) =>
                  new Promise((resolve, reject) => {
                    let schema = res.data.production_schema;
                    // Check if the whole scheme is empty
                    if (schema === null) {
                      this.props.enqueueSnackbar(
                        "Ошибка. Такая схема отсутствует. Обратитесь к администратору.",
                        { variant: "error" }
                      );
                      reject(res);
                    }
                    // Check if this scheme has no stages at all
                    if (schema.production_stages === null) {
                      this.props.enqueueSnackbar(
                        "Ошибка. Схема не содержит этапов. Обратитесь к администратору.",
                        { variant: "error" }
                      );
                      reject(res);
                    }
                    this.props.setSteps(schema.production_stages);
                    resolve({...res, schemaID: item.schema_id});
                  })
              )
              .then(
                (res) =>
                  new Promise((resolve, reject) => {
                    this.props
                      .newCreateUnit(res.schemaID)
                      .then((r) => {
                        resolve({
                          schema: res.production_schema,
                          unitID: r.data.unit_internal_id,
                        })}
                      )
                      .catch(reject);
                  })
              )
              .then(({schema, unitID}) => new Promise((resolve, reject) => {
                this.props.newDoAssignUnit(unitID).then(resolve(schema)).catch(reject)
              })).then((res) => {
                this.toggleButtonLoading(index);
              })
              .catch((err) => {
                this.toggleButtonLoading(index);
                // console.log("Error");
                // console.log(err);
              });
          };

          handleUserLogout = () => {
            this.setState({ logoutLoading: true });
            this.props.doLogout(
              () => {
                this.setState({ logoutLoading: false });
                return true;
              },
              () => {
                this.setState({ logoutLoading: false });
                return false;
              }
            );
          };

          render() {
            const { t, schemas } = this.props;
            const { loading, logoutLoading, chooseVariantModal } = this.state;
            return (
              <div className={styles.wrapper}>
                {/* Default view. Choose unit to complete or logout */}
                {chooseVariantModal <= 1 && (
                  <div>
                    <div className={styles.header}>
                      {t("SpecifyCompositionType")}
                    </div>
                    <div className={styles.variantsWrapper}>
                      {schemas?.map((item, index) => {
                        let show_flag = !item.schema_id.startsWith("test_");
                        if (process.env.SHOW_TEST_SCHEMAS && !show_flag)
                          show_flag = true;
                        if (show_flag)
                          return (
                            <div
                              key={item.schema_id}
                              className={styles.buttons}
                            >
                              <LoadingButton
                                size="large"
                                loadingIndicator={
                                  <CircularProgress color="inherit" size={28} />
                                }
                                loading={loading[index]}
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                  if (item.included_schemas !== null) {
                                    this.setState(
                                      {
                                        selectedScheme: item,
                                        chooseVariantModal: 2,
                                      },
                                      () =>
                                        console.log(this.state.selectedScheme)
                                    );
                                  } else {
                                    this.handleCreateUnit(item, index);
                                  }
                                }}
                              >
                                {item.schema_name}
                              </LoadingButton>
                            </div>
                          );
                      })}
                    </div>
                    <div className={styles.buttonsWrapper}>
                      <div className={styles.buttons}>
                        <div className={styles.buttons}>
                          <LoadingButton
                            size="large"
                            loadingIndicator={
                              <CircularProgress color="inherit" size={28} />
                            }
                            loading={logoutLoading}
                            color="secondary"
                            variant="outlined"
                            onClick={this.handleUserLogout}
                          >
                            {t("FinishSession")}
                          </LoadingButton>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Composite unit mode. If you select on the first step composite unit then you have to select subunit */}
                {chooseVariantModal === 2 && (
                  <div>
                    <div className={styles.header}>
                      {this.state.selectedScheme.schema_name}
                    </div>
                    <div className={styles.subheader}>
                      {t("SelectOneOfTheFollowingCompositions")}
                    </div>
                    <div className={styles.schemeDetailsWrapper}>
                      <div className={styles.buttons}>
                        <LoadingButton
                          size="large"
                          loadingIndicator={
                            <CircularProgress color="inherit" size={28} />
                          }
                          loading={logoutLoading}
                          color="secondary"
                          variant="outlined"
                          onClick={() =>
                            this.setState({ chooseVariantModal: 1 })
                          }
                        >
                          {t("Back")}
                        </LoadingButton>
                      </div>
                      <div>
                        {this.state.selectedScheme.included_schemas.map(
                          (item, index) => {
                            return (
                              <div
                                key={item.schema_id}
                                className={styles.buttons}
                              >
                                <LoadingButton
                                  size="large"
                                  loadingIndicator={
                                    <CircularProgress
                                      color="inherit"
                                      size={28}
                                    />
                                  }
                                  loading={loading[index]}
                                  color="primary"
                                  variant="contained"
                                  onClick={() => {
                                    this.handleCreateUnit(item, index);
                                  }}
                                >
                                  {item.schema_name}
                                </LoadingButton>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className={styles.buttons}>
                        <LoadingButton
                          size="large"
                          loadingIndicator={
                            <CircularProgress color="inherit" size={28} />
                          }
                          loading={
                            loading[
                              this.state.selectedScheme.included_schemas
                                .length + 1
                            ]
                          }
                          color="primary"
                          variant="outlined"
                          onClick={() =>
                            this.handleCreateUnit(
                              this.state.selectedScheme,
                              this.state.selectedScheme.included_schemas
                                .length + 1
                            )
                          }
                        >
                          {t("FinishingSteps")}
                        </LoadingButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        }
      )
    )
  )
);
