import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { object, bool } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import SvgIcon from '@material-ui/core/SvgIcon';

import EditOrgForm from './forms/EditOrg';
import { getOrganization, resetCreateOrganization, resetEditOrganization } from '../redux/actions/organization';

const Organization = (props) => {
    const classes = useStyles();
    const [isModalOpen, setModal] = useState(false);

    useEffect(() => {
        const orgId = window.location.pathname.replace('/org/', '');
        props.getOrganization(orgId);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // When the CreateOrgForm redirects here, reset createdOrg prop
    useEffect(() => {
        if (props.orgIsCreated) {
            props.resetCreateOrganization();
        }
    }, [props.orgIsCreated]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (props.orgIsEdited) {
            setModal(false);
            props.resetEditOrganization();
            props.getOrganization(props.organization._id);
        }
    }, [props.orgIsEdited]) // eslint-disable-line react-hooks/exhaustive-deps

    const getEditIconSvg = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>	
    )

    return (
        <Fragment>
            <CssBaseline />
            <Container className={classes.root} maxWidth="sm">
                <Paper className={classes.paper}>
                    <Typography variant="h4">{props.organization.name}</Typography>
                    <Divider className={classes.divider} />
                    <Typography>{props.organization._id}</Typography>
                </Paper>
            </Container>
            <Fab 
                color="primary" 
                className={classes.fab} 
                onClick={() => setModal(true)}
            >
                <SvgIcon>
                    {getEditIconSvg()}
                </SvgIcon>
            </Fab>
            <Modal 
                open={isModalOpen}
                onBackdropClick={() => setModal(false)}
            >
                <Container maxWidth="sm" className={classes.modalContainer}>
                    <Paper className={classes.paper}>
                        <EditOrgForm
                            isModal 
                            setModal={setModal} 
                            history={props.history} 
                            organization={props.organization}
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
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
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
    }
}));

Organization.propTypes = {
    organization: object.isRequired,
    isLoaded: bool.isRequired,
    orgIsCreated: bool.isRequired,
    orgIsEdited: bool.isRequired
}

const mapStateToProps = (state) => {
    return {
        organization: state.organization.selectedOrg.data,
        isLoaded: state.organization.selectedOrg.status === 'SUCCESS',
        orgIsCreated: state.organization.createdOrg.status === 'SUCCESS',
        orgIsEdited: state.organization.editedOrg.status === 'SUCCESS'
    }
}

const mapDispatchToProps = { 
    getOrganization, 
    resetCreateOrganization, 
    resetEditOrganization 
}

export default connect(mapStateToProps, mapDispatchToProps)(Organization)