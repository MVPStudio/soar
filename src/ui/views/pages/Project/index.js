import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';

import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';

import { getProjectById, updateProject } from '../../../state/actions/projectActions';
import { getOrganizationById } from '../../../state/actions/organizationActions';
import { getEventsById } from '../../../state/actions/eventActions';
import { NOT_STARTED, SUCCESS } from '../../../state/statusTypes';

import Loader from '../../components/Loader';
import EditProject from '../../components/Forms/EditProject';

import './ProjectPage.scss';

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditModal: false
        };
    }

    componentDidMount() {
        const projectID = _.get(this.props, 'computedMatch.params.id', 'projectID');
        this.props.getProjectById(projectID);
    }

    componentDidUpdate(prevProps) {
        const isModalShown = this.state.showEditModal;
        const isNewProjectData = prevProps.project !== this.props.project;
        const isNewDataFinal = this.props.updateProjectStatus === SUCCESS;

        if (isModalShown && isNewProjectData && isNewDataFinal) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ showEditModal: false });
        }

        if (
            this.props.getProjectStatus === SUCCESS 
            && !_.isEmpty(this.props.project.eventIds) 
            && this.props.eventsByIdStatus !== SUCCESS
        ) {
            this.props.getEventsById(this.props.project.eventIds);
        }
    }

    submitEdits = (updates) => {
        this.props.updateProject(this.props.project._id, updates);
    };

    toggleModal = () => {
        this.setState({ 
            showEditModal: !this.state.showEditModal 
        });
    }

    renderModal() {
        const project = _.mapValues(this.props.project, (value, key) => {
            if (key === 'completedAt' || key === 'completedAtExpected') {
                return moment(value).format('YYYY-MM-DD');
            }
            return value;
        });

        return (
            <Modal 
                show={this.state.showEditModal} 
                onHide={() => this.setState({ showEditModal: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Project</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <EditProject
                        initialValues={project}
                        onSubmit={this.submitEdits}
                    />
                </Modal.Body>
            </Modal>
        );
    }

    renderHeader(name, organization, description, completedAtExpected, status) {
        const { name: orgName, _id: orgId } = organization;

        return (
            <Fragment>
                <Button 
                    variant="light"
                    className="edit-project-button"
                    onClick={this.toggleModal}
                >
                    Edit project
                </Button>
                <Jumbotron className="project-jumbotron">
                    <h1 style={{ marginBottom: '1rem' }}>{name}</h1>
                    {
                        status &&
                        <Fragment>
                            <b>Status:</b> <i>{status}</i>
                        </Fragment>
                    }
                    {
                        completedAtExpected && 
                        <Fragment>
                            <br />
                            <b>Expected completion:</b> <i>{moment(completedAtExpected).format('MMMM D, YYYY')}</i>
                            <br />
                        </Fragment>
                    }
                    <Fragment>
                        <b>Project led by: </b> 
                        <i>
                            <Link to={`/organization/${orgId}`} style={{ textDecoration: 'underline' }}>
                                {orgName}
                            </Link>
                        </i>
                    </Fragment>
                    { 
                        description &&
                        <Fragment>
                            <hr />
                            <p style={{ margin: 0 }}>{description}</p>
                        </Fragment>
                    }
                </Jumbotron>
            </Fragment>
        );
    }

    renderEvents(events) {
        if (events && events.length) {
            return (
                <Card className="events-card">
                    <Card.Header>
                        <div className="header">
                            <b>Events in this Project</b>
                            <div>
                                <span><i className="fas fa-circle" />Past</span>
                                <span><i className="fas fa-adjust" />Today</span>
                                <span><i className="far fa-circle" />Future</span>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {this.renderTimeline(events)}
                    </Card.Body>
                </Card>
            );
        }
    }

    renderTimeline(events) {
        return (
            <div className="event-timeline">
                {_.map(events, (event, index) => (
                    this.renderEventRow(event, index)
                ))}
            </div>
        );
    }

    renderEventRow(event, index) {
        return (
            <div className="event-row" key={`event-${index}`}>
                {this.renderEventDate(event, index)}
                {this.renderEventNode(event)}
                {this.renderEventDescription(event, index)}
            </div>
        );
    }

    renderEventDate(event) {
        const { eventDate, date } = event;
        const chosenDate = !date ? eventDate : date;

        const dateMonth = moment(chosenDate).format('M/D');
        const weekDay = moment(chosenDate).format('ddd');

        return (
            <Alert variant="secondary" className="event-date">
                <div>{dateMonth}</div>
                <div className="week-day">{weekDay.toLowerCase()}</div>
            </Alert>
        );
    }

    renderEventNode(event) {
        const { eventDate, date } = event;
        const chosenDate = !date ? moment(eventDate) : moment(date);
        const now = moment();

        let nodeIcon = now.isBefore(chosenDate) ? 'far fa-circle' : 'fas fa-circle';

        if (now.isSame(chosenDate, 'day')) {
            nodeIcon = 'fas fa-adjust';
        }

        return (
            <div className="event-node">
                <i className={nodeIcon} />
            </div>
        );
    }

    renderEventDescription(event, index) {
        const { name, _id, description } = event;

        return (
            <Card key={index} className="event-description">
                <Card.Body className="event-card-body">
                    <div className="top">
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>
                            {_.truncate(description, { length: 150 })}
                        </Card.Text>
                    </div>
                    <Link to={`/event/${_id}`}>
                        <Button 
                            variant="outline-success"
                            className="event-view-button"
                        >
                            View
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    }

    renderTags(tags) {
        if (tags.length > 0) {
            return (
                <Card className="project-tags-card">
                    <Card.Header>
                        <b>Desired Skills & Interests</b>
                    </Card.Header>
                    <Card.Body>
                        <div className="project-tags">
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

    renderAlliance(alliance) {
        if (alliance && alliance.length) {
            return (
                <Card className="alliance-card">
                    <Card.Header>
                        <b>Alliance</b>
                    </Card.Header>
                    <Card.Body className="alliance-card-body">
                        {_.map(alliance, (org, index) => this.renderOrganizationCard(org, index))}
                    </Card.Body>
                </Card>
            );
        }
    }

    renderOrganizationCard(org, index) {
        const { name, _id, tagline } = org;

        return (
            <Card key={index} className="organization-card">
                <Card.Body className="organization-card-body">
                    <div className="top">
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>
                            {_.truncate(tagline, { length: 150 })}
                        </Card.Text>
                    </div>
                    <Link to={`/organization/${_id}`}>
                        <Button 
                            variant="outline-success"
                            className="org-view-button"
                        >
                            View
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    }

    render() {
        const { 
            project, 
            organization, 
            getProjectStatus, 
            eventsById 
        } = this.props;

        if (getProjectStatus !== SUCCESS) return <Loader />;

        const {
            name,
            description,
            alliance_data: alliance,
            tags,
            completedAtExpected,
            status
        } = project;

        const eventsDescending = _.reverse(_.sortBy(eventsById, 'date'));

        return (
            <div className="project-page">
                {this.renderModal()}
                {this.renderHeader(name, organization, description, completedAtExpected, status)}
                {this.renderEvents(eventsDescending)}
                {this.renderTags(tags)}
                {this.renderAlliance(alliance)}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    project: _.get(state, 'projects.selectedProject.data', {}),
    getProjectStatus: _.get(state, 'projects.selectedProject.status.get'),
    updateProjectStatus: _.get(state, 'projects.selectedProject.status.update'),
    organizations: _.get(state, 'organizations.data', {}),
    organization: _.get(state, 'projects.selectedProject.data.organization', {}),
    organizationId: _.get(state, 'organizations.selectedOrg.data.organizationId', {}),
    projectEvents: _.get(state, 'projects.selectedProject.data.events', []),
    eventsById: _.get(state, 'events.eventsById.data', []),
    eventsByIdStatus: _.get(state, 'events.eventsById.status', NOT_STARTED),
    form: _.get(state, 'form.EditProject'),
});

const mapDispatchToProps = {
    getProjectById, 
    getOrganizationById,
    updateProject, 
    getEventsById,
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);
