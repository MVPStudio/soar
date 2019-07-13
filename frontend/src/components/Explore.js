import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { array, bool, object } from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';

import CreateOrgForm from './forms/CreateOrg';
import { getOrganizations, createOrganization, resetDeleteOrganization } from '../redux/actions/organization';

const Explore = (props) => {
    const classes = useStyles();
    const [isModalOpen, setModal] = useState(false);
    
    
    useEffect(() => {
        props.getOrganizations();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // When the EditOrgForm redirects here after a delete, reset deletedOrg prop
    useEffect(() => {
        if (props.orgIsDeleted) {
            props.resetDeleteOrganization();
        }
    }, [props.orgIsDeleted]) // eslint-disable-line react-hooks/exhaustive-deps

    const renderOrgGridItems = () => {
        return props.organizations.map(org => (
            <Grid item key={org._id} xs={12}>
                <Link 
                    component={RouterLink} 
                    to={`/org/${org._id}`} 
                    underline="none"
                >
                    <Paper className={classes.paper}>
                        {org.name}
                    </Paper>
                </Link>
            </Grid>
        ))
    }

    return (
        <Fragment>
            <CssBaseline />
            <Container className={classes.root} maxWidth="sm">
                <Typography component="div">
                    <Grid container spacing={3}>
                        {renderOrgGridItems()}
                    </Grid>
                </Typography>
            </Container>
            <Fab 
                color="primary" 
                className={classes.fab} 
                onClick={() => setModal(true)}
            >
                <AddIcon />
            </Fab>
            <Modal 
                open={isModalOpen}
                onBackdropClick={() => setModal(false)}
            >
                <Container maxWidth="sm" className={classes.modalContainer}>
                    <Paper className={classes.paper}>
                        <CreateOrgForm 
                            isModal 
                            setModal={setModal} 
                            history={props.history} 
                        />
                    </Paper>
                </Container>
            </Modal>
        </Fragment>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    modalContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        outline: 'none'
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
}));

Explore.propTypes = {
    organizations: array.isRequired,
    createdOrg: object.isRequired,
    orgsLoaded: bool.isRequired,
    orgIsCreated: bool.isRequired,
    orgIsDeleted: bool.isRequired
}

Explore.defaultProps = {
    organizations: []
}

const mapStateToProps = (state) => {
    return {
        organizations: state.organization.allOrgs.data,
        createdOrg: state.organization.createdOrg.data,
        orgsLoaded: state.organization.allOrgs.status === 'SUCCESS',
        orgIsCreated: state.organization.createdOrg.status === 'SUCCESS',
        orgIsDeleted: state.organization.deletedOrg.status === 'SUCCESS'
    }
}

const mapDispatchToProps = {
    getOrganizations, 
    createOrganization, 
    resetDeleteOrganization
}

export default connect(mapStateToProps, mapDispatchToProps )(Explore)