import { axiosWrapper, fetchWrapper, types } from "@reducers/common";
import store from "./main";
import axios from "axios";
import { promiseAxiosWrapper } from "./common";

export const doFetchComposition = (dispatch, composition) => {
  dispatch({ type: types.STAGES__FETCH_COMPOSITION, ...composition });
};

// Reworked
export const doFetchComposition_deprecated = (
  dispatch,
  successChecker,
  errorChecker
) => {
  // To check if one record stopped and new started without /status request as it drops composition timer
  if (!store.getState().stages.get("betweenEndAndStartFlag")) {
    fetchWrapper(
      dispatch,
      `/workbench/status`,
      types.STAGES__FETCH_COMPOSITION,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
      successChecker
    ).then(errorChecker);
  }
};
// Reworked
export const doCreateUnit = (
  dispatch,
  schemaID,
  successChecker,
  errorChecker
) => {
  axiosWrapper(
    dispatch,
    types.STAGES__CREATE_NEW_UNIT,
    {
      method: "post",
      url: `${process.env.APPLICATION_SOCKET}/unit/new/${schemaID}`,
    },
    successChecker
  ).then(errorChecker);
};

export const newDoCreateUnit = (dispatch, schemaID) => {
  // console.log('new create unit')
  return new Promise((resolve, reject) => {
    promiseAxiosWrapper(dispatch, types.STAGES__CREATE_NEW_UNIT, {
      method: "post",
      url: `${process.env.APPLICATION_SOCKET}/unit/new/${schemaID}`,
    })
      .then(resolve)
      .catch(reject);
  });
};
// Reworked
export const doAssignUnit = (
  dispatch,
  unit_id,
  successChecker,
  errorChecker
) => {
  axiosWrapper(
    dispatch,
    undefined,
    {
      method: "post",
      url: `${process.env.APPLICATION_SOCKET}/workbench/assign-unit/${unit_id}`,
    },
    successChecker
  ).then(errorChecker);
};

export const newDoAssignUnit = (dispatch, unitID) => {
  return new Promise((resolve, reject) => {
    promiseAxiosWrapper(dispatch, undefined, {
      method: "post",
      url: `${process.env.APPLICATION_SOCKET}/workbench/assign-unit/${unitID}`,
    })
      .then(resolve)
      .catch(reject);
  });
};
// Reworked
export const doLogout = (dispatch, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__FETCH_COMPOSITION,
    {
      method: "post",
      url: `${process.env.APPLICATION_SOCKET}/employee/log-out`,
      data: {
        workbench_no: store.getState().stages.get("workbench_no"),
      },
    },
    successChecker
  ).then(errorChecker);
};
// Reworked
export const doGetSchemasNames = (dispatch, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__SET_PRODUCTION_SCHEMAS,
    {
      method: "get",
      url: `${process.env.APPLICATION_SOCKET}/workbench/production-schemas/names`,
    },
    successChecker
  ).then(errorChecker);
};
// Reworked
export const doGetSchema = (
  dispatch,
  schemaId,
  successChecker,
  errorChecker
) => {
  axiosWrapper(
    dispatch,
    // types.STAGES__SET_STEPS,
    undefined,
    {
      method: "get",
      url: `${process.env.APPLICATION_SOCKET}/workbench/production-schemas/${schemaId}`,
    },
    successChecker
  ).then(errorChecker);
};

export const newDoGetSchema = (dispatch, schemaID) =>
  new Promise((resolve, reject) => {
    promiseAxiosWrapper(dispatch, undefined, {
      method: "get",
      url: `${process.env.APPLICATION_SOCKET}/workbench/production-schemas/${schemaID}`,
    })
      .then(resolve)
      .catch(reject);
  });
// Reworked
export const doStartStepRecord = (
  dispatch,
  additionalInfo,
  successChecker,
  errorChecker
) => {
  axiosWrapper(
    dispatch,
    undefined,
    {
      method: "post",
      url: `${process.env.APPLICATION_SOCKET}/workbench/start-operation`,
      data: {
        additional_info: additionalInfo,
      },
    },
    successChecker
  ).then(errorChecker);
};
// Reworked
export const doStopStepRecord = (
  dispatch,
  additionalInfo,
  prematureEnding,
  successChecker,
  errorChecker
) => {
  axiosWrapper(
    dispatch,
    undefined,
    {
      method: "post",
      url: `${process.env.APPLICATION_SOCKET}/workbench/end-operation`,
      data: {
        workbench_no: store.getState().stages.get("workbench_no"),
        additional_info: additionalInfo,
        premature_ending: prematureEnding,
      },
    },
    successChecker
  ).then(errorChecker);
};
// Reworked
export const doCompositionUpload = (dispatch, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__RESET_UNIT,
    {
      method: "post",
      url: `${process.env.APPLICATION_SOCKET}/unit/upload`,
    },
    successChecker
  ).then(errorChecker);
};
export const newDoCompositionUpload = (dispatch) =>
  new Promise((resolve, reject) => {
    promiseAxiosWrapper(dispatch, 
      // types.STAGES__RESET_UNIT,
      undefined,
    {
      method: "post",
      url: `${process.env.APPLICATION_SOCKET}/unit/upload`,
    })
      .then(resolve)
      .catch(reject);
  });
// Reworked
export const doRaiseNotification = (dispatch, notificationMessage) => {
  dispatch({
    type: types.STAGES__ADD_NOTIFICATION,
    notificationMessage: notificationMessage,
  });
};
// Reworked
export const doRemoveNotification = (dispatch, notificationID) => {
  dispatch({
    type: types.STAGES__REMOVE_NOTIFICATION,
    notificationID: notificationID,
  });
};
// Reworked
export const doSetSteps = (dispatch, steps) => {
  dispatch({
    type: types.STAGES__SET_STEPS,
    production_schema: { production_stages: steps },
  });
};
// Reworked
export const doGetUnitInformation = (
  dispatch,
  unitID,
  successChecker,
  errorChecker
) => {
  if (unitID === null) errorChecker("Null unitID");
  else
    axiosWrapper(
      dispatch,
      undefined,
      // types.STAGES__GET_UNIT_INFORMATION,
      {
        method: "get",
        url: `${process.env.APPLICATION_SOCKET}/unit/${unitID}/info`,
      },
      successChecker
    ).catch(errorChecker);
};

export const doSetBetweenFlag = (dispatch, state) => {
  dispatch({
    type: types.STAGES__SET_BETWEEN_FLAG,
    state: state,
  });
};

export const doSetCompositionID = (dispatch, unitID) => {
  dispatch({
    type: types.STAGES__SET_UNIT_ID,
    unitID: unitID,
  });
};
// Reworked
export const doRemoveUnit = (dispatch, successChecker, errorChecker) => {
  axiosWrapper(
    dispatch,
    types.STAGES__RESET_UNIT,
    {
      url: `${process.env.APPLICATION_SOCKET}/workbench/remove-unit`,
      method: "post",
    },
    successChecker
  ).then(errorChecker);
};

export const newDoRemoveUnit = (dispatch) => (
  new Promise((resolve, reject) => {
    promiseAxiosWrapper(
      dispatch,
      // types.STAGES__RESET_UNIT
      undefined,
      {
        url: `${process.env.APPLICATION_SOCKET}/workbench/remove-unit`,
        method: "post",
      },
    ).then(resolve).catch(e => {
      // console.log('new do remove ')
      // console.log(e)
      reject(e)
    })
  })
)

export const doUpdateCompositionTimer = (dispatch, value) => {
  dispatch({
    type: types.STAGES__UPDATE_COMPOSITION_TIMER,
    value
  })
}
