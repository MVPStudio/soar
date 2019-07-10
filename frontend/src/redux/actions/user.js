import axios from 'axios';
import { 
    GET_USER_LOADING, 
    GET_USER_SUCCESS, 
    GET_USER_FAILURE 
} from './types';

export const getLoggedInUser = () => dispatch => {
    dispatch({ type: GET_USER_LOADING });

    axios.get('/api/users/profile')
        .then(res => {
            dispatch({
                type: GET_USER_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: GET_USER_FAILURE,
                payload: err.response.data
            });
        });
}
