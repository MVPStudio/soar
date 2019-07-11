import { 
    GET_ORGS_LOADING, GET_ORGS_SUCCESS, GET_ORGS_FAILURE,
    GET_ORG_LOADING, GET_ORG_SUCCESS, GET_ORG_FAILURE 
} from '../actions/types';

const initialState = {
    allOrgs: {
        data: [],
        status: 'NOT_STARTED'
    },
    selectedOrg: {
        data: {},
        status: 'NOT_STARTED'
    }
}

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_ORGS_LOADING:
            return {
                ...state,
                allOrgs: {
                    data: [],
                    status: 'LOADING'
                }
            }
        case GET_ORGS_SUCCESS:
            return {
                ...state,
                allOrgs: {
                    data: payload,
                    status: 'SUCCESS'
                }
            }
        case GET_ORGS_FAILURE:
            return {
                ...state,
                allOrgs: {
                    data: [],
                    error: payload,
                    status: 'FAILURE'
                }
            }
        case GET_ORG_LOADING:
            return {
                ...state,
                selectedOrg: {
                    data: {},
                    status: 'LOADING'
                }
            }
        case GET_ORG_SUCCESS:
            return {
                ...state,
                selectedOrg: {
                    data: payload,
                    status: 'SUCCESS'
                }
            }
        case GET_ORG_FAILURE:
            return {
                ...state,
                selectedOrg: {
                    data: {},
                    error: payload,
                    status: 'FAILURE'
                }
            }
        default:
            return state;
    }
}