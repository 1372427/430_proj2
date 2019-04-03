const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let EntryModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const EntrySchema = new mongoose.Schema({

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  content: {
    type: String,
    required: true,
  },
  
  contest: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Competition',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

EntrySchema.statics.toAPI = (doc) => ({
  content: doc.content,
  contest: doc.contest,
});

EntrySchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return EntryModel.find(search).select('owner content contest createdDate').exec(callback);
};

EntrySchema.statics.findByContest = (contestId, callback) => {
  const search = {
    contest: contestId,
  };

  return EntryModel.find(search).select('owner content contest createdDate').exec(callback);
};

EntryModel = mongoose.model('Entry', EntrySchema);

module.exports.EntryModel = EntryModel;
module.exports.EntrySchema = EntrySchema;
