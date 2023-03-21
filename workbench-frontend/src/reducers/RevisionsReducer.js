import {fromJS} from "immutable";
import {types} from "@reducers/common";

export const revisionsInitialState = fromJS({
    units: []
})


export const revisionsReducer = (state={}, action) => {

    switch(action.type) {
        case types.REVISIONS__FETCH_PASSPORTS:
            return state.set('units', fromJS(action.units))
        default:
            return state
    }
}