import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { array, bool } from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { getOrganizations, createOrganization } from '../redux/actions/organization';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    modalContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        outline: 'none'
    },
    divider: {
        margin: theme.spacing(2)
    },
    textField: {
        width: '85%'
    },
    button: {
        margin: theme.spacing(1),
    },
}));

const Explore = (props) => {
    const classes = useStyles();
    const [isModalOpen, setModal] = useState(false);
    const [values, setValues] = React.useState({
        name: ''
    });
    
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };
    
    useEffect(() => {
        props.getOrganizations();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const renderOrgGridItems = () => {
        return props.organizations.map(org => (
            <Grid item key={org._id} xs={12}>
                <Link 
                    component={RouterLink} 
                    to={`/org/${org._id}`} 
                    underline="none"
                >
                    <Paper className={classes.paper}>
                        {org.name}
                    </Paper>
                </Link>
            </Grid>
        ))
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Typography component="div">
                    <Grid container spacing={3}>
                        {renderOrgGridItems()}
                    </Grid>
                </Typography>
            </Container>
            <Fab 
                color="primary" 
                className={classes.fab} 
                onClick={() => setModal(true)}
            >
                <AddIcon />
            </Fab>
            <Modal 
                open={isModalOpen}
                onBackdropClick={() => setModal(false)}
            >
                <Container maxWidth="sm" className={classes.modalContainer}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6">Register an Organization</Typography>
                        <Divider className={classes.divider} />
                        <TextField
                            label="Name"
                            className={classes.textField}
                            value={values.name}
                            onChange={handleChange('name')}
                            margin="normal"
                            variant="outlined"
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            className={classes.button}
                            onClick={() => props.createOrganization({ name: values.name })}
                        >
                            Submit
                        </Button>
                        <Button className={classes.button} onClick={() => setModal(false)}>
                            Cancel
                        </Button>
                    </Paper>
                </Container>
            </Modal>
        </div>
    )
}

Explore.propTypes = {
    organizations: array.isRequired,
    isLoaded: bool.isRequired
}

const mapStateToProps = (state) => {
    return {
        organizations: state.organization.allOrgs.data,
        isLoaded: state.organization.allOrgs.status === 'SUCCESS'
    }
}

export default connect(mapStateToProps, { getOrganizations, createOrganization })(Explore)