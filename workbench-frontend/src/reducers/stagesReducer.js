import React from 'react'
import { fromJS, List } from 'immutable'
import { types } from './common'

export const stagesInitialState = fromJS({
    steps: [
     {'name': 'title1', 'descriprtion': 'context1', 'duration_seconds': 300 },
     {'name': 'title2', 'description': 'context2', 'duration_seconds': 250 }
    ],
    productionSchemas: [{'schema_id':'test_id_123', 'schema_name': 'simple schema name'}],
    finishedCompositionsIDs: [],
    usedTimestamps: [],
    composition: {},
    unit: {},
    modalsNotifications: {},
    workbench_no: 0,
    betweenEndAndStartFlag: false,
    compositionTimer: false
})

export const stagesReducer = (state={}, action) => {
    if (!action.type.startsWith('STAGES__'))
        return state
    if (process.env.DEV_SHOW_REDUCERS)
        if (action.type !== types.STAGES__FETCH_COMPOSITION)
            console.log('reducer-stages', action)

    switch (action.type){
        case types.STAGES__REPORT_ERROR:
            return state
              .setIn(['notifications', 'error'], fromJS(action.error))
        case types.STAGES__FETCH_COMPOSITION:
            return state
              .set('composition', fromJS(action))
              .setIn(['unit', 'unit_internal_id'], action.unit_internal_id !== '' && action.unit_internal_id !== null ? action.unit_internal_id : (state.getIn(['unit', 'unit_internal_id']) !== '' ? state.getIn(['unit', 'unit_internal_id']) : ''))
              .setIn(['unit', 'unit_biography'], action.unit_biography !== null ? fromJS(action.unit_biography) : '')
              // .deleteIn(['composition', 'type'])
              // .set('composition', fromJS(action))
        case types.STAGES__CREATE_NEW_UNIT:
            return state
              .setIn(['unit', 'unit_internal_id'], fromJS(action.unit_internal_id))
        case types.STAGES__ADD_NOTIFICATION:
            return state
              .setIn(['modalsNotifications', state.get('modalsNotifications').keySeq().toJS().length + 1], action.notificationMessage)
        case types.STAGES__REMOVE_NOTIFICATION:
            return state
              .deleteIn(['modalsNotifications', parseInt(action.notificationID)])
        case types.STAGES__RESET_UNIT:
            return state
              .deleteIn(['unit'])
        case types.STAGES__ADD_UNIT_TO_IGNORE:
            return state
              .update('finishedCompositionsIDs', arr => arr.push(state.getIn(['unit', 'unit_internal_id'])))
        case types.STAGES__ADD_TIMESTAMP_TO_IGNORE:
            return state
              .update('usedTimestamps', arr => arr.push(action.timestamp))
        case types.STAGES__SET_UNIT_ID:
            return state
              .setIn(['unit', 'unit_internal_id'], action.unitID)
        case types.STAGES__SET_STEPS:
            return state
              .set('steps', fromJS(action.production_schema?.production_stages))
        case types.STAGES__SET_WORKBENCH_NO:
            return state
              .set('workbench_no', action.workbench_no)
        case types.STAGES__SET_BETWEEN_FLAG:
            return state
              .set('betweenEndAndStartFlag', action.state)
        case types.STAGES__SET_PRODUCTION_SCHEMAS:
            return state
              .set('productionSchemas', fromJS(action.available_schemas))
        case types.STAGES__UPDATE_COMPOSITION_TIMER: 
            return state
              .set('compositionTimer', action.value)
        default:
            return state
    }
}
