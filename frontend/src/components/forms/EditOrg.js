import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bool, object, func } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { getOrganizations, editOrganization } from '../../redux/actions/organization';

const EditOrgForm = (props) => {
    const classes = useStyles();
    const [values, setValues] = useState({
        name: props.organization.name
    });

    useEffect(() => {
        if (props.orgIsCreated) {
            props.history.push(`/org/${props.createdOrg._id}`);
        }
    }, [props.orgIsCreated]) // eslint-disable-line react-hooks/exhaustive-deps

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
            <Typography variant="h6">Edit Organization</Typography>
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
}));

EditOrgForm.propTypes = {
    editedOrg: object.isRequired,
    orgIsEdited: bool.isRequired,
    isModal: bool,
    setModal: func
}

const mapStateToProps = (state) => {
    return {
        selectedOrg: state.organization.selectedOrg.data,
        editedOrg: state.organization.editedOrg.data,
        orgIsEdited: state.organization.editedOrg.status === 'SUCCESS'
    }
}

export default connect(mapStateToProps, { getOrganizations, editOrganization })(EditOrgForm)