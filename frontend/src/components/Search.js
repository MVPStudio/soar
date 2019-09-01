import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { array, bool, object } from 'prop-types';
import Fuse from 'fuse.js';

import { makeStyles  } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import InputBase from '@material-ui/core/InputBase';
import Chip from '@material-ui/core/Chip';

import TagsInputField from './forms/TagsInputField';
import CategorySelect from './forms/CategorySelect';
import CreateEditOrgForm from './forms/CreateEditOrg';
import OrganizationTable from './OrganizationTable';
import { getOrganizations, createOrganization, resetDeleteOrganization } from '../redux/actions/organization';

const FUSE_SEARCH_KEYS = [
    {
        name: 'name'
    }
]

const FUSE_SEARCH_OPTIONS = {
    keys: FUSE_SEARCH_KEYS,
    minMatchCharLength: 3,
    threshold: 0.3
};

const Search = (props) => {
    const classes = useStyles();

    const [isModalOpen, setModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState([]);

    useEffect(() => {
        props.getOrganizations();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const fuse = new Fuse(props.organizations, FUSE_SEARCH_OPTIONS)
        const results = fuse.search(searchTerm);

        setSearchResults(results)
    }, [searchTerm]) // eslint-disable-line react-hooks/exhaustive-deps

    // When the CreateEditOrgForm redirects here after a delete, reset deletedOrg prop
    useEffect(() => {
        if (props.orgIsDeleted) {
            props.resetDeleteOrganization();
        }
    }, [props.orgIsDeleted]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (category === 'All Categories') setCategory('')
    }, [category]) // eslint-disable-line react-hooks/exhaustive-deps

    const getFilteredOrgs = () => {
        let filteredOrgs = props.organizations;
        let filteredSearchResults = searchResults;

        if (category !== '') {
            filteredOrgs = filteredOrgs.filter(org => org.category === category);
            filteredSearchResults = filteredSearchResults.filter(org => org.category === category);
        }

        if (tags.length) {
            filteredOrgs = filteredOrgs.filter(org => (
                tags.every(tag => org.tags.includes(tag))
            ))

            filteredSearchResults = filteredSearchResults.filter(org => (
                tags.every(tag => org.tags.includes(tag))
            ))
        }

        return searchTerm.length ? filteredSearchResults : filteredOrgs;
    }

    const addTag = (tagToAdd) => {
        if (!tags.includes(tagToAdd)) {
            const newTags = [ ...tags, tagToAdd ];
            setTags(newTags);
        }
    }

    const removeTag = (tagToDelete) => {
        if (tags.includes(tagToDelete)) {
            const newTags = tags.filter(tag => tag !== tagToDelete);
            setTags(newTags);
        }
    }

    const renderTags = () => (
        <div className={classes.chipContainer}>
            {tags.map((tag, i) => (
                <Chip
                    label={tag}
                    key={`${tag}-${i}`}
                    onDelete={() => removeTag(tag)}
                    className={classes.chip}
                />
            ))}
        </div>
    )

    const renderSearchField = () => (
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <InputBase
                    fullWidth
                    type="search"
                    placeholder="Search organizations..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
            </Paper>
        </Grid>
    )

    const renderCategoryFilter = () => (
        <CategorySelect 
            isFilter
            selectedCategory={category} 
            setSelectedCategory={(e) => setCategory(e.target.value)}
        />
    )

    const renderTagFilter = () => (
        <TagsInputField 
            isFilter
            tags={tags} 
            addTag={addTag} 
        />
    )

    const renderMainContent = () => (
        <Container className={classes.root} maxWidth="sm">
            <Typography component="div">
                {renderSearchField()}
                <Grid item xs={12}>
                    <div className={classes.filtersContainer}>
                        {renderTagFilter()}
                        {renderCategoryFilter()}
                    </div>
                    {renderTags()}
                </Grid>
                <OrganizationTable orgs={getFilteredOrgs()} />
            </Typography>
        </Container>
    )

    const renderCreateOrgFab = () => (
        <Fab
            color="primary"
            className={classes.fab}
            onClick={() => setModal(true)}
        >
            <AddIcon />
        </Fab>
    )

    const renderCreateOrgModal = () => (
        <Modal
            open={isModalOpen}
            onBackdropClick={() => setModal(false)}
        >
            <Container maxWidth="sm" className={classes.modalContainer}>
                <Paper className={classes.paper}>
                    <CreateEditOrgForm
                        isModal
                        setModal={setModal}
                        history={props.history}
                    />
                </Paper>
            </Container>
        </Modal>
    )

    return (
        <Fragment>
            <CssBaseline />
            {renderMainContent()}
            {renderCreateOrgFab()}
            {renderCreateOrgModal()}
        </Fragment>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
    },
    orgLink: {
        width: '100%',
    },
    paper: {
        width: '100%',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        color: 'white'
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
    filtersContainer: {
        display: 'flex',
        flexFlow: 'row wrap',
        marginTop: theme.spacing(1),
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
}));

Search.propTypes = {
    organizations: array.isRequired,
    createdOrg: object.isRequired,
    orgsLoaded: bool.isRequired,
    orgIsCreated: bool.isRequired,
    orgIsDeleted: bool.isRequired
}

Search.defaultProps = {
    organizations: []
}

const mapStateToProps = (state) => {
    return {
        organizations: state.organization.allOrgs.data,
        createdOrg: state.organization.createdOrg.data,
        orgsLoaded: state.organization.allOrgs.status === 'SUCCESS',
        orgIsCreated: state.organization.createdOrg.status === 'SUCCESS',
        orgIsDeleted: state.organization.deletedOrg.status === 'SUCCESS'
    }
}

const mapDispatchToProps = {
    getOrganizations,
    createOrganization,
    resetDeleteOrganization
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)