import store from '../../redux/store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from '../../redux/actions/authentication';

const checkAuthToken = () => {
    if (localStorage.jwtToken) {
        const decoded = jwt_decode(localStorage.jwtToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            store.dispatch(logoutUser());
            return false;
        }

        setAuthToken(localStorage.jwtToken);
        store.dispatch(setCurrentUser(decoded));
        return true;
    }

    return false;
}

export default checkAuthToken;