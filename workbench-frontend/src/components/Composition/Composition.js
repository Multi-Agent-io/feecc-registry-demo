import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import React from "react";
import styles from "./Composition.module.css";
import {
  doCompositionUpload,
  doGetSchema,
  doGetUnitInformation,
  doRaiseNotification,
  doRemoveUnit,
  doSetSteps,
  doStartStepRecord,
  doStopStepRecord,
} from "@reducers/stagesActions";
import { push } from "connected-react-router";
import Stopwatch from "@components/Stopwatch/Stopwatch";
import PropTypes from "prop-types";
import {
  CircularProgress,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import { withSnackbar } from "notistack";
import { withContext } from "@reducers/context/withContext";
import { withTheme } from "@mui/styles";
import { LoadingButton } from "@mui/lab";

import ToMainMenuModal from "../Modals/ToMainMenu/ToMainMenuModal";
import ProceedNotSaved from "../Modals/ProceedNotSaved/ProceedNotSaved";
import RepeatCloseActionButton from "../RepeatCloseActionButton/RepeatCloseActionButton";
import {
  doUpdateCompositionTimer,
  newDoCompositionUpload,
  newDoRemoveUnit,
} from "../../reducers/stagesActions";

class Composition extends React.Component {
  static propTypes = {
    steps: PropTypes.array,
    unit: PropTypes.object,
    compositionOngoing: PropTypes.bool,
    compositionID: PropTypes.string,
    afterPause: PropTypes.string,
    pauseTimestamp: PropTypes.string,
    state: PropTypes.string,

    goToMenu: PropTypes.func.isRequired,
    startStepRecord: PropTypes.func.isRequired,
    stopStepRecord: PropTypes.func.isRequired,
    uploadComposition: PropTypes.func.isRequired,
    raiseNotification: PropTypes.func.isRequired,
    setSteps: PropTypes.func.isRequired,
    dropUnit: PropTypes.func.isRequired,
    doGetSchema: PropTypes.func.isRequired,
    doGetUnitDetails: PropTypes.func.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.stopwatches = [];
  }

  state = {
    activeStep: -1,
    afterPauseStep: -1,
    afterPauseStepName: "",
    stepDuration: 0,
    loading: [],
    onPause: false,
    afterPause: false,
  };

  closeButtonAction = (key) => (
    <div>
      <button
        className={styles.notificationButton}
        onClick={() => this.props.closeSnackbar(key)}
      >
        Close
      </button>
    </div>
  );

  setStepDuration = (duration) => {
    this.setState({ stepDuration: duration });
  };

  componentDidMount() {
    this.fetchComposition();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.compositionID !== this.props.compositionID) {
      // If compositionID changed - fetch composition
      this.fetchComposition();
    }
  }

  toggleButtonLoading(index, value, setCallback = () => {}) {
    let loading = this.state.loading;
    if (value === undefined) {
      loading[index] = !loading[index];
    } else {
      loading[index] = value;
    }
    this.setState({ loading }, setCallback);
  }

  fetchComposition() {
    if (
      this.props.compositionID !== "" &&
      this.props.compositionID !== undefined &&
      this.props.compositionID !== null
    ) {
      this.props.doGetUnitDetails(
        this.props.compositionID,
        (res) => {
          if (res.status_code === 200) {
            // console.log("Unit details received")
            let biography = [];
            if (res.unit_biography_completed.length > 0)
              biography = res.unit_biography_completed;
            if (res.unit_biography_pending.length > 0)
              biography = [...biography, ...res.unit_biography_pending];

            let inProgressFlag = false;
            // If this is not new unit -> set inProgressFlag to true
            if (res.unit_biography_completed.length > 0 || this.props.compositionOngoing) inProgressFlag = true;
            this.props.doGetSchema(
              res.schema_id,
              (innerRes) => {
                if (innerRes.status_code === 200) {
                  let newBiography = [];
                  try {
                    biography.map((item) => {
                      newBiography = [
                        ...newBiography,
                        innerRes.production_schema.production_stages.filter(
                          (v) => v.stage_id === item.stage_schema_entry_id
                        )[0],
                      ];
                    });
                  } catch (e) {
                    throw new Error(e);
                  }
                  this.props.setSteps(newBiography);
                  // If this is after pause or recovery
                  if (inProgressFlag) {
                    // console.log("detected in progress");
                    if (this.props.compositionOngoing) {
                      if (res.unit_biography_completed.length === 0) {
                        this.setState({ activeStep: 0 });
                        setTimeout(() => {
                          this.stopwatches[0]?.start();
                        }, 300);
                      } else if (res.unit_biography_pending.length > 0) {
                        this.setState({
                          activeStep: res.unit_biography_completed.length,
                        });
                        setTimeout(() => {
                          this.stopwatches[
                            res.unit_biography_completed.length
                          ]?.start();
                        }, 300);
                      }
                    } else {
                      if (res.unit_biography_pending.length > 0) {
                        this.setState({
                          afterPauseStep: res.unit_biography_completed.length,
                          afterPauseStepName:
                            res.unit_biography_pending[0].stage_name,
                        });
                      } else {
                        this.setState({
                          activeStep: res.unit_biography_completed.length,
                        });
                      }
                    }
                  }
                }
                return true;
              },
              null
            );
            return true;
          } else {
            this.props.enqueueSnackbar(
              `Failed to fetch unit information. Try again later. If the error returns, contact your system administrator. Error code: ${res.status_code}`,
              { variant: "error" }
            );
            // console.log("FETCH ERROR");
          }
        },
        (e) => {
          console.log(e);
        }
      );
    }
  }

  // Start record for the current step
  handleStageRecordStart(loadingNumber = 1) {
    return new Promise((resolve, reject) => {
      this.props.startStepRecord(
        {},
        (res) => {
          if (res.status_code === 200) {
            this.toggleButtonLoading(loadingNumber, false);
            resolve("OK");
            setTimeout(() => {
              this.stopwatches[this.state.activeStep]?.start();
            }, 300);
            return true;
          } else {
            this.props.enqueueSnackbar(
              `Failed to start stage recording. Try again later. If the error returns, contact your system administrator. Error code: ${res.status_code}`,
              { variant: "error" }
            );
            reject("Error during attempt to start recording");
            return false;
          }
        },
        null
      );
    });
  }

  // Stop record for the current step
  handleStageRecordStop(loadBlock = 1, isPause = false) {
    return new Promise((resolve, reject) => {
      this.toggleButtonLoading(loadBlock);
      this.props.stopStepRecord({}, isPause, (res) => {
        if (res.status_code === 200) {
          resolve("OK");
          return true;
        } else {
          this.props.enqueueSnackbar(
            `Failed to finish stage recording. If the error returns, contact your system administrator. Error code: ${res.status_code}`,
            { variant: "error" }
          );
          this.toggleButtonLoading(loadBlock);
          reject("Error during attempt to stop recording");
          return false;
        }
      });
    });
  }

  // Stop current record, start next and move step
  handleNextCompositionStep(nextTitle, nextStepID) {
    this.handleStageRecordStop()
      .then(() => this.handleStageRecordStart())
      .then(() => {
        this.setState({ activeStep: this.state.activeStep + 1 });
        document.getElementById(nextStepID).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
  }

  // Upload finished composition
  handleCompositionUpload() {
    this.toggleButtonLoading(2);
    this.props
      .newUploadComposition()
      .then(
        (res) =>
          new Promise((resolve, reject) => {
            this.props
              .newDropUnit()
              .then(() => {
                const resp = res.data.detail.split(" ");
                resolve(resp[resp.length - 1]);
              })
              .catch(reject);
          })
      )
      .then((unitID) => {
        this.toggleButtonLoading(2);
        this.props.enqueueSnackbar(
          `Certificate ${unitID} successfully uploaded to IPFS`,
          {
            variant: "success",
          }
        );
      })
      .catch((res) => {
        if (res !== undefined) {
          const bindObject = {
            action: () =>
              this.props.context.onOpen(
                <ProceedNotSaved
                  onNoSave={() => {
                    this.props.dropUnit();
                    this.props.closeSnackbar(this.state.proceedKey);
                  }}
                  unitID={this.props.compositionID}
                />
              ),
            actionName: "Continue without save",
          };
          const proceedKey = this.props.enqueueSnackbar(
            `Error fetching schema. Response code: ${res?.response?.status}`,
            {
              variant: "error",
              action: RepeatCloseActionButton.bind(bindObject),
              persist: true,
            }
          );
          this.setState({ proceedKey });
        }
        this.toggleButtonLoading(2);
      });
  }

  // Set this composition on pause and go to unit create selection
  setOnPause() {
    this.handleStageRecordStop(3).then(() =>
      this.props.dropUnit((res) => {
        if (res.status_code === 200) {
          this.toggleButtonLoading(3);
          return true;
        } else {
          this.props.enqueueSnackbar(
            `Failed to remove unit from the workbench. If the error returns, contact your system administrator. Error code: ${res.status_code}`,
            { variant: "error" }
          );
          return false;
        }
      }, null)
    );
  }

  setOnSmallPause() {
    this.handleStageRecordStop(2, true).then(() => {
      this.toggleButtonLoading(2);
      this.setState({ onPause: true });
    });
  }

  unpause() {
    this.handleStageRecordStart(
      this.props.steps[this.state.activeStep].name,
      2
    ).then(() => this.setState({ onPause: false }));
  }

  cancelComposition() {
    this.toggleButtonLoading(2);
    return new Promise((resolve) => {
      this.props.dropUnit((res) => {
        if (res.status_code === 200) {
          setTimeout(() => {
            this.toggleButtonLoading(2);
          }, 400);
          resolve("OK");
          return true;
        } else {
          this.props.enqueueSnackbar(
            `Failed to remove unit from the workbench. If the error returns, contact your system administrator. Error code: ${res.status_code}`,
            { variant: "error" }
          );
          return false;
        }
      }, null);
    });
  }

  proceedComposition() {
    this.handleStageRecordStart().then(() => {
      this.setState({ activeStep: this.state.afterPauseStep });
    });
  }

  timeToRegular = (seconds) => {
    if (seconds === undefined) seconds = 0;
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };

  render() {
    const { t } = this.props;
    const { activeStep, loading, onPause, afterPauseStepName } = this.state;
    return (
      <div className={styles.wrapper}>
        {activeStep === -1 && this.state.afterPauseStep === -1 && (
          <div className={styles.buttonsWrapper}>
            <div className={styles.button}>
              <LoadingButton
                size="medium"
                loadingIndicator={
                  <CircularProgress color="inherit" size={28} />
                }
                variant="contained"
                color="primary"
                disabled={loading[1]}
                loading={loading[1]}
                onClick={() => {
                  this.handleStageRecordStart(this.props.steps[0]?.name).then(
                    () => {
                      this.setState({ activeStep: this.state.activeStep + 1 });
                      document.getElementById("step_0").scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  );
                }}
              >
                {t("StartComposition")}
              </LoadingButton>
            </div>
            <div className={styles.button}>
              <LoadingButton
                size="medium"
                loadingIndicator={
                  <CircularProgress color="inherit" size={28} />
                }
                variant="outlined"
                color="secondary"
                disabled={loading[2]}
                loading={loading[2]}
                onClick={() => {
                  if (this.props.composition.unit_components !== null) {
                    this.props.context.onOpen(
                      <ToMainMenuModal
                        onReturn={() => {
                          this.cancelComposition().then(() => {
                            this.props.context.onClose();
                            this.props.goToMenu();
                          });
                        }}
                        onProceed={() => this.props.context.onClose()}
                      />
                    );
                  } else {
                    this.cancelComposition().then(() => this.props.goToMenu());
                  }
                }}
              >
                {t("CancelComposition")}
              </LoadingButton>
            </div>
          </div>
        )}
        {activeStep === -1 && this.state.afterPauseStep !== -1 && (
          <div>
            <div className={styles.textWrapper}>
              {t("DropWarning")}
              {t("CompositionWillProceedFrom")}
              <div className={styles.boldText}> "{afterPauseStepName}".</div>
            </div>
            <div className={styles.buttonsWrapper}>
              <div className={styles.button}>
                <LoadingButton
                  size="medium"
                  loadingIndicator={
                    <CircularProgress color="inherit" size={28} />
                  }
                  variant="contained"
                  color="primary"
                  disabled={loading[1]}
                  loading={loading[1]}
                  onClick={() => {
                    this.proceedComposition();
                  }}
                >
                  {t("ProceedComposition")}
                </LoadingButton>
              </div>
              <div className={styles.button}>
                <LoadingButton
                  size="medium"
                  loadingIndicator={
                    <CircularProgress color="inherit" size={28} />
                  }
                  variant="outlined"
                  color="secondary"
                  disabled={loading[2]}
                  loading={loading[2]}
                  onClick={() =>
                    this.cancelComposition().then(() =>
                      setTimeout(() => this.props.goToMenu(), 400)
                    )
                  }
                >
                  {t("CancelComposition")}
                </LoadingButton>
              </div>
            </div>
          </div>
        )}
        <Stepper
          className={styles.stepper}
          activeStep={activeStep}
          orientation="vertical"
        >
          {this.props.steps?.map((item, index) => (
            <Step id={`step_${index}`} key={item.description + index}>
              <StepLabel>
                <div
                  className={
                    index === this.state.afterPauseStep && activeStep === -1
                      ? styles.nextStep
                      : ""
                  }
                >
                  {item.name}
                </div>
              </StepLabel>
              <StepContent>
                <Typography>{item.description}</Typography>
                <div>
                  <div className={styles.controls}>
                    <div className={styles.button}>
                      <LoadingButton
                        size="medium"
                        loadingIndicator={
                          <CircularProgress color="inherit" size={28} />
                        }
                        variant="contained"
                        color="primary"
                        loading={loading[1]}
                        disabled={loading[1] || onPause}
                        onClick={() => {
                          if (activeStep === this.props.steps?.length - 1) {
                            this.handleStageRecordStop().then(() => {
                              // this.props.setBetweenFlag(false);
                              this.props.updateCompositionTimer(false);
                              this.setState({
                                activeStep: activeStep + 1,
                                loading_1: false,
                              });
                              document
                                .getElementById("savePassportButton")
                                .scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                            });
                          } else {
                            this.handleNextCompositionStep(
                              this.props.steps[index + 1]?.name,
                              `step_${index + 1}`
                            );
                          }
                        }}
                      >
                        {activeStep === this.props.steps?.length - 1
                          ? t("Finish")
                          : t("Next")}
                      </LoadingButton>
                    </div>
                    <div className={styles.button}>
                      <LoadingButton
                        size="medium"
                        loadingIndicator={
                          <CircularProgress color="inherit" size={28} />
                        }
                        variant="outlined"
                        color="primary"
                        loading={loading[2]}
                        disabled={loading[2]}
                        onClick={() => {
                          if (!onPause) {
                            this.setOnSmallPause();
                            this.stopwatches[index].stop();
                          } else {
                            this.unpause();
                            this.stopwatches[index].start();
                          }
                        }}
                      >
                        {onPause ? "Continue" : t("SetOnPause")}
                      </LoadingButton>
                    </div>
                    {activeStep !== this.props.steps?.length - 1 && (
                      <div>
                        <div className={styles.button}>
                          <LoadingButton
                            size="large"
                            loadingIndicator={
                              <CircularProgress color="inherit" size={28} />
                            }
                            variant="outlined"
                            color="secondary"
                            loading={loading[3]}
                            disabled={loading[3] || onPause}
                            onClick={() => this.setOnPause()}
                          >
                            {t("FinishStep")}
                          </LoadingButton>
                        </div>
                      </div>
                    )}
                    <div className={styles.timerWrapper}>
                      <Stopwatch
                        setStepDuration={this.setStepDuration}
                        ref={(item) => (this.stopwatches[index] = item)}
                      />
                      {item.duration_seconds !== 0 &&
                        this.timeToRegular(item.duration_seconds)}
                    </div>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === this.props.steps?.length && (
          <div className={styles.controls}>
            <div className={styles.button}>
              <LoadingButton
                size="medium"
                loadingIndicator={
                  <CircularProgress color="inherit" size={28} />
                }
                className={styles.button}
                id="savePassportButton"
                variant="contained"
                color="primary"
                loading={loading[2]}
                disabled={loading[2]}
                onClick={() => this.handleCompositionUpload()}
              >
                {t("SavePassport")}
              </LoadingButton>
            </div>
            <div className={styles.button}>
              <LoadingButton
                size="medium"
                loadingIndicator={
                  <CircularProgress color="inherit" size={28} />
                }
                className={styles.button}
                id="savePassportButton"
                variant="outlined"
                color="secondary"
                loading={false}
                disabled={false}
                onClick={() =>
                  this.props.context.onOpen(
                    <ProceedNotSaved
                      onNoSave={() => this.props.newDropUnit()}
                      unitID={this.props.compositionID}
                    />
                  )
                }
              >
                Continue without save
              </LoadingButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withSnackbar(
  withContext(
    withTheme(
      withTranslation()(
        connect(
          (store) => ({
            steps: store.stages.get("steps")?.toJS(),
            unit: store.stages.get("unit")?.toJS(),
            composition: store.stages.get("composition")?.toJS(),
            compositionOngoing: store.stages.getIn([
              "composition",
              "operation_ongoing",
            ]),
            compositionID: store.stages.getIn([
              "composition",
              "unit_internal_id",
            ]),
            afterPause: new URLSearchParams(store.router.location.search).get(
              "afterPause"
            ),
            pauseTimestamp: new URLSearchParams(
              store.router.location.search
            )?.get("timestamp"),
            state: store.stages.getIn(["composition", "state"]),
          }),
          (dispatch) => ({
            goToMenu: () => dispatch(push("/menu")),
            startStepRecord: (additionalInfo, successChecker, errorChecker) =>
              doStartStepRecord(
                dispatch,
                additionalInfo,
                successChecker,
                errorChecker
              ),
            stopStepRecord: (
              additionalInfo,
              prematureEnding,
              successChecker,
              errorChecker
            ) =>
              doStopStepRecord(
                dispatch,
                additionalInfo,
                prematureEnding,
                successChecker,
                errorChecker
              ),
            uploadComposition: (successChecker, errorChecker) =>
              doCompositionUpload(dispatch, successChecker, errorChecker),
            newUploadComposition: () => newDoCompositionUpload(dispatch),
            raiseNotification: (notificationMessage) =>
              doRaiseNotification(dispatch, notificationMessage),
            setSteps: (steps) => doSetSteps(dispatch, steps),
            dropUnit: (successChecker, errorChecker) =>
              doRemoveUnit(dispatch, successChecker, errorChecker),
            newDropUnit: () => newDoRemoveUnit(dispatch),
            doGetSchema: (schemaId, successChecker, errorChecker) =>
              doGetSchema(dispatch, schemaId, successChecker, errorChecker),
            doGetUnitDetails: (unitID, successChecker, errorChecker) =>
              doGetUnitInformation(
                dispatch,
                unitID,
                successChecker,
                errorChecker
              ),
            updateCompositionTimer: (value) =>
              doUpdateCompositionTimer(dispatch, value),
          })
        )(Composition)
      )
    )
  )
);
