import { 
    GET_ORGS_LOADING, 
    GET_ORGS_SUCCESS, 
    GET_ORGS_FAILURE 
} from '../actions/types';

const initialState = {
    data: {
        all: [],
    },
    error: {},
    status: 'NOT_STARTED'
}

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_ORGS_LOADING:
            return {
                ...state,
                status: 'LOADING'
            }
        case GET_ORGS_SUCCESS:
            return {
                ...state,
                data: {
                    all: payload
                },
                status: 'SUCCESS'
            }
        case GET_ORGS_FAILURE:
            return {
                ...state,
                error: payload,
                status: 'FAILURE'
            }
        default:
            return state;
    }
}