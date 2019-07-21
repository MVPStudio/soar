import React from 'react';
// import { Link } from 'react-router-dom';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../redux/actions/authentication';
import { withRouter } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        padding: '10px',
        margin: '2px'
    },
    toolbar: {
        width: 'max-content'
    },
    siteName: {
        color: 'white',
    }
}));

const Navbar = (props) => {
    // const { isAuthenticated, user } = props.auth;
    const classes = useStyles();

    // const onLogout = (e) => {
    //     e.preventDefault();
    //     props.logoutUser(props.history);
    // }

    // const loggedInLinks = (
    //     <Fragment>
    //         <Button component={RouterLink} to="/profile" color="inherit">
    //             Profile
    //         </Button>
    //         <Button onClick={onLogout} color="inherit">
    //             Logout
    //         </Button>
    //     </Fragment>
    // );

    // const loggedOutLinks = (
    //     <Fragment>
    //         <Button component={RouterLink} to="/login" color="inherit">
    //             Login
    //         </Button>
    //         <Button component={RouterLink} to="/signup" color="inherit">
    //             Sign up
    //         </Button>
    //     </Fragment>
    // );

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{ alignItems: 'center' }}>
                <Toolbar variant="dense" className={classes.toolbar}>
                    <Link
                        className={classes.orgLink}
                        component={RouterLink}
                        to={`/`}
                    >
                        <IconButton edge="start" color="inherit" className={classes.menuButton}>
                            <SvgIcon>
                                {doveSvg}
                            </SvgIcon>
                        </IconButton>
                    </Link>
                    <Typography variant="h6" align="center" className={classes.siteName}>
                        SOAR Network
                    </Typography>
                    {/* { isAuthenticated ? loggedInLinks : loggedOutLinks } */}
                </Toolbar>
            </AppBar>
        </div>
    );
}

Navbar.propTypes = {
    logoutUser: func.isRequired,
    auth: object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(withRouter(Navbar));

const doveSvg = (
    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 358.574 358.574" style={{ enableBackground: 'new 0 0 358.574 358.574' }} space="preserve">
    <path fill="white" d="M349.392,188.25c-2.426-0.821-8.947-3.453-10.738-6.017c-0.285-0.407-0.728-1.284-1.289-2.394
	c-3.296-6.524-11.016-21.802-26.605-21.802c-2.451,0-5.021,0.387-7.64,1.151c-14.655,4.276-21.688,13.998-26.822,21.096
	c-2.957,4.088-5.293,7.317-7.924,7.822c-0.828,0.159-1.604,0.239-2.308,0.239c-2.51,0-3.916-0.954-4.179-2.836
	c-0.988-7.069-0.762-15.884-0.523-25.217c0.395-15.439,0.842-32.938-4.291-46.667c-8.368-22.384-27.05-40.417-42.062-54.906
	c-3.751-3.621-7.294-7.041-10.332-10.185c-1.167-1.441-2.38-2.752-3.553-4.021c-1.703-1.841-3.312-3.58-4.486-5.411
	c-5.038-7.854-8.567-16.764-11.617-25.18c-0.289-0.921-0.576-1.85-0.86-2.788c-0.456-1.503-0.958-2.649-1.533-3.499
	C180.969,3.657,179.012,0,175.992,0c-0.471,0-0.955,0.092-1.436,0.274c-5.193,1.964-6.333,12.733-7.34,22.235
	c-0.517,4.88-1.005,9.49-1.956,11.755c-1.228,2.925-3.132,4.655-5.148,6.485c-2.384,2.165-4.849,4.403-6.003,8.625
	c-1.154,4.218,0.002,6.646,1.121,8.993c0.941,1.977,1.831,3.843,1.347,6.955c-0.507,3.266-2.082,5.03-3.749,6.899
	c-1.777,1.992-3.616,4.052-3.929,7.821c-0.324,3.892,1.723,6.419,3.703,8.864c1.731,2.137,3.366,4.156,3.326,7.028
	c-0.034,2.437-1.478,3.65-3.305,5.186c-2.394,2.011-5.373,4.514-4.396,10.538c0.646,3.98,3.274,6.058,5.593,7.891
	c2.23,1.763,3.593,2.946,3.494,4.957c-0.075,1.529-0.546,3.163-1.044,4.892c-1.19,4.128-2.539,8.807,0.952,13.935
	c1.258,1.848,5.446,5.553,10.098,9.346c-12.772-5.85-31.741-13.234-51.577-16.347c-32.537-5.105-64.092-17.726-81.045-24.507
	c-7.98-3.192-11.569-4.604-12.984-4.604c-0.917,0-1.219,0.563-1.307,0.806c-0.337,0.933,0.472,1.811,2.414,3.424l5.224,4.335
	c7.007,5.81,12.506,10.369,14.843,12.663c-1.142-0.406-2.777-1.072-4.896-1.992c-1.119-0.486-2.018-0.294-2.515,0.431
	c-0.239,0.349-0.355,0.79-0.355,1.347c0,6.184,17.809,36.595,42.411,65.938c17.756,21.176,51.869,56.702,80.841,56.702
	c1.729,0,3.43-0.127,5.085-0.379c-11.521,11.92-53.4,43.329-90.531,58.741c-44.868,18.624-65.123,28.194-66.54,35.67
	c-0.322,1.699,0.266,3.287,1.748,4.719c1.973,1.906,3.814,2.793,5.795,2.793c1.398,0,2.681-0.447,3.921-0.879
	c1.27-0.442,2.583-0.9,4.069-0.9c1.66,0,3.384,0.581,5.269,1.775c4.705,2.979,10.355,6.159,17.896,6.159
	c7.856,0,16.524-3.437,26.5-10.507c1.869-1.324,3.564-1.915,5.499-1.915c1.092,0,2.163,0.182,3.295,0.374
	c1.234,0.209,2.511,0.426,3.923,0.426c0,0,0,0,0,0c3.211,0,6.267-1.195,9.614-3.761c24.697-18.93,51.629-22.474,80.144-26.227
	c33.636-4.427,68.417-9.004,105.821-37.771c31.833-24.481,38.115-45.503,42.273-59.415c0.438-1.465,0.85-2.846,1.266-4.135
	c4.165-12.91,6.607-15.926,9.657-16.975c2.023-0.696,7.031-2.719,11.45-4.503c3.109-1.255,5.795-2.34,6.539-2.596
	c1.097-0.377,1.227-1.049,1.207-1.417C352.252,189.776,352.204,188.897,349.392,188.25z"/>
    </svg>
);
