const { Schema, model, Types } = require('mongoose');
const formattedDate = require('../utils/helpers');

const ReactionSchema = new Schema(
  {
    reactionId: {
      // Mongoose's ObjectId data type
      type: Schema.Types.ObjectId,
      // Default value is set to a new ObjectId
      default: () => new Types.ObjectId(),
    },

    reactionBody: {
      type: { String, required: true },
      maxlength: 280,
    },

    username: {
      type: { String, required: true },
    },

    createdAt: {
      type: Date,
      // Set default value to the current timestamp
      default: Date.now,
      // Use a getter method to format the timestamp on query
      get: (timestamp) => formattedDate(timestamp),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  },
);

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: { String, required: true },
      minlength: 1,
      maxlength: 280,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      // Use a getter method to format the timestamp on query
      get: (timestamp) => formattedDate(timestamp),
    },

    username: {
      type: String,
      required: true,
    },

    // array of nested documents created with the reactionSchema
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  },
);

// Create a virtual called `reactionCount` that retrieves the length of the thought's `reactions` array field on query.
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
