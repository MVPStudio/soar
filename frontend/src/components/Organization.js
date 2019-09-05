import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { object, bool } from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import SvgIcon from '@material-ui/core/SvgIcon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Home, Phone, Link as LinkIcon, EmailOutlined, AvTimer, AccountCircle, Accessible } from '@material-ui/icons';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/KeyboardBackspace';

import LoadingDots from '../utils/LoadingDots';
import CreateEditOrgForm from './forms/CreateEditOrg';
import { getOrganization, resetCreateOrganization, resetEditOrganization } from '../redux/actions/organization';

const Organization = (props) => {
    const classes = useStyles();
    const [isModalOpen, setModal] = useState(false);

    useEffect(() => {
        const orgId = window.location.pathname.replace('/org/', '');
        props.getOrganization(orgId);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // When the CreateEditOrgForm redirects here, reset createdOrg prop
    useEffect(() => {
        if (props.orgIsCreated) {
            props.resetCreateOrganization();
        }
    }, [props.orgIsCreated]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (props.orgIsEdited) {
            setModal(false);
            props.resetEditOrganization();
            props.getOrganization(props.organization._id);
        }
    }, [props.orgIsEdited]) // eslint-disable-line react-hooks/exhaustive-deps

    const StyledBadge = withStyles(() => ({
        badge: {
            left: 0,
            right: 'initial',
            transform: 'translate(-10%, -30%)',
            color: 'white'
        },
        root: {
            width: '100%'
        }
    }))(Badge);

    const renderMainContent = () => (
        <Container className={classes.root} maxWidth="sm">
            <StyledBadge badgeContent={props.organization.category} color="primary">
                <Paper className={classes.paper}>
                    <Typography variant="h5">{props.organization.Service_Name}</Typography>
                    {
                        props.organization.Description_of_Service !== '' &&
                        <Fragment>
                            <Divider className={classes.divider} />
                            <Typography align="left" className={classes.orgDescription}>
                                {props.organization.Description_of_Service}
                            </Typography>
                        </Fragment>
                    }
                </Paper>
            </StyledBadge>
            <Paper className={classes.paper}>
                <ContactInfo org={props.organization} />
            </Paper>
            <Paper className={classes.paper}>
                <ContactInfo useContact org={props.organization} />
            </Paper>
            {/* {
                props.organization.tags &&
                <Paper className={classes.paper}>
                    <Chip 
                        label={props.organization.tags.length ? 'Actions:' : 'No actions yet'} 
                        className={classes.chip} 
                        variant="outlined" 
                    />
                    {
                        props.organization.tags.map((tag, i) => (
                            <Chip key={`${tag}-${i}`} label={tag} className={classes.chip} />
                        ))
                    }
                </Paper>
            } */}
            <div className={classes.backButtonContainer}>
                <Button variant="outlined" size="small" className={classes.backButton} component={RouterLink} to="/">
                    <BackIcon className={classes.backIcon} />
                    Back to search
                </Button>
            </div>
        </Container>
    )

    const renderEditOrgFab = () => (
        <Fab
            color="primary"
            className={classes.fab}
            onClick={() => setModal(true)}
        >
            <SvgIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
            </SvgIcon>
        </Fab>
    )

    const renderEditOrgModal = () => (
        <Modal
            open={isModalOpen}
            onBackdropClick={() => setModal(false)}
        >
            <Container maxWidth="sm" className={classes.modalContainer}>
                <Paper className={classes.paper}>
                    <CreateEditOrgForm
                        editing
                        isModal
                        setModal={setModal}
                        history={props.history}
                    />
                </Paper>
            </Container>
        </Modal>
    )

    return props.isLoaded ? (
        <Fragment>
            <CssBaseline />
            {renderMainContent()}
            {/* {renderEditOrgFab()} */}
            {renderEditOrgModal()}
        </Fragment>
    ) : (
        <div className={classes.loadingDotsContainer}>
            <LoadingDots />
        </div>
    )
}

const ContactInfo = ({ org, useContact }) => {
    const classes = useStyles();

    const { 
        Physical_Site_Address_1: streetAddress, 
        Physical_Site_City: city, 
        Physical_Site_State: state, 
        Physical_Site_Zip: zipCode, 
        Contacts_First: contactName,
        Contacts_Position: contactPosition,
        Contacts_Phone: contactPhone,
        Contacts_Email: contactEmail,
        Main_Phone: phoneNumber, 
        Fax: faxNumber, 
        TDD_Phone: tddNumber, 
        Emergency_After_Hours_Phone: emergencyNumber,
        Hours_of_Operation: hours,
        Service_Location_Email: email, 
        Web_Address: website,
        ADA_Access: adaAccess
    } = org;

    const isEmpty = (string) => { return string === '' }

    const atLeastOnePhoneNumberExists = !isEmpty(phoneNumber) || !isEmpty(faxNumber) || !isEmpty(tddNumber) || !isEmpty(emergencyNumber);
    const atLeastOneAddressValueExists = !isEmpty(streetAddress) || !isEmpty(city) || !isEmpty(state) || !isEmpty(zipCode);
    const atLeastOneContactValueExists = !isEmpty(contactName) || !isEmpty(contactPosition) || !isEmpty(contactPhone) || !isEmpty(contactEmail);
    const noValuesExist = !atLeastOneAddressValueExists && !atLeastOnePhoneNumberExists && isEmpty(email) && isEmpty(website);

    if (noValuesExist || (useContact && !atLeastOneContactValueExists)) {
        return (
            <List className={classes.listRoot}>
                <Typography className={classes.italic}>
                    {`No ${useContact && 'secondary'} contact information`}
                </Typography>
            </List>
        )
    }

    if (useContact) {
        return (
            <List className={classes.listRoot}>
                {
                    !isEmpty(contactName) &&
                    <Fragment>
                        <ListItem>
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText>
                                <b>{contactName}</b>
                                {!isEmpty(contactPosition) && <div>{contactPosition}</div>}
                            </ListItemText>
                        </ListItem>
                        {(!isEmpty(contactPhone) || !isEmpty(contactEmail)) && <Divider />}
                    </Fragment>
                }
                {
                    !isEmpty(contactPhone) &&
                    <Fragment>
                        <ListItem>
                            <ListItemIcon>
                                <Phone />
                            </ListItemIcon>
                            <ListItemText>{contactPhone}</ListItemText>
                        </ListItem>
                        {!isEmpty(contactEmail) && <Divider />}
                    </Fragment>
                }
                {
                    !isEmpty(contactEmail) &&
                    <Fragment>
                        <ListItem>
                            <ListItemIcon>
                                <EmailOutlined />
                            </ListItemIcon>
                            <ListItemText>{contactEmail}</ListItemText>
                        </ListItem>
                    </Fragment>
                }
            </List>
        )
    }

    return (
        <List className={classes.listRoot}>
            {
                atLeastOneAddressValueExists &&
                <Fragment>
                    <ListItem>
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText>
                            <div>{streetAddress}</div>
                            <div>
                                {!isEmpty(city) && city}
                                {!isEmpty(city) && !isEmpty(state) && `, `}
                                {!isEmpty(state) && state}
                                {!isEmpty(state) && !isEmpty(zipCode) && ` `}
                                {!isEmpty(zipCode) && zipCode}
                            </div>
                        </ListItemText>
                    </ListItem>
                    {(atLeastOnePhoneNumberExists || !isEmpty(adaAccess) || !isEmpty(hours) || !isEmpty(email) || !isEmpty(website)) && <Divider />}
                </Fragment>
            }
            {
                atLeastOnePhoneNumberExists &&
                <Fragment>
                    <ListItem>
                        <ListItemIcon>
                            <Phone />
                        </ListItemIcon>
                        <ListItemText>
                            {!isEmpty(phoneNumber) && <div><b>Main:</b> {phoneNumber}</div>}
                            {!isEmpty(faxNumber) && <div><b>Fax:</b> {faxNumber}</div>}
                            {!isEmpty(tddNumber) && <div><b>TDD:</b> {tddNumber}</div>}
                            {!isEmpty(emergencyNumber) && <div><b>Emergency:</b> {emergencyNumber}</div>}
                        </ListItemText>
                    </ListItem>
                    {(!isEmpty(adaAccess) || !isEmpty(hours) || !isEmpty(email) || !isEmpty(website)) && <Divider />}
                </Fragment>
            }
            {
                !isEmpty(adaAccess) &&
                <Fragment>
                    <ListItem>
                        <ListItemIcon>
                            <Accessible />
                        </ListItemIcon>
                        <ListItemText>{adaAccess}</ListItemText>
                    </ListItem>
                    {(!isEmpty(hours) || !isEmpty(email) || !isEmpty(website)) && <Divider />}
                </Fragment>
            }
            {
                !isEmpty(hours) &&
                <Fragment>
                    <ListItem>
                        <ListItemIcon>
                            <AvTimer />
                        </ListItemIcon>
                        <ListItemText>{hours}</ListItemText>
                    </ListItem>
                    {(!isEmpty(email) || !isEmpty(website)) && <Divider />}
                </Fragment>
            }
            {
                !isEmpty(email) &&
                <Fragment>
                    <ListItem>
                        <ListItemIcon>
                            <EmailOutlined />
                        </ListItemIcon>
                        <ListItemText>{email}</ListItemText>
                    </ListItem>
                    {!isEmpty(website) && <Divider />}
                </Fragment>
            }
            {
                !isEmpty(website) &&
                <Fragment>
                    <ListItem>
                        <ListItemIcon>
                            <LinkIcon />
                        </ListItemIcon>
                        <ListItemText>
                            <Link 
                                href={website} 
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {website}
                            </Link>
                        </ListItemText>
                    </ListItem>
                </Fragment>
            }
        </List>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4)
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        color: 'white'
    },
    paper: {
        width: '100%',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    modalContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        outline: 'none'
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    listRoot: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    orgDescription: {
        whiteSpace: 'pre-line',
        maxHeight: '300px',
        overflow: 'auto'
    },
    chip: {
        margin: theme.spacing(1),
    },
    italic: {
        fontStyle: 'italic'
    },
    backButtonContainer: {
        margin: 'auto',
        width: 'max-content'
    },
    backButton: {
        margin: `${theme.spacing(1)}px 0 ${theme.spacing(2)}px 0`
    },
    backIcon: {
        marginRight: theme.spacing(0.5)
    },
    loadingDotsContainer: {
        display: 'flex',
        justifyContent: 'center',
    }
}));

Organization.propTypes = {
    organization: object.isRequired,
    isLoaded: bool.isRequired,
    orgIsCreated: bool.isRequired,
    orgIsEdited: bool.isRequired
}

const mapStateToProps = (state) => {
    return {
        organization: state.organization.selectedOrg.data,
        isLoaded: state.organization.selectedOrg.status === 'SUCCESS',
        orgIsCreated: state.organization.createdOrg.status === 'SUCCESS',
        orgIsEdited: state.organization.editedOrg.status === 'SUCCESS'
    }
}

const mapDispatchToProps = {
    getOrganization,
    resetCreateOrganization,
    resetEditOrganization
}

export default connect(mapStateToProps, mapDispatchToProps)(Organization)