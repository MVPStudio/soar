import React, { Fragment } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

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
                color="primary"
                variant="contained" 
                className={classes.deleteButton}
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
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(1),
    },
    deleteButton: {
        margin: theme.spacing(1),
        color: 'white',
    },
    deleteAreYouSure: {
        width: '85%',
        margin: 'auto',
        marginBottom: '0.5rem'
    }
}));

export default DeleteOrgDialog;
