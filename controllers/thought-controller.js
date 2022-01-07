const { User, Thought, Reaction } = require('../models');

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({})
        .populate({ 
            path: 'reactions', 
            select: '-__v' 
        })
        .select('-__v')
        .then(data => res.json(data))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'reactions', 
            select: '-__v' 
        })
        .select('-__v')
        .then(data => res.json(data))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },


    createThought({ body }, res) {
        Thought.create(body)
        .then(data => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: data._id } },
                { new: true }
            );
        })
        .then(data => {
            if (!data) {
                res.status(404).json({ message: 'No user with this id' });
                return;
            }
            res.json(data);
        })
        .catch(err => res.json(err));
        
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true }
        )
        .then(data => {
            if (!data) {
                res.status(404).json({ message: 'No thought with this id' });
                return;
            }
            res.json(data);
        })
        .catch(err => res.json(err));
    },


    deleteThought({ params }, res) {
    
        Thought.findOneAndDelete({ _id: params.id })
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'No thought with this id'});
            }
            return User.findOneAndUpdate(
                { username: data.username },
                { $pull: { thoughts: params.id } },
                {new: true}
            );
        })
        .then(data => {
            if (!data) {
              res.status(404).json({ message: 'No user with this id!' });
              return;
            }
            res.json(data);
        })
        .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(data => {
            if (!data) {
                res.status(404).json({ message: 'No thought with this id' });
                return;
            }
            res.json(data);
        })
        .catch(err => res.json(err));
    },

    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(DataTransferItem => {
            if (!data) {
                res.status(404).json({ message: 'No thought with this id' });
                return;
            }
            res.json(data);
        })
        .catch(err => res.json(err));
    },
}

module.exports = thoughtController;