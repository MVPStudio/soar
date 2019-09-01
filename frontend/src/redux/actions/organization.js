import axios from 'axios';
import { 
    GET_ORGS_LOADING, GET_ORGS_SUCCESS, GET_ORGS_FAILURE,
    GET_ORG_LOADING, GET_ORG_SUCCESS, GET_ORG_FAILURE,
    CREATE_ORG_LOADING, CREATE_ORG_SUCCESS, CREATE_ORG_FAILURE, CREATE_ORG_RESET,
    EDIT_ORG_LOADING, EDIT_ORG_SUCCESS, EDIT_ORG_FAILURE, EDIT_ORG_RESET,
    DELETE_ORG_LOADING, DELETE_ORG_SUCCESS, DELETE_ORG_FAILURE, DELETE_ORG_RESET
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

    axios.post(`/api/organizations/create/`, { ...org })
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

export const editOrganization = (orgId, updates) => dispatch => {
    dispatch({ type: EDIT_ORG_LOADING });

    axios.put(`/api/organizations/${orgId}`, { ...updates })
        .then(res => {
            dispatch({
                type: EDIT_ORG_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: EDIT_ORG_FAILURE,
                payload: err.response.data
            });
        });
}

export const deleteOrganization = orgId => dispatch => {
    dispatch({ type: DELETE_ORG_LOADING });

    axios.delete(`/api/organizations/${orgId}`)
        .then(() => {
            dispatch({ type: DELETE_ORG_SUCCESS });
        })
        .catch(err => {
            dispatch({
                type: DELETE_ORG_FAILURE,
                payload: err.response.data
            });
        });
}

export const resetCreateOrganization = () => dispatch => {
    dispatch({ type: CREATE_ORG_RESET });
}

export const resetEditOrganization = () => dispatch => {
    dispatch({ type: EDIT_ORG_RESET });
}

export const resetDeleteOrganization = () => dispatch => {
    dispatch({ type: DELETE_ORG_RESET });
}