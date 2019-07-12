import axios from 'axios';
import { 
    GET_ORGS_LOADING, GET_ORGS_SUCCESS, GET_ORGS_FAILURE,
    GET_ORG_LOADING, GET_ORG_SUCCESS, GET_ORG_FAILURE,
    CREATE_ORG_LOADING, CREATE_ORG_SUCCESS, CREATE_ORG_FAILURE,
} from './types';

export const getOrganizations = () => dispatch => {
    dispatch({ type: GET_ORGS_LOADING });

    axios.get('/api/organizations/')
        .then(res => {
            dispatch({
                type: GET_ORGS_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ORGS_FAILURE,
                payload: err.response.data
            });
        });
}

export const getOrganization = orgId => dispatch => {
    dispatch({ type: GET_ORG_LOADING });

    axios.get(`/api/organizations/${orgId}`)
        .then(res => {
            dispatch({
                type: GET_ORG_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ORG_FAILURE,
                payload: err.response.data
            });
        });
}

export const createOrganization = org => dispatch => {
    dispatch({ type: CREATE_ORG_LOADING });

    axios.post(`/api/organizations/create/`, { name: org.name })
        .then(res => {
            dispatch({
                type: CREATE_ORG_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: CREATE_ORG_FAILURE,
                payload: err.response.data
            });
        });
}
