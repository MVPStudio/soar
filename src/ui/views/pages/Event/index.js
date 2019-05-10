import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';

import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

import { SUCCESS } from '../../../state/statusTypes';
import { getEventById, updateEvent } from '../../../state/actions/eventActions.js';
import EditEvent from '../../components/Forms/EditEvent';

import Loader from '../../components/Loader';
import defaultProfilePic from '../../../static/imgs/default-profile-pic.jpeg';

import './EventPage.scss';

class EventPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditModal: false
        };
    }

    componentDidMount() {
        const eventId = _.get(this.props, 'computedMatch.params.id', '');
        this.props.getEventById(eventId);
    }

    componentDidUpdate(prevProps) {
        const isModalShown = this.state.showEditModal;
        const isNewEventData = prevProps.event !== this.props.event;
        const isNewDataFinal = this.props.updateEventStatus === SUCCESS;

        if (isModalShown && isNewEventData && isNewDataFinal) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ showEditModal: false });
        }
    }

    submitEdits = (values) => {
        this.props.updateEvent(this.props.event._id, values);
    };

    updateEventAttendance = () => {
        const obj = {
            attendeeId: this.props.userId,
        };
        this.props.updateEvent(this.props.event._id, obj);
    };

    toggleModal = () => {
        this.setState({ 
            showEditModal: !this.state.showEditModal 
        });
    }

    renderModal() {
        const event = _.mapValues(this.props.event, (value, key) => {
            if (key === 'date') {
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
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <EditEvent
                        initialValues={event}
                        onSubmit={this.submitEdits}
                    />
                </Modal.Body>
            </Modal>
        );
    }

    renderHeader(name, project) {
        return (
            <Fragment>
                <Button 
                    variant="light"
                    className="edit-event-button"
                    onClick={this.toggleModal}
                >
                    Edit event
                </Button>
                <Jumbotron className="event-jumbotron">
                    <h1 style={{ marginBottom: '1rem' }}>{name}</h1>
                    <i>Part of the <Link to={`/project/${project._id}`} style={{ textDecoration: 'underline' }}>{project.name}</Link> project</i>
                </Jumbotron>
            </Fragment>
        );
    }

    renderDescription(description) {
        if (description) {
            return (
                <Card className="event-description-card">
                    <Card.Header>
                        <b>Event Details</b>
                    </Card.Header>
                    <Card.Body>{description}</Card.Body>
                </Card>
            );
        }
    }

    renderTags(tags) {
        if (tags.length > 0) {
            return (
                <Card className="event-tags-card">
                    <Card.Header>
                        <b>Desired Skills & Interests</b>
                    </Card.Header>
                    <Card.Body>
                        <div className="event-tags">
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

    renderGoals(goals) {
        if (goals.length) {
            return (
                <Card className="event-goals-card">
                    <Card.Header>
                        <b>Goals</b>
                    </Card.Header>
                    <Card.Body>
                        <ul>
                            {_.map(goals, goal => (
                                <li>{goal}</li>
                            ))}
                        </ul>
                    </Card.Body>
                </Card>
            );
        }
    }

    renderAttendanceControl(isAttending) {
        return (
            <Card className="attendance-control-card">
                <Card.Body>
                    <b>{isAttending ? 'You\'re going to this event!' : 'Are you going?'}</b>
                    <Button 
                        variant="outline-success"
                        className="attendance-control-button"
                        onClick={this.updateEventAttendance}
                    >
                        { isAttending ? 'Cancel' : 'Yes' }
                    </Button>
                </Card.Body>
            </Card>
        );
    }

    renderEventDateLocation(date, startTime, endTime, address) {
        const { street, city, state, zipCode } = address;
        const formattedStartTime = moment(startTime, 'HH:mm').format('h:mm a');
        const formattedEndTime = !_.isUndefined(endTime) ? ` - ${moment(endTime, 'HH:mm').format('h:mm a')}` : '';

        return (
            <div className="date-location-card">
                <Card>
                    <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <i className="fa fa-calendar" />
                                {moment(date).format('ddd, MMMM D, YYYY')}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <i className="fa fa-clock" />
                                {`${formattedStartTime}${formattedEndTime}`}
                            </ListGroup.Item>
                            <ListGroup.Item className="event-address">
                                <i className="fa fa-map-marker" />
                                <div>
                                    <div>{street}</div>
                                    <div>{`${city}, ${state} ${zipCode}`}</div>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    renderAttendees(attendees) {
        const length = _.get(attendees, 'length', 0);

        return (
            <Card className="attendees-card">
                <Card.Header>
                    <b>{`Attendees (${length})`}</b>
                </Card.Header>
                <Card.Body>
                    {_.map(attendees, (attendee, i) => (
                        <Fragment key={`attendee-${i}`}>
                            <div className="attendee">
                                <img src={defaultProfilePic} alt={attendee.name} />
                                <div>{attendee.name}</div>
                            </div>
                            <hr />
                        </Fragment>
                    ))}
                </Card.Body>
            </Card>
        );
    }
    
    render() {
        const { event, userId, getEventStatus } = this.props;

        if (getEventStatus !== SUCCESS) return <Loader />;

        const { 
            name, 
            date, 
            startTime, 
            endTime, 
            address, 
            description, 
            attendeeIds, 
            attendees, 
            project, 
            goals,
            tags
        } = event;

        const isAttending = _.includes(attendeeIds, userId);

        return (
            <Fragment>
                {this.renderModal()}
                <div className="event-page">
                    <div className="main">
                        {this.renderHeader(name, project)}
                        {this.renderDescription(description)}
                        {this.renderTags(tags)}
                        {this.renderGoals(goals)}
                    </div>
                    <div className="side">
                        {this.renderAttendanceControl(isAttending)}
                        {this.renderEventDateLocation(date, startTime, endTime, address)}
                        {this.renderAttendees(attendees)}
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        events: _.get(state, 'events.data', {}),
        event: _.get(state, 'events.selectedEvent.data', {}),
        getEventStatus: _.get(state, 'events.selectedEvent.status.get'),
        createEventStatus: _.get(state, 'events.selectedEvent.status.create'),
        updateEventStatus: _.get(state, 'events.selectedEvent.status.update'),
        userId: _.get(state, 'user.data._id', ''),
        attendeeIds: _.get(state, 'events.selectedEvent.data.attendeeIds', []),
        attendees: _.get(state, 'events.selectedEvent.data.attendees', []),
        form: _.get(state, 'form.EditEvent'),
    });
};

export default connect(mapStateToProps, { getEventById, updateEvent })(EventPage);
