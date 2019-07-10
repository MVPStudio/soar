import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { array } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Typography from '@material-ui/core/Typography';
// import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { getOrganizations } from '../redux/actions/organization';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
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
        if (!props.isLoaded) {
            props.getOrganizations();
        }
    })

    const getOrgGridItems = () => {
        return props.organizations.map(org => (
            <Grid item xs={12} sm={12} md={6} lg={3}>
                <Paper className={classes.paper}>{org.name}</Paper>
            </Grid>
        ))
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                {getOrgGridItems()}
            </Grid>
        </div>
    )
}

Explore.propTypes = {
    organizations: array.isRequired,
}

const mapStateToProps = (state) => ({
    organizations: state.organization.data.all,
    isLoaded: state.organization.status === 'SUCCESS'
})

export default connect(mapStateToProps, { getOrganizations })(Explore)