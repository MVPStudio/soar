import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/styles';
import green from '@material-ui/core/colors/green';
import lightGreen from '@material-ui/core/colors/lightGreen';

import Navbar from './components/Navbar';
import Search from './components/Search';
import Organization from './components/Organization';
// import Register from './components/Register';
// import Login from './components/Login';
// import UserProfile from './components/UserProfile';
// import PrivateRoute from './components/PrivateRoute';

// import checkAuthToken from './utils/auth/checkAuthToken';
import './App.scss';

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: lightGreen,
    }
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Router>
                    <Fragment>
                        <Navbar />
                        <Route exact path="/" component={Search} />
                        <Route exact path="/org/:id" component={Organization} />
                        {/* <Fragment>
                            <Route exact path="/signup" component={Register} />
                            <Route exact path="/login" component={Login} />
                            <PrivateRoute
                                exact
                                path="/profile"
                                isLoggedIn={checkAuthToken()}
                                component={UserProfile}
                            />
                        </Fragment> */}
                    </Fragment>
                </Router>
            </Provider>
        </ThemeProvider>
    );
}

export default App;