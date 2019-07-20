import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { array, bool, object } from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Fuse from 'fuse.js';

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
import InputBase from '@material-ui/core/InputBase';

import CreateEditOrgForm from './forms/CreateEditOrg';
import { getOrganizations, createOrganization, resetDeleteOrganization } from '../redux/actions/organization';

const FUSE_SEARCH_KEYS = [
    {
        name: 'name',
        weight: 0.99
    },
    {
        name: 'tags',
        weight: 0.5
    },
    {
        name: 'description',
        weight: 0.5
    },
]

const Explore = (props) => {
    const classes = useStyles();
    
    const [isModalOpen, setModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        props.getOrganizations();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const options = {
            keys: FUSE_SEARCH_KEYS
        };

        const fuse = new Fuse(props.organizations, options)
        const results = fuse.search(searchTerm);

        setSearchResults(results)
    }, [searchTerm]) // eslint-disable-line react-hooks/exhaustive-deps

    // When the CreateEditOrgForm redirects here after a delete, reset deletedOrg prop
    useEffect(() => {
        if (props.orgIsDeleted) {
            props.resetDeleteOrganization();
        }
    }, [props.orgIsDeleted]) // eslint-disable-line react-hooks/exhaustive-deps

    const renderSearchField = () => (
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <InputBase
                    fullWidth
                    type="search"
                    placeholder="Search Organizations"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    inputProps={{
                        style: { textAlign: "center" }
                    }}
                />
            </Paper>
        </Grid>
    )

    const renderOrgGridItems = () => (
        (searchTerm.length ? searchResults : props.organizations).map(org => (
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
    )

    return (
        <Fragment>
            <CssBaseline />
            <Container className={classes.root} maxWidth="sm">
                <Typography component="div">
                    <Grid container spacing={3}>
                        {renderSearchField()}
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
                        <CreateEditOrgForm
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

export default connect(mapStateToProps, mapDispatchToProps)(Explore)