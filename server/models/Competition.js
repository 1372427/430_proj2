const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let CompetitionModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CompetitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  description: {
    type: String,
    required: true,
  },

  reward: {
    type: Number,
    required: true,
    minimum: 0,
  },

  deadline: {
    type: Date,
    required: true,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
  entries: {
    type: Number,
    default: 0,
  },
  winner: {
    type: mongoose.Schema.ObjectId,
    required: false,
    ref: 'Account',
  },
});

CompetitionSchema.statics.toAPI = (doc) => ({
  content: doc.content,
  contest: doc.contest,
});

CompetitionSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return CompetitionModel.find(search).select(
    'name owner description reward deadline createdDate entries winner').exec(callback);
};

CompetitionSchema.statics.findById = (id, callback) => {
  const search = {
    _id: convertId(id),
  };

  return CompetitionModel.find(search).select(
    'name owner description reward deadline createdDate entries winner').exec(callback);
};

CompetitionSchema.statics.findByDeadline = (date, callback) => {
  const search = {
    deadline: {
      $gte: date,
    },
    winner: null,
  };

  return CompetitionModel.find(search).select(
    'name owner description reward deadline createdDate entries winner').exec(callback);
};

CompetitionModel = mongoose.model('Contest', CompetitionSchema);

module.exports.ContestModel = CompetitionModel;
module.exports.ContestSchema = CompetitionSchema;
