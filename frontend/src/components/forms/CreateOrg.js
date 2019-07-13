import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bool, object, func } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { getOrganizations, createOrganization } from '../../redux/actions/organization';

const CreateOrgForm = (props) => {
    const classes = useStyles();
    const [values, setValues] = useState({
        name: ''
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
            <Typography variant="h6">Register an Organization</Typography>
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
                onClick={() => props.createOrganization({ name: values.name })}
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