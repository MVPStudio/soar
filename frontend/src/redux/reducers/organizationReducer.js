import { 
    GET_ORGS_LOADING, GET_ORGS_SUCCESS, GET_ORGS_FAILURE,
    GET_ORG_LOADING, GET_ORG_SUCCESS, GET_ORG_FAILURE,
    CREATE_ORG_LOADING, CREATE_ORG_SUCCESS, CREATE_ORG_FAILURE, CREATE_ORG_RESET,
    EDIT_ORG_LOADING, EDIT_ORG_SUCCESS, EDIT_ORG_FAILURE, EDIT_ORG_RESET,
    DELETE_ORG_LOADING, DELETE_ORG_SUCCESS, DELETE_ORG_FAILURE, DELETE_ORG_RESET
} from '../actions/types';

const initialState = {
    allOrgs: {
        data: [],
        status: 'NOT_STARTED'
    },
    selectedOrg: {
        data: {},
        status: 'NOT_STARTED'
    },
    createdOrg: {
        data: {},
        status: 'NOT_STARTED'
    },
    editedOrg: {
        data: {},
        status: 'NOT_STARTED'
    },
    deletedOrg: {
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
        case CREATE_ORG_LOADING:
            return {
                ...state,
                createdOrg: {
                    data: {},
                    status: 'LOADING'
                }
            }
        case CREATE_ORG_SUCCESS:
            return {
                ...state,
                createdOrg: {
                    data: payload,
                    status: 'SUCCESS'
                }
            }
        case CREATE_ORG_FAILURE:
            return {
                ...state,
                createdOrg: {
                    data: {},
                    error: payload,
                    status: 'FAILURE'
                }
            }
        case CREATE_ORG_RESET:
            return {
                ...state,
                createdOrg: initialState.createdOrg
            }
        case EDIT_ORG_LOADING:
                return {
                    ...state,
                    editedOrg: {
                        data: {},
                        status: 'LOADING'
                    }
                }
        case EDIT_ORG_SUCCESS:
            return {
                ...state,
                editedOrg: {
                    data: payload,
                    status: 'SUCCESS'
                }
            }
        case EDIT_ORG_FAILURE:
            return {
                ...state,
                editedOrg: {
                    data: {},
                    error: payload,
                    status: 'FAILURE'
                }
            }
        case EDIT_ORG_RESET:
            return {
                ...state,
                editedOrg: initialState.editedOrg
            }
        case DELETE_ORG_LOADING:
                return {
                    ...state,
                    deletedOrg: {
                        status: 'LOADING'
                    }
                }
        case DELETE_ORG_SUCCESS:
            return {
                ...state,
                deletedOrg: {
                    status: 'SUCCESS'
                }
            }
        case DELETE_ORG_FAILURE:
            return {
                ...state,
                deletedOrg: {
                    error: payload,
                    status: 'FAILURE'
                }
            }
        case DELETE_ORG_RESET:
            return {
                ...state,
                deletedOrg: initialState.deletedOrg
            }
        default:
            return state;
    }
}