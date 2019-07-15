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
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import { getOrganizations, createOrganization } from '../../redux/actions/organization';
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

const CreateOrgForm = (props) => {
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0);
    const [values, setValues] = useState({
        name: '',
        category: '',
        missionStatement: '',
        description: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        tags: [],
        website: ''
    });

    useEffect(() => {
        if (props.orgIsCreated) {
            props.history.push(`/org/${props.createdOrg._id}`);
        }
    }, [props.orgIsCreated]) // eslint-disable-line react-hooks/exhaustive-deps

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

    const renderTagsInput = (inputProps) => {
        const { InputProps, classes, ref, ...other } = inputProps;

        return (
            <TextField
                variant="outlined"
                className={classes.textField}
                margin="normal"
                InputProps={{
                    inputRef: ref,
                    // classes: {
                    //     root: classes.inputRoot,
                    //     input: classes.inputInput,
                    // },
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
                onClick={() => { console.log('You chose', suggestion.label) }}
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
                const keep =
                    count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

                if (keep) {
                    count += 1;
                }

                return keep;
            });
    }

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
                label="Area of Impact"
                className={classes.textField}
                value={values.category}
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
            <TextField
                label="Website or Social Media Link"
                className={classes.textField}
                value={values.website}
                onChange={handleChange('website')}
                margin="normal"
                variant="outlined"
            />
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
                        placeholder: 'Search for a skill',
                    });

                    return (
                        <div className={classes.container}>
                            {renderTagsInput({
                                fullWidth: true,
                                classes,
                                label: 'Skills Needed',
                                InputLabelProps: getLabelProps({ shrink: true }),
                                InputProps: { onBlur, onFocus },
                                inputProps,
                            })}

                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper className={classes.dropdownPaper}>
                                        {getTagSuggestions(inputValue).map((suggestion, index) =>
                                            renderTagsSuggestion({
                                                suggestion,
                                                index,
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
        </Fragment>
    )

    const renderContactInfo = () => (
        <Fragment>
            <TextField
                label="Phone Number"
                className={classes.textField}
                value={values.phoneNumber}
                onChange={handleChange('phoneNumber')}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Street Address"
                className={classes.textField}
                value={values.streetAddress}
                onChange={handleChange('streetAddress')}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="City"
                className={classes.textField}
                value={values.city}
                onChange={handleChange('city')}
                margin="normal"
                variant="outlined"
            />
            <TextField
                select
                label="State"
                className={classes.textField}
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
                className={classes.textField}
                value={values.zipCode}
                onChange={handleChange('zipCode')}
                margin="normal"
                variant="outlined"
            />
        </Fragment>
    )

    const renderDetailedInfo = () => (
        <Fragment>
            <TextField
                multiline
                label="Mission Statement"
                className={classes.textField}
                onChange={handleChange('missionStatement')}
                margin="normal"
                variant="outlined"
                rows="4"
            />
            <TextField
                multiline
                label="About the Organization"
                className={classes.textField}
                onChange={handleChange('description')}
                margin="normal"
                variant="outlined"
                rows="6"
            />
        </Fragment>
    )

    return (
        <Fragment>
            <Typography variant="h6">Register an Organization</Typography>
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
                onClick={() => props.createOrganization({ ...values })}
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
}

const useStyles = makeStyles(theme => ({
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
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
        transform: 'translateX(8.5%)'
    },
}));

CreateOrgForm.propTypes = {
    createdOrg: object.isRequired,
    orgIsCreated: bool.isRequired,
    isModal: bool,
    setModal: func
}

const mapStateToProps = (state) => {
    return {
        createdOrg: state.organization.createdOrg.data,
        orgIsCreated: state.organization.createdOrg.status === 'SUCCESS'
    }
}

export default connect(mapStateToProps, { getOrganizations, createOrganization })(CreateOrgForm)