import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Validators, { required } from 'redux-form-validators';
import { connect } from 'react-redux';
import _ from 'lodash';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { Input, TextArea, Select, SelectMultiple, List } from './utils/FormFields';
import { StatusSelect } from './utils/ValueSelects';
import { getOrganizations } from '../../../state/actions/organizationActions';
import { SUCCESS, ERROR } from '../../../state/statusTypes';

Object.assign(Validators.defaultOptions, {
    allowBlank: true
});

class EditProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: _.get(props, 'initialValues.tags', []),
            tagToAdd: ''
        };

        props.getOrganizations();
    }

    addTag = () => {
        const { tags, tagToAdd } = this.state;
        const shouldAddTag = tagToAdd.trim() !== '' && !tags.includes(tagToAdd);

        if (shouldAddTag) {
            const newTags = tags;
            newTags.push(tagToAdd);
    
            this.setState({ 
                tags: newTags,
                tagToAdd: ''
            });
        }
    }

    removeTag = tagToDelete => {
        const { tags } = this.state;
        const newTags = tags.filter(tag => tag !== tagToDelete);

        this.setState({ tags: newTags });
    }

    submitWithTags = (values, dispatch, props) => {
        const valuesWithTags = { ...values, tags: this.state.tags };
        props.onSubmit(valuesWithTags);
    }

    showError() {
        const { updateProjectStatus, createProjectStatus, selectedProject } = this.props;

        if (updateProjectStatus === ERROR || createProjectStatus === ERROR) {
            const errorMessage = _.get(selectedProject, 'error.res.data.message', '');

            return (
                <p className="mt-3 mb-0 text-danger">
                    {errorMessage}
                </p>
            );
        }
    }

    render() {
        if (this.props.organizationStatus !== SUCCESS) return <div>Loading...</div>;

        return (
            <Form onSubmit={this.props.handleSubmit(this.submitWithTags)}>
                <Tabs>
                    <Tab title="The Basics" eventKey="basicInfo">
                        <Field
                            label="Name*"
                            name="name"
                            component={Input}
                            type="text"
                            validate={required()}
                        />
                        <Form.Row>
                            <Col>
                                <Field
                                    label="Status*"
                                    name="status"
                                    component={Select}
                                    validate={required()}
                                >
                                    <option>Choose...</option>
                                    <StatusSelect />
                                </Field>
                            </Col>
                            <Col>
                                <Field
                                    label="Expected completion date"
                                    name="completedAtExpected"
                                    component={Input}
                                    type="date"
                                />
                            </Col>
                        </Form.Row>
                        <Field
                            label="Lead Organization*"
                            name="organizationId"
                            component={Select}
                            validate={required()}
                        >
                            <option>Choose...</option>
                            {_.map(this.props.organizations, org => (
                                <option value={org._id} key={org._id}>{org.name}</option>
                            ))}
                        </Field>
                        <Field
                            label="Alliance"
                            name="alliance"
                            component={SelectMultiple}
                        >
                            <option>Choose multiple...</option>
                            {_.map(this.props.organizations, org => (
                                <option value={org._id} key={`${org._id}-alliance`}>{org.name}</option>
                            ))}
                        </Field>
                    </Tab>
                    <Tab title="About the Project" eventKey="aboutProject">
                        <Field
                            label="Description"
                            name="description"
                            component={TextArea}
                            rows={3}
                        />
                        <Field
                            label="Desired skills & interests"
                            name="tags"
                            component={List}
                            type="text"
                            list={this.state.tags}
                            itemToAdd={this.state.tagToAdd}
                            addItem={this.addTag}
                            removeItem={this.removeTag}
                            onChangeItem={(e) => this.setState({ tagToAdd: e.target.value })}
                        />
                    </Tab>
                </Tabs>
                <div className="submit-row">
                    <Button type="submit">Submit</Button>
                    <small>* Required</small>
                </div>
                {this.showError()}
            </Form>
        );
    }
}

const mapStateToProps = state => ({
    organizations: _.get(state, 'organizations.data'),
    organizationStatus: _.get(state, 'organizations.status'),
    selectedProject: _.get(state, 'projects.selectedProject'),
    createProjectStatus: _.get(state, 'projects.selectedProject.status.create'),
    updateProjectStatus: _.get(state, 'projects.selectedProject.status.update')
});

// eslint-disable-next-line no-class-assign
EditProject = connect(mapStateToProps, { getOrganizations })(EditProject);

export default reduxForm({
    form: 'EditProject',
    enableReinitialize: true
})(EditProject);
