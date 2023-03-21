import {axiosWrapper, types} from "@reducers/common";

export const doFetchRevisions = (dispatch, successChecker, errorChecker) => {
    axiosWrapper(
        dispatch,
        types.REVISIONS__FETCH_PASSPORTS,
        {
            url: `${process.env.APPLICATION_SOCKET}/unit/pending_revision/`,
            method: "GET"
        },
        successChecker
    ).then(errorChecker)
}