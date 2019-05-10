import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import get from 'lodash/get';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { SUCCESS } from '../../../state/statusTypes';
import { addOrganization } from '../../../state/actions/organizationActions';
import EditOrganization from '../../components/Forms/EditOrganization';

import './AddOrganization.scss';

class AddOrganization extends Component {
    submitOrganization = (values) => {
        this.props.addOrganization(values);
    }

    redirectToCreatedOrg = () => {
        const { selectedOrganization } = this.props;
        const organizationId = get(selectedOrganization, 'data._id', '');

        return <Redirect to={`/organization/${organizationId}`} />;
    };

    renderForm() {
        return (
            <Card>
                <Card.Body>
                    <EditOrganization onSubmit={this.submitOrganization} />
                </Card.Body>
            </Card>
        );
    }

    render() {
        const shouldRedirect = this.props.createOrganizationStatus === SUCCESS;

        if (shouldRedirect) {
            return this.redirectToCreatedOrg();
        }

        return (
            <div className="add-organization-page">
                <div className="add-organization-header">
                    <h2>Create Organization</h2>
                    <Link to="/explore#organizations">
                        <Button
                            type="button" 
                            variant="outline-success"
                        >
                            Back to Organizations
                        </Button>
                    </Link>
                </div>
                {this.renderForm()}          
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    organizations: get(state, 'organizations.data'),
    organizationStatus: get(state, 'organizations.status'),
    selectedOrganization: get(state, 'organizations.selectedOrg'),
    createOrganizationStatus: get(state, 'organizations.selectedOrg.status.create'),
    form: get(state, 'form.EditOrganization')
});

export default connect(mapStateToProps, { addOrganization })(AddOrganization);
