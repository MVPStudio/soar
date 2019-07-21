import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bool, object, func } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
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
import CategorySelect from './CategorySelect';
import { getOrganizations, createOrganization, editOrganization, deleteOrganization } from '../../redux/actions/organization';
import { states } from './FormValues';

const emptyState = {
    name: '',
    category: undefined,
    description: '',
    tags: [],
    email: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    website: ''
}

const CreateEditOrgForm = (props) => {
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0);
    const [isDeleteModalOpen, setDeleteModal] = useState(false);
    const [values, setValues] = useState(!props.editing ? emptyState : {
        name: props.selectedOrg.name,
        category: props.selectedOrg.category,
        description: props.selectedOrg.description,
        tags: props.selectedOrg.tags,
        email: props.selectedOrg.email,
        phoneNumber: props.selectedOrg.phoneNumber,
        streetAddress: props.selectedOrg.streetAddress,
        city: props.selectedOrg.city,
        state: props.selectedOrg.state,
        zipCode: props.selectedOrg.zipCode,
        website: props.selectedOrg.website
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

    const handleChange = name => e => {
        setValues({ ...values, [name]: e.target.value });
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
        if (!values.tags.includes(tagToAdd)) {
            const newTags = [ ...values.tags, tagToAdd ];
            setValues({ ...values, tags: newTags });
        }
    }

    const removeTag = (tagToDelete) => {
        if (values.tags.includes(tagToDelete)) {
            const newTags = values.tags.filter(tag => tag !== tagToDelete);
            setValues({ ...values, tags: newTags });
        }
    }

    const handleCreateOrEdit = () => {
        if (props.editing) {
            props.editOrganization(props.selectedOrg._id, { ...values });
        } else {
            props.createOrganization({ ...values });
        }
    }

    const renderTags = () => (
        <div className={classes.chipContainer}>
            {values.tags.map((tag, i) => (
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
                value={values.name}
                onChange={handleChange('name')}
                margin="normal"
                variant="outlined"
                required
            />
            <CategorySelect 
                selectedCategory={values.category || ''} 
                setSelectedCategory={handleChange('category')}
            />
            <div>
                <TagsInputField tags={values.tags} addTag={addTag} />
                {renderTags()}
            </div>
        </Fragment>
    )

    const renderContactInfo = () => (
        <Fragment>
            <TextField
                label="Street Address"
                className={classes.textField}
                value={values.streetAddress}
                onChange={handleChange('streetAddress')}
                margin="normal"
                variant="outlined"
            />
            <div className={classes.textFieldContainer}>
                <TextField
                    label="City"
                    className={classes.city}
                    value={values.city}
                    onChange={handleChange('city')}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    select
                    label="State"
                    className={classes.state}
                    value={values.state}
                    onChange={handleChange('state')}
                    margin="normal"
                    variant="outlined"
                >
                    {states.map((state, i) => (
                        <MenuItem key={`${state}-${i}`} value={state}>
                            {state}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Zip Code"
                    className={classes.zipCode}
                    value={values.zipCode}
                    onChange={handleChange('zipCode')}
                    margin="normal"
                    variant="outlined"
                />
            </div>
            <TextField
                label="Phone Number"
                className={classes.textField}
                value={values.phoneNumber}
                onChange={handleChange('phoneNumber')}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Email"
                className={classes.textField}
                value={values.email}
                onChange={handleChange('email')}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Website or Social Media Link"
                className={classes.textField}
                value={values.website}
                onChange={handleChange('website')}
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
                value={values.description}
                onChange={handleChange('description')}
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
    return {
        createdOrg: state.organization.createdOrg.data,
        selectedOrg: state.organization.selectedOrg.data,
        orgIsCreated: state.organization.createdOrg.status === 'SUCCESS',
        orgIsEdited: state.organization.editedOrg.status === 'SUCCESS',
        orgIsDeleted: state.organization.deletedOrg.status === 'SUCCESS'
    }
}

const mapDispatchToProps = {
    getOrganizations, 
    createOrganization,
    editOrganization, 
    deleteOrganization
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEditOrgForm)