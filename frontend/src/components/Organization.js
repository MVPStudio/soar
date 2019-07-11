import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { object, bool } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import { getOrganization } from '../redux/actions/organization';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const Organization = (props) => {
    const classes = useStyles();

    useEffect(() => {
        const orgId = window.location.pathname.replace('/org/', '');
        props.getOrganization(orgId);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            <CssBaseline />
            <Container className={classes.root} maxWidth="sm">
                <Typography component="div">
                    <Paper className={classes.paper}>
                        <div>{props.organization.name}</div>
                        <div>{props.organization._id}</div>
                    </Paper>
                </Typography>
            </Container>
        </Fragment>
    )
}

Organization.propTypes = {
    organization: object.isRequired,
    isLoaded: bool.isRequired
}

const mapStateToProps = (state) => {
    return {
        organization: state.organization.selectedOrg.data,
        isLoaded: state.organization.selectedOrg.status === 'SUCCESS'
    }
}

export default connect(mapStateToProps, { getOrganization })(Organization)