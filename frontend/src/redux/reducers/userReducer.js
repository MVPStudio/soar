import { 
    GET_USER_LOADING, 
    GET_USER_SUCCESS, 
    GET_USER_FAILURE 
} from '../actions/types';

const initialState = {
    data: {
        id: '',
        name: '',
        email: '',
    },
    error: {},
    status: 'NOT_STARTED'
}

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_USER_LOADING:
            return {
                ...state,
                status: 'LOADING'
            }
        case GET_USER_SUCCESS:
            return {
                ...state,
                data: payload,
                status: 'SUCCESS'
            }
        case GET_USER_FAILURE:
            return {
                ...state,
                error: payload,
                status: 'FAILURE'
            }
        default:
            return state;
    }
}