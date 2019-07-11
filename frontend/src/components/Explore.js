import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { array, bool } from 'prop-types';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { getOrganizations } from '../redux/actions/organization';

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

const Explore = (props) => {
    const classes = useStyles();
    
    useEffect(() => {
        props.getOrganizations();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const getOrgGridItems = () => {
        return props.organizations.map(org => (
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Link to={`/org/${org._id}`}>{org.name}</Link>
                </Paper>
            </Grid>
        ))
    }

    return (
        <Fragment>
            <CssBaseline />
            <Container className={classes.root} maxWidth="sm">
                <Grid container spacing={3}>
                    {getOrgGridItems()}
                </Grid>
            </Container>
        </Fragment>
    )
}

Explore.propTypes = {
    organizations: array.isRequired,
    isLoaded: bool.isRequired
}

const mapStateToProps = (state) => {
    return {
        organizations: state.organization.allOrgs.data,
        isLoaded: state.organization.allOrgs.status === 'SUCCESS'
    }
}

export default connect(mapStateToProps, { getOrganizations })(Explore)