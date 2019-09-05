const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const SubjectSchema = new Schema({}, { timestamps: true });

const Subject = mongoose.model('subjects', SubjectSchema);

module.exports = Subject;