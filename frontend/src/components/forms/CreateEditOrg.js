import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bool, object, func } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Modal from '@material-ui/core/Modal';
import Container from '@material-ui/core/Container';

import TagsInputField from './TagsInputField';
import DeleteOrgDialog from './DeleteOrgDialog';
// import CategorySelect from './CategorySelect';
import { getOrganizations, createOrganization, editOrganization, deleteOrganization } from '../../redux/actions/organization';
// import { states } from './FormValues';

const emptyState = {
    Name: '',
    Description: '',
    Actions: [],
    Email: '',
    Phone: '',
    Address: '',
    Website: ''
}

const CreateEditOrgForm = (props) => {
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0);
    const [isDeleteModalOpen, setDeleteModal] = useState(false);
    const [values, setValues] = useState(!props.editing ? emptyState : {
        Name: props.selectedOrg.Name,
        Description: props.selectedOrg.Description,
        Actions: props.selectedOrg.Actions,
        Email: props.selectedOrg.Email,
        Phone: props.selectedOrg.Phone,
        Address: props.selectedOrg.Address,
        Website: props.selectedOrg.Website,
        Contact: props.selectedOrg.Contact,
    });

    useEffect(() => {
        if (props.orgIsCreated) {
            props.history.push(`/org/${props.createdOrg._id}`);
        }
    }, [props.orgIsCreated]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (props.orgIsDeleted) {
            props.history.push(`/`);
        }
    }, [props.orgIsDeleted]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = Name => e => {
        setValues({ ...values, [Name]: e.target.value });
    }

    const handleSelectedTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    }

    const setModalOnParent = (isOpen) => {
        if (props.isModal) {
            props.setModal(isOpen);
        }
    }

    const addTag = (tagToAdd) => {
        if (!values.Actions.includes(tagToAdd)) {
            const newActions = [ ...values.Actions, tagToAdd ];
            setValues({ ...values, Actions: newActions });
        }
    }

    const removeTag = (tagToDelete) => {
        if (values.Actions.includes(tagToDelete)) {
            const newActions = values.Actions.filter(tag => tag !== tagToDelete);
            setValues({ ...values, Actions: newActions });
        }
    }

    const handleCreateOrEdit = () => {
        if (props.editing) {
            props.editOrganization(props.selectedOrg._id, { ...values, Actions: values.Actions });
        } else {
            props.createOrganization({ ...values, Actions: values.Actions });
        }
    }

    const renderActions = () => (
        <div className={classes.chipContainer}>
            {values.Actions.map((tag, i) => (
                <Chip
                    label={tag}
                    key={`${tag}-${i}`}
                    onDelete={() => removeTag(tag)}
                    className={classes.chip}
                />
            ))}
        </div>
    )

    const renderBasicInfo = () => (
        <Fragment>
            <TextField
                label="Name"
                className={classes.textField}
                value={values.Name}
                onChange={handleChange('Name')}
                margin="normal"
                variant="outlined"
                required
            />
            <div>
                <TagsInputField tags={values.Actions} addTag={addTag} />
                {renderActions()}
            </div>
        </Fragment>
    )

    const renderContactInfo = () => (
        <Fragment>
            <TextField
                label="Address"
                className={classes.textField}
                value={values.Address}
                onChange={handleChange('Address')}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Phone Number"
                className={classes.textField}
                value={values.Phone}
                onChange={handleChange('Phone')}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Website"
                className={classes.textField}
                value={values.Website}
                onChange={handleChange('Website')}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Contact Name"
                className={classes.textField}
                value={values.Contact}
                onChange={handleChange('Email')}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Contact Email"
                className={classes.textField}
                value={values.Email}
                onChange={handleChange('Email')}
                margin="normal"
                variant="outlined"
            />
        </Fragment>
    )

    const renderDetailedInfo = () => (
        <Fragment>
            <TextField
                multiline
                label="About the Organization"
                className={classes.textField}
                value={values.Description}
                onChange={handleChange('Description')}
                margin="normal"
                variant="outlined"
                rows="10"
            />
        </Fragment>
    )

    const renderHeader = () => (
        <div className={classes.header}>
            <Typography variant="h6">
                {`${props.editing ? 'Edit' : 'Register an'} Organization`}
            </Typography>
            {   
                props.editing &&
                <IconButton 
                    className={classes.deleteIcon} 
                    onClick={() => setDeleteModal(true)}
                >
                    <DeleteIcon />
                </IconButton>
            }
        </div>
    )

    const renderFormContent = () => (
        <Container maxWidth="xs">
            <AppBar position="static" className={classes.appBar}>
                <Tabs
                    value={selectedTab}
                    onChange={handleSelectedTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Basics" />
                    <Tab label="Contact Info" />
                    <Tab label="Details" />
                </Tabs>
            </AppBar>
            {selectedTab === 0 && renderBasicInfo()}
            {selectedTab === 1 && renderContactInfo()}
            {selectedTab === 2 && renderDetailedInfo()}
        </Container>
    )

    const renderButtons = () => (
        <Fragment>
            <Button
                variant="contained"
                color="primary"
                className={classes.submitButton}
                onClick={handleCreateOrEdit}
            >
                Submit
            </Button>
            <Button
                className={classes.button}
                onClick={() => setModalOnParent(false)}
            >
                Cancel
            </Button>
        </Fragment>
    )

    const renderDeleteModal = () => (
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
    )

    return (
        <Fragment>
            {renderHeader()}
            <Divider className={classes.divider} />
            {renderFormContent()}
            <Divider className={classes.divider} />
            {renderButtons()}
            {props.editing && renderDeleteModal()}
        </Fragment>
    )
}

const useStyles = makeStyles(theme => ({
    header: {
        position: 'relative'
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    textField: {
        width: '100%'
    },
    selectField: {
        width: '100%',
        textAlign: 'left'
    },
    textFieldContainer: {
        display: 'flex',
        width: '100%',
        margin: 'auto', 
    },
    city: {
        flex: 1
    },
    state: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '80px'
    },
    zipCode: {
        width: '90px'
    },
    button: {
        margin: theme.spacing(1)
    },
    submitButton: {
        margin: theme.spacing(1),
        color: 'white'
    },
    appBar: {
        backgroundColor: '#FFF',
        boxShadow: 'none'
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    chip: {
        margin: theme.spacing(1),
    },
    chipContainer: {
        width: '100%',
        maxHeight: '100px',
        overflow: 'auto',
        margin: 'auto'
    },
    deleteIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        transform: 'translateY(-17.5%)'
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
}));

CreateEditOrgForm.propTypes = {
    createdOrg: object.isRequired,
    orgIsCreated: bool.isRequired,
    isModal: bool,
    setModal: func
}

const mapStateToProps = (state) => {
    const org = state.organization;
    
    return {
        createdOrg: org.createdOrg.data,
        selectedOrg: org.selectedOrg.data,
        orgIsCreated: org.createdOrg.status === 'SUCCESS',
        orgIsEdited: org.editedOrg.status === 'SUCCESS',
        orgIsDeleted: org.deletedOrg.status === 'SUCCESS'
    }
}

const mapDispatchToProps = {
    getOrganizations, 
    createOrganization,
    editOrganization, 
    deleteOrganization
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEditOrgForm)