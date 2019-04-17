import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import Validators, { required, email, length, numericality, url, format } from 'redux-form-validators';
import { connect } from 'react-redux';
import _ from 'lodash';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { Input, TextArea, List, Select } from './utils/FormFields';
import { normalizePhone } from './utils/FormHelpers';
import { ReferralSelect } from './utils/ValueSelects';
import { ERROR } from '../../../state/statusTypes';

Object.assign(Validators.defaultOptions, {
    allowBlank: true
});

class EditUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: _.get(props, 'initialValues.tags', []),
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
            const errorMessage = _.get(selectedOrg, 'error.response.data.message', '');

            return (
                <p className="mt-3 mb-0 text-danger">
                    {errorMessage}
                </p>
            );
        }
    }

    render() {
        const { newUser, existingUser } = this.props;

        return (
            <Form onSubmit={this.props.handleSubmit(this.submitWithTags)}>
                { newUser &&
                    <Fragment>
                        <Field
                            label="Full Name"
                            name="name"
                            component={Input}
                            type="text"
                            validate={required()}
                        />
                        <Field
                            label="Email"
                            name="email"
                            component={Input}
                            type="text"
                            validate={[required(), email()]}
                        />
                        <Field
                            label="Password"
                            name="password"
                            component={Input}
                            type="password"
                            validate={[required(), length({ min: 6 })]}
                        />
                        <Field
                            label="Referral source (optional)"
                            name="referralSource"
                            component={Select}
                        >
                            <option>Choose...</option>
                            <ReferralSelect />
                        </Field>
                    </Fragment>
                }
                { existingUser &&
                    <Tabs>
                        <Tab title="The Basics" eventKey="basicInfo">
                            <Field
                                label="Full Name"
                                name="name"
                                component={Input}
                                type="text"
                                validate={required()}
                            />
                            <Field
                                label="Email"
                                name="email"
                                component={Input}
                                type="text"
                                validate={[required(), email()]}
                            />
                            <Form.Row>
                                <Col>
                                    <Field
                                        label="Phone Number"
                                        name="phoneNumber"
                                        component={Input}
                                        type="text"
                                        validate={format({ with: /^[2-9]\d{2}-\d{3}-\d{4}$/, message: 'is not valid' })}
                                        normalize={normalizePhone}
                                    />
                                </Col>
                                <Col>
                                    <Field
                                        label="Zip code"
                                        name="zipCode"
                                        component={Input}
                                        type="number"
                                        validate={[numericality(), length({ is: 5 })]}
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
                            <Field
                                label="Referral source"
                                name="referralSource"
                                component={Select}
                            >
                                <option>Choose...</option>
                                <ReferralSelect />
                            </Field>
                        </Tab>
                        <Tab title="About Me" eventKey="aboutUser">
                            <Field
                                label="My story"
                                name="description"
                                component={TextArea}
                                rows={3}
                            />
                            <Field
                                label="My skills & interests"
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
                }
                <div className="submit-row">
                    <Button type="submit">Submit</Button>
                    {/* <small>* Required</small> */}
                </div>
                {/* {this.showError()} */}
            </Form>
        );
    }
}

const mapStateToProps = state => ({
    user: _.get(state, 'user.data', {})
});

// eslint-disable-next-line no-class-assign
EditUser = connect(mapStateToProps)(EditUser);

export default reduxForm({
    form: 'EditUser',
    enableReinitialize: true
})(EditUser);
