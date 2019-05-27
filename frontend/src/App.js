import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';

import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import PrivateRoute from './components/PrivateRoute';

import './App.scss';

const checkAuth = () => {
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

checkAuth();

class App extends PureComponent {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div>
                        <Navbar />
                        <Route exact path="/" component={Home} />
                        <div>
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                            <PrivateRoute 
                                exact 
                                path="/profile" 
                                isLoggedIn={checkAuth()} 
                                component={UserProfile}
                            />
                        </div>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;