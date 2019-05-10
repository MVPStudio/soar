import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Loader from '../../components/Loader';

import { getProjects } from '../../../state/actions/projectActions';
import { SUCCESS } from '../../../state/statusTypes';

class ProjectFeed extends Component {
    componentDidMount() {
        this.props.getProjects();
    }

    renderProjects() {
        const { projects } = this.props;

        if (projects.status !== SUCCESS) {
            return <Loader />;
        }

        return _.map(projects.data, (project, i) => (
            <Card className="project-card" key={`project-${i}`}>
                <Card.Body>
                    <h5>{project.name}</h5>
                    <i>Project led by&nbsp;</i>
                    <Link 
                        to={`/organization/${project.organization._id}`} 
                        style={{ textDecoration: 'underline', fontStyle: 'italic' }}
                    >
                        {project.organization.name}
                    </Link>
                    <hr />
                    <p>{project.description}</p>
                    {this.renderProjectLinkButton(project._id)}
                    {
                        project.tags.length > 0 &&
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
                                {_.map(project.tags, (tag, tagIndex) => (
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

    renderProjectLinkButton(projectId) {
        return (
            <Link to={`/project/${projectId}`}>
                <Button variant="outline-success">
                    View
                </Button>
            </Link>
        );
    }

    render() {
        return (
            <div className="projects-feed">
                {this.renderProjects()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    projects: _.get(state, 'projects', {})
});

const mapDispatchToProps = { 
    getProjects 
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectFeed);
