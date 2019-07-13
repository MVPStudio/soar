import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bool, object, func } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import { getOrganizations, editOrganization, deleteOrganization } from '../../redux/actions/organization';

const EditOrgForm = (props) => {
    const classes = useStyles();
    const [isDeleteModalOpen, setDeleteModal] = useState(false);
    const [values, setValues] = useState({
        name: props.organization.name
    });

    useEffect(() => {
        if (props.orgIsDeleted) {
            props.history.push(`/explore`);
        }
    }, [props.orgIsDeleted]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = name => e => {
        setValues({ ...values, [name]: e.target.value });
    };

    const setModalOnParent = (isOpen) => {
        if (props.isModal) {
            props.setModal(isOpen);
        }
    }

    return (
        <Fragment>
            <div className={classes.header}>
                <Typography variant="h6">Edit Organization</Typography>
                <IconButton 
                    className={classes.deleteIcon} 
                    onClick={() => setDeleteModal(true)}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
            <Divider className={classes.divider} />
            <TextField
                label="Name"
                className={classes.textField}
                value={values.name}
                onChange={handleChange('name')}
                margin="normal"
                variant="outlined"
                required
            />
            <Button 
                variant="contained" 
                color="primary" 
                className={classes.button}
                onClick={() => props.editOrganization(props.selectedOrg._id, { name: values.name })}
            >
                Submit
            </Button>
            <Button 
                className={classes.button} 
                onClick={() => setModalOnParent(false)}
            >
                Cancel
            </Button>
            <Modal 
                open={isDeleteModalOpen}
                onBackdropClick={() => setDeleteModal(false)}
            >
                <Container maxWidth="xs" className={classes.modalContainer}>
                    <Paper className={classes.paper}>
                        <DeleteOrgDialog 
                            selectedOrg={props.selectedOrg} 
                            setDeleteModal={setDeleteModal}
                            deleteOrganization={props.deleteOrganization}
                        />
                    </Paper>
                </Container>
            </Modal>
        </Fragment>
    )
}

const DeleteOrgDialog = (props) => {
    const classes = useStyles();

    return (
        <Fragment>
            <Typography variant="h6">Delete Organization</Typography>
            <Divider className={classes.divider} />
            <Typography component="div">
                <div className={classes.deleteAreYouSure}>
                    {`Are you sure you want to delete ${props.selectedOrg.name}?`}
                </div>
                <b>This cannot be undone.</b>
            </Typography>
            <Divider className={classes.divider} />
            <Button 
                variant="contained" 
                color="secondary" 
                className={classes.button}
                onClick={() => props.deleteOrganization(props.selectedOrg._id)}
            >
                Delete
            </Button>
            <Button 
                className={classes.button} 
                onClick={() => props.setDeleteModal(false)}
            >
                Cancel
            </Button>
        </Fragment>
    );
}

const useStyles = makeStyles(theme => ({
    header: {
        position: 'relative'
    },
    deleteIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        transform: 'translateY(-17.5%)'
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    textField: {
        width: '85%'
    },
    button: {
        margin: theme.spacing(1),
    },
    modalContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        outline: 'none'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    deleteAreYouSure: {
        width: '85%',
        margin: 'auto',
        marginBottom: '0.5rem'
    }
}));

EditOrgForm.propTypes = {
    isModal: bool,
    setModal: func,
    selectedOrg: object.isRequired,
    orgIsEdited: bool.isRequired,
    orgIsDeleted: bool.isRequired
}

const mapStateToProps = (state) => {
    return {
        selectedOrg: state.organization.selectedOrg.data,
        orgIsEdited: state.organization.editedOrg.status === 'SUCCESS',
        orgIsDeleted: state.organization.deletedOrg.status === 'SUCCESS'
    }
}

const mapDispatchToProps = { 
    getOrganizations,
    editOrganization, 
    deleteOrganization 
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrgForm)