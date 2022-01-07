const { Schema, isValidObjectId } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const schemaReaction = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
       default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

module.exports = schemaReaction;