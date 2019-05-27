import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const Navbar = (props) => {
    const { isAuthenticated, user } = props.auth;
    const classes = useStyles();

    const onLogout = (e) => {
        e.preventDefault();
        props.logoutUser(props.history);
    }

    const loggedInLinks = (
        <Fragment>
            <Link to="/login">
                <Button color="inherit" onClick={onLogout}>Logout</Button>
            </Link>
        </Fragment>
    );

    const loggedOutLinks = (
        <Fragment>
            <Link to="/login">
                <Button color="inherit">Login</Button>
            </Link>
            <Link to="/register">
                <Button color="inherit">Sign up</Button>
            </Link>
        </Fragment>
    );

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        <Link to="/">
                            SOAR Network
                        </Link>
                    </Typography>
                    { isAuthenticated ? loggedInLinks : loggedOutLinks }
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
