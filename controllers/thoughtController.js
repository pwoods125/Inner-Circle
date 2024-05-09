const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .populate('reactions');

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought located with that Id' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const userData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true },
      );

      if (!userData) {
        return res
          .status(404)
          .json({ message: 'No user located with that Id' });
      }
      res.json('Successfully created thought 🎉');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true },
      );

      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought located with that Id' });
      }
      res.json(thoughtData);
    } catch (err) {
      console.log('in the err');
      res.status(500).json(err);
    }
  },

  // Delete a thought
  async removeThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought located with that Id' });
      }

      const userData = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true },
      );

      if (!userData) {
        return res
          .status(404)
          .json({ message: 'No user located with that Id' });
      }
      res.json({ message: 'No thought located with that Id' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a reaction
  async addReaction(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true },
      );

      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought located with that Id' });
      }
      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a reaction
  async removeReaction(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true },
      );

      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought located with that Id' });
      }
      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
