import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';

import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Loader from '../../components/Loader';

import { getEvents } from '../../../state/actions/eventActions';
import { SUCCESS } from '../../../state/statusTypes';

class EventFeed extends Component {
    componentDidMount() {
        this.props.getEvents();
    }

    renderEvents() {
        const { events } = this.props;

        if (events.status !== SUCCESS) {
            return <Loader />;
        }

        return _.map(events.data, (event, i) => (
            <Card className="event-card" key={`event-${i}`}>
                <Card.Body>
                    <h5>{event.name}</h5>
                    <i>{moment(event.date).format('ddd, MMM D, YYYY')}</i>
                    <hr />
                    <p>{event.description}</p>
                    {this.renderEventLinkButton(event._id)}
                    {
                        event.tags.length > 0 &&
                        <Fragment>
                            <hr />
                            <div 
                                style={{ 
                                    margin: '0 0.5rem 0.5rem 0',
                                    textDecoration: 'underline',
                                    fontStyle: 'italic'
                                }}
                            >
                                Desired skills & interests
                            </div>
                            <div className="feed-tags">
                                {_.map(event.tags, (tag, tagIndex) => (
                                    <Badge 
                                        pill 
                                        className="tag" 
                                        variant="success"
                                        key={`${tag}-${tagIndex}`}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </Fragment>
                    }
                </Card.Body>
            </Card>
        ));
    }

    renderEventLinkButton(eventId) {
        return (
            <Link to={`/event/${eventId}`}>
                <Button variant="outline-success">
                    View
                </Button>
            </Link>
        );
    }

    render() {
        return (
            <div className="events-feed">
                {this.renderEvents()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    events: _.get(state, 'events', {})
});

const mapDispatchToProps = { 
    getEvents 
};

export default connect(mapStateToProps, mapDispatchToProps)(EventFeed);
