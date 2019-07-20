import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bool, object, func, number, string, shape } from 'prop-types';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';

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

import { getOrganizations, createOrganization, editOrganization, deleteOrganization } from '../../redux/actions/organization';
import { categories, states } from './FormValues';

const suggestions = [
    { label: 'Afghanistan' },
    { label: 'Aland Islands' },
    { label: 'Albania' },
    { label: 'Algeria' },
    { label: 'American Samoa' },
    { label: 'Andorra' },
    { label: 'Angola' },
    { label: 'Anguilla' },
    { label: 'Antarctica' },
    { label: 'Antigua and Barbuda' },
    { label: 'Argentina' },
    { label: 'Armenia' },
    { label: 'Aruba' },
    { label: 'Australia' },
    { label: 'Austria' },
    { label: 'Azerbaijan' },
    { label: 'Bahamas' },
    { label: 'Bahrain' },
    { label: 'Bangladesh' },
    { label: 'Barbados' },
    { label: 'Belarus' },
    { label: 'Belgium' },
    { label: 'Belize' },
    { label: 'Benin' },
    { label: 'Bermuda' },
    { label: 'Bhutan' },
    { label: 'Bolivia, Plurinational State of' },
    { label: 'Bonaire, Sint Eustatius and Saba' },
    { label: 'Bosnia and Herzegovina' },
    { label: 'Botswana' },
    { label: 'Bouvet Island' },
    { label: 'Brazil' },
    { label: 'British Indian Ocean Territory' },
    { label: 'Brunei Darussalam' },
];

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
            props.history.push(`/explore`);
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

    const renderTagsInput = (inputProps) => {
        const { InputProps, classes, ref, ...other } = inputProps;

        return (
            <TextField
                variant="outlined"
                className={classes.textField}
                margin="normal"
                InputProps={{
                    inputRef: ref,
                    ...InputProps,
                }}
                {...other}
            />
        );
    }

    function renderTagsSuggestion(suggestionProps) {
        const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.label}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
                onClick={() => addTag(suggestion.label)}
            >
                {suggestion.label}
            </MenuItem>
        );
    }

    renderTagsSuggestion.propTypes = {
        highlightedIndex: number,
        index: number,
        itemProps: object,
        selectedItem: string,
        suggestion: shape({ label: string }).isRequired,
    };

    const getTagSuggestions = (value, { showEmpty = false } = {}) => {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;

        return inputLength === 0 && !showEmpty
            ? []
            : suggestions.filter(suggestion => {
                const keep = count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
                if (keep) count += 1;

                return keep;
            });
    }

    const renderTagsField = () => (
        <Downshift>
            {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                highlightedIndex,
                inputValue,
                isOpen,
                selectedItem,
            }) => {
                const { onBlur, onFocus, ...inputProps } = getInputProps({
                    placeholder: 'Search for an action',
                });

                return (
                    <div className={classes.container}>
                        {renderTagsInput({
                            fullWidth: true,
                            classes,
                            label: 'Actions',
                            InputLabelProps: getLabelProps({ shrink: true }),
                            InputProps: { onBlur, onFocus },
                            inputProps,
                        })}

                        <div {...getMenuProps()}>
                            {isOpen ? (
                                <Paper className={classes.dropdownPaper}>
                                    {getTagSuggestions(inputValue).map((suggestion, index) =>
                                        renderTagsSuggestion({
                                            index,
                                            suggestion,
                                            itemProps: getItemProps({ item: suggestion.label }),
                                            highlightedIndex,
                                            selectedItem,
                                        }),
                                    )}
                                </Paper>
                            ) : null}
                        </div>
                    </div>
                );
            }}
        </Downshift>
    )

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
            <TextField
                select
                label="Category"
                className={classes.textField}
                value={values.category || ''}
                onChange={handleChange('category')}
                margin="normal"
                variant="outlined"
            >
                {categories.map((category, i) => (
                    <MenuItem key={`${category}-${i}`} value={category}>
                        {category}
                    </MenuItem>
                ))}
            </TextField>
            <div>
                {renderTagsField()}
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

    return (
        <Fragment>
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
            <Divider className={classes.divider} />
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
            <Divider className={classes.divider} />
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
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
            {
                props.editing &&
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
            }
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
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    textField: {
        width: '85%'
    },
    textFieldContainer: {
        display: 'flex',
        width: '85%',
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
        margin: theme.spacing(1),
    },
    appBar: {
        backgroundColor: '#FFF',
        boxShadow: 'none'
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    dropdownPaper: {
        height: '200px',
        width: '85%',
        position: 'absolute',
        overflow: 'auto',
        zIndex: 2,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
        transform: 'translateX(8.85%)'
    },
    chip: {
        margin: theme.spacing(1),
    },
    chipContainer: {
        width: '85%',
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
    deleteAreYouSure: {
        width: '85%',
        margin: 'auto',
        marginBottom: '0.5rem'
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