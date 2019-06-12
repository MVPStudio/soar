const { getAll, getByID, getMultipleByID, createWithUser, deleteOrganization } = require('../services/organizationService');
const routes = require('../config/routes');
const { authenticate } = require('../middleware/ecan-passport-strategy');

const sendPromise = (req, res, promise) => {
    promise
        .then(data => res.status(200).send(data))
        .catch(err => res.status(err.status || 500).send(err));
};

module.exports = (app) => {
    app.get(routes.GET_ORGANIZATIONS, getAll);

    app.get(routes.GET_ORGANIZATION_BY_ID, authenticate, getByID);

    app.get(routes.GET_ORGANIZATIONS_BY_ID, authenticate, getMultipleByID);

    app.post(routes.POST_ORGANIZATION, (req, res, next) => {
        createWithUser(req.body)
            .then(
                () => res.status(201).end(),
                err => console.error(err) || res.status(500).send(err)
            );
    });

    //app.post(routes.UPDATE_ORGANIZATION, authenticate, createOrUpdate);

    app.delete(
        routes.DELETE_ORGANIZATION,
        authenticate,
        (req, res) => sendPromise(req, res, deleteOrganization(req.params.organization_id))
    );
};
