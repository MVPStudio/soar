import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';

import EditOrganization from '../../components/Forms/EditOrganization';
import { SUCCESS, NOT_STARTED } from '../../../state/statusTypes';
import { 
    getOrganizationById, 
    getOrganizationsById, 
    updateOrganization, 
    getOrgProjectsById 
} from '../../../state/actions/organizationActions';

import defaultProfilePic from '../../../static/imgs/default-profile-pic.jpeg';
import Loader from '../../components/Loader';
import './Organization.scss';

class OrganizationPage extends Component {
    constructor(props) {
        super(props);
        this.state = { showEditOrgModal: false };
        this.once = 0;

        const organizationId = _.get(props, 'computedMatch.params.id', '');
        props.getOrganizationById(organizationId);
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.getOrgStatus === SUCCESS
            && this.props.getOrgProjectsStatus === NOT_STARTED
            && !_.isEmpty(this.props.organization.projectIds)
        ) {
            this.props.getOrgProjectsById(this.props.organization.projectIds);
        }

        const isModalShown = this.state.showEditOrgModal;
        const isNewOrgData = prevProps.organization !== this.props.organization;
        const isNewDataFinal = this.props.updateOrgStatus === SUCCESS;

        if (isModalShown && isNewOrgData && isNewDataFinal) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ showEditOrgModal: false });
        }
    }

    toggleModal = () => {
        this.setState({ 
            showEditOrgModal: !this.state.showEditOrgModal 
        });
    }

    addUserToOrganization = () => {
        const { _id, memberIds } = this.props.organization;
        const newMemberIds = [...memberIds, this.props.userId];
        this.props.updateOrganization(_id, { memberIds: newMemberIds });
    };

    submitEdits = (updates) => {
        this.props.updateOrganization(this.props.organization._id, updates);
    };

    renderModal() {
        return (
            <Modal 
                show={this.state.showEditOrgModal} 
                onHide={() => this.setState({ showEditOrgModal: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Organization</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <EditOrganization
                        initialValues={this.props.organization}
                        onSubmit={this.submitEdits}
                    />
                </Modal.Body>
            </Modal>
        );
    }

    renderHeader(name, category) {
        return (
            <div className="org-header">
                <h1 className="org-name">{name}</h1>
                <Badge 
                    pill 
                    variant="secondary"
                    style={{ width: 'max-content', marginTop: '0.5rem' }}
                >
                    {category}
                </Badge>
            </div>
        );
    }

    renderContactInfo(address, website, contactInformation) {
        const { city, state } = address || {};
        const { email, phoneNumber } = contactInformation || {};
        const hasContactInfo = (city && state) || email || phoneNumber;

        if (hasContactInfo) {
            return (
                <div className="contact">
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {   
                                    city && state &&
                                    <ListGroup.Item>
                                        <div>{`${city}, ${state}`}</div>
                                    </ListGroup.Item>
                                }
                                {
                                    email && 
                                    <ListGroup.Item>
                                        <div>{email}</div>
                                    </ListGroup.Item>
                                }
                                {
                                    website && 
                                    <ListGroup.Item>
                                        <a href={`https://${website}`}>{website}</a>
                                    </ListGroup.Item>
                                }
                                {
                                    phoneNumber && 
                                    <ListGroup.Item>
                                        <div>{phoneNumber}</div>
                                    </ListGroup.Item>
                                }
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </div>
            );
        }
    }

    renderJoinButton(userIsMember) {
        return userIsMember ? (
            <Button 
                variant="outline-success"
                className="join-project-button"
            >
                You're a member!
            </Button>
        ) : (
            <Button 
                variant="outline-success"
                className="join-project-button"
                onClick={this.addUserToOrganization}
            >
                Request to join
            </Button>
        );
    }

    renderEditButton() {
        return (
            <Button 
                variant="outline-success"
                className="edit-org-button"
                onClick={this.toggleModal}
            >
                Edit organization
            </Button>
        );
    }

    renderDescription(description) {
        const hasDescription = description && !_.isEmpty(description);

        if (hasDescription) {
            return (
                <div className="description">
                    <Card>
                        <Card.Header>
                            <b>Mission Statement</b>
                        </Card.Header>
                        <Card.Body>
                            {description}
                        </Card.Body>
                    </Card>
                </div>
            );
        }
    }

    renderProjects(projects) {
        const projectsOrMsg = !_.isEmpty(projects)
            ? _.map(projects, (project, index) => this.renderProjectCard(project, index))
            : <i>No projects yet!</i>;

        return (
            <div className="org-projects">
                <Card>
                    <Card.Header>
                        <b>Projects Led</b>
                    </Card.Header>
                    <Card.Body className="org-projects-body">
                        {projectsOrMsg}
                    </Card.Body>
                </Card>
            </div>
        );
    }

    renderProjectCard(project, index) {
        const { name, _id, description } = project;

        return (
            <Card key={index} className="project-card">
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body className="project-card-body">
                    <div className="top">
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>
                            {_.truncate(description, { length: 250 })}
                        </Card.Text>
                    </div>
                    <Link to={`/project/${_id}`}>
                        <Button 
                            variant="outline-success"
                            className="project-view-button"
                        >
                            View
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    }

    renderMembers(members) {
        const membersOrMsg = !_.isEmpty(members) 
            ? _.map(members, (member, index) => this.renderMember(member, index))
            : <i>No members yet!</i>;

        return (
            <div className="org-members">
                <Card>
                    <Card.Header>
                        <b>Members</b>
                    </Card.Header>
                    <Card.Body className="org-members-body">
                        {membersOrMsg}
                    </Card.Body>
                </Card>
            </div>
        );
    }

    renderMember(member, index) {
        return (
            <div key={`member-${index}`} className="org-member">
                <img src={defaultProfilePic} alt={member.name} />
                <div>{member.name}</div>
            </div>
        );
    }

    renderTags(tags) {
        if (tags.length > 0) {
            return (
                <Card className="org-tags-card">
                    <Card.Header>
                        <b>Desired Skills & Interests</b>
                    </Card.Header>
                    <Card.Body>
                        <div className="org-tags">
                            {_.map(tags, tag => (
                                <h5 style={{ margin: 0 }}>
                                    <Badge pill className="tag" variant="success">{tag}</Badge>
                                </h5>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            );
        }
    }

    render() {
        const { organization, getOrgStatus } = this.props;

        const { 
            name, 
            address, 
            contactInformation, 
            description, 
            projects, 
            website,
            tags,
            category
        } = organization;

        if (getOrgStatus !== SUCCESS) return <Loader />;

        return (
            <div className="org-page">
                {this.renderModal()}
                {this.renderHeader(name, category)}
                <hr />
                <div className="org-content">
                    <div className="side">
                        {this.renderEditButton()}
                        {this.renderContactInfo(address, website, contactInformation)}
                        {this.renderTags(tags)}
                    </div>
                    <div className="main">
                        {this.renderDescription(description)}
                        {this.renderProjects(projects.data)}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    events: _.get(state, 'events', {}),
    posts: _.get(state, 'posts', {}),
    user: _.get(state, 'user', {}),
    organization: _.get(state, 'organizations.selectedOrg.data', {}),
    projects: _.get(state, 'organizations.selectedOrg.data.projects.data', []),
    projectsStatus: _.get(state, 'projects.projectsForOrganization.statusText', NOT_STARTED),
    updateOrgStatus: _.get(state, 'organizations.selectedOrg.status.update'),
    getOrgStatus: _.get(state, 'organizations.selectedOrg.status.get'),
    getOrgProjectsStatus: _.get(state, 'organizations.selectedOrg.data.projects.status', NOT_STARTED),
    projectIds: _.get(state, 'organizations.selectedOrg.data.0.projectIds'),
    form: _.get(state, 'form.EditOrganization'),
    userId: _.get(state, 'user.data._id', ''),
});

const mapDispatchToProps = { 
    getOrganizationById, 
    getOrganizationsById, 
    updateOrganization,
    getOrgProjectsById
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationPage);
