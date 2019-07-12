import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Explore from './components/Explore';
import Organization from './components/Organization';
import PrivateRoute from './components/PrivateRoute';

import checkAuthToken from './utils/auth/checkAuthToken';
import './App.scss';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Route exact path="/" component={Home} />
                    <Fragment>
                        <Route exact path="/signup" component={Register} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/explore" component={Explore} />
                        <Route exact path="/org/:id" component={Organization} />
                        <PrivateRoute
                            exact
                            path="/profile"
                            isLoggedIn={checkAuthToken()}
                            component={UserProfile}
                        />
                    </Fragment>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;