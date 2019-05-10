import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Validators, { required, email, length, numericality, url, format } from 'redux-form-validators';
import { connect } from 'react-redux';
import get from 'lodash/get';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { Input, TextArea, Select, List } from './utils/FormFields';
import { normalizePhone } from './utils/FormHelpers';
import { StateSelect, CategorySelect } from './utils/ValueSelects';
import { ERROR } from '../../../state/statusTypes';

Object.assign(Validators.defaultOptions, {
    allowBlank: true
});

class EditOrganization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: get(props, 'initialValues.tags', []),
            tagToAdd: ''
        };
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
        const { updateOrgStatus, createOrgStatus, selectedOrg } = this.props;

        if (updateOrgStatus === ERROR || createOrgStatus === ERROR) {
            const errorMessage = get(selectedOrg, 'error.response.data.message', '');

            return (
                <p className="mt-3 mb-0 text-danger">
                    {errorMessage}
                </p>
            );
        }
    }

    render() {
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
                        <Field
                            label="Category*"
                            name="category"
                            component={Select}
                            validate={required()}
                        >
                            <option value="">Choose...</option>
                            <CategorySelect />
                        </Field>
                    </Tab>
                    <Tab title="Contact Info" eventKey="contactInfo">
                        <div className="related-fields-container">
                            <Form.Row>
                                <Col>
                                    <Field
                                        label="Email"
                                        name="contactInformation.email"
                                        component={Input}
                                        type="text"
                                        validate={email()}
                                    />
                                </Col>
                                <Col>
                                    <Field
                                        label="Phone Number"
                                        name="contactInformation.phoneNumber"
                                        component={Input}
                                        type="text"
                                        validate={format({ with: /^[2-9]\d{2}-\d{3}-\d{4}$/, message: 'is not valid' })}
                                        normalize={normalizePhone}
                                    />
                                </Col>
                            </Form.Row>
                            <Field
                                label="Website"
                                name="website"
                                component={Input}
                                type="text"
                                validate={url()}
                            />
                        </div>
                        <div className="related-fields-container">
                            <Field
                                label="Street Address"
                                name="address.street"
                                component={Input}
                                type="text"
                            />
                            <Form.Row>
                                <Col>
                                    <Field
                                        label="City"
                                        name="address.city"
                                        component={Input}
                                        type="text"
                                    />
                                </Col>
                                <Col>
                                    <Field
                                        label="State"
                                        name="address.state"
                                        component={Select}
                                    >
                                        <option>Choose...</option>
                                        <StateSelect />
                                    </Field>
                                </Col>
                                <Col>
                                    <Field
                                        label="Zip code"
                                        name="address.zipcode"
                                        component={Input}
                                        type="number"
                                        validate={[numericality(), length({ is: 5 })]}
                                    />
                                </Col>
                            </Form.Row>
                        </div>
                    </Tab>
                    <Tab title="About Us" eventKey="aboutOrganization">
                        <Field
                            label="Mission statement"
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
    organizations: get(state, 'organizations.data'),
    organizationStatus: get(state, 'organizations.status'),
    selectedOrg: get(state, 'organizations.selectedOrg'),
    createOrgStatus: get(state, 'organizations.selectedOrg.status.create'),
    updateOrgStatus: get(state, 'organizations.selectedOrg.status.update')
});

// eslint-disable-next-line no-class-assign
EditOrganization = connect(mapStateToProps)(EditOrganization);

export default reduxForm({
    form: 'EditOrganization',
    enableReinitialize: true
})(EditOrganization);
