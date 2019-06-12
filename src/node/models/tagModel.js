const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.set('runValidators', true);

const TagsSchema = new Schema({
  name: {
    type: String
  },
  type: {
    type: String
  }
});

module.exports = mongoose.model('TagModel', TagsSchema);
