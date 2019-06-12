const routes = require('../config/routes');
const { getAll, getByID, createTag, deleteTag } = require('../services/tagService');

module.exports = (app) => {
    app.get(routes.GET_TAGS, (_, res, next) => {
        getAll().then(tags => res.send(tags),
            next
        );
    });

    app.get(routes.GET_TAG_BY_ID, (req, res, next) => {
        getByID(req.params.tag_id).then(
            tag => res.send(tag),
            next
        );
    });

    app.post(routes.POST_TAG, (req, res, next) => {
        createTag(req.body)
            .then(
                () => res.status(201).end(),
                next
            );
    });

    app.delete(routes.DELETE_TAG_BY_ID, (req, res, next) => {
        deleteTag(req.params.tag_id).then(
            tag => res.send(tag),
            next
        );
    });
};
