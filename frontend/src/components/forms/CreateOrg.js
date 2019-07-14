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

import { getOrganizations, createOrganization } from '../../redux/actions/organization';
import { categories, states } from './FormValues';

const CreateOrgForm = (props) => {
    const classes = useStyles();
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
    const [selectedTab, setSelectedTab] = useState(0);

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
                required
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
                rows="4"
            />
            <TextField
                label="Skills desired"
                className={classes.textField}
                value={values.tags}
                onChange={handleChange('tags')}
                margin="normal"
                variant="outlined"
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
    }
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