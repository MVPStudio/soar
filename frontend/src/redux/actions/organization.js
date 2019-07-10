import axios from 'axios';
import { 
    GET_ORGS_LOADING, 
    GET_ORGS_SUCCESS, 
    GET_ORGS_FAILURE 
} from './types';

export const getOrganizations = () => dispatch => {
    dispatch({ type: GET_ORGS_LOADING });

    axios.get('/api/organizations/all')
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
