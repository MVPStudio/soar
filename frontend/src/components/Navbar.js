import React/*, { Fragment }*/ from 'react';
// import { Link } from 'react-router-dom';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../redux/actions/authentication';
import { withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
// import SvgIcon from '@material-ui/core/SvgIcon';

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
    // const { isAuthenticated, user } = props.auth;
    const classes = useStyles();

    // const onLogout = (e) => {
    //     e.preventDefault();
    //     props.logoutUser(props.history);
    // }

    // const loggedInLinks = (
    //     <Fragment>
    //         <Button component={Link} to="/profile" color="inherit">
    //             Profile
    //         </Button>
    //         <Button onClick={onLogout} color="inherit">
    //             Logout
    //         </Button>
    //     </Fragment>
    // );

    // const loggedOutLinks = (
    //     <Fragment>
    //         <Button component={Link} to="/login" color="inherit">
    //             Login
    //         </Button>
    //         <Button component={Link} to="/signup" color="inherit">
    //             Sign up
    //         </Button>
    //     </Fragment>
    // );

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
                        <SvgIcon>
                            <Dove />
                        </SvgIcon>
                    </IconButton> */}
                    <Typography variant="h6" className={classes.title}>
                        SOAR Network
                    </Typography>
                    {/* <Button component={Link} to="/explore" color="inherit">
                        Explore
                    </Button> */}
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
