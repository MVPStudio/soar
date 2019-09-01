import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { object } from 'prop-types';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { getLoggedInUser } from '../redux/actions/user';

class UserProfile extends PureComponent {
    componentDidMount() {
        this.props.getLoggedInUser();
    }

    render() {
        const { user, isLoaded } = this.props;
        const { name, email } = user;

        if (!isLoaded) {
            return <div>Loading</div>
        }

        return (
            <Fragment>
                <CssBaseline />
                <Container maxWidth="sm">
                    <Typography component="div">
                        <div>{name}</div>
                        <div>{email}</div>
                    </Typography>
                </Container>
            </Fragment>
        )
    }
}

UserProfile.propTypes = {
    user: object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    isLoaded: state.user.status === 'SUCCESS'
})

export default connect(mapStateToProps, { getLoggedInUser })(UserProfile)