const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    participants: { // Lookout for errors
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }],
        validate: {
          validator: function(v) {
            return v.length >= 2;
          },
          message: 'A chat must have at least 2 participants.'
        }
    },

    lastMessage: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },

    unreadCounts: [{ // Lookout for errors
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        count: {
          type: Number,
          default: 0
        }
    }]

}, {timestamps: true});

ChatSchema.index({ participants: 1 });

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;