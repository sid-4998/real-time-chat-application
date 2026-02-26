const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    content: {
        type: String
    },

    ImageOrVideoURL: {
        type: String
    },

    contentType: {
        type: String,
        enum: ['Image', 'Video', 'Text']
    },

    reactions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        emoji: {
            type: String
        }
    }],
    
    messageStatus: {
        type: String,
        default: 'sent'
    }
}, {timestamps: true});

messageSchema.index({ chat: 1, createdAt: -1 }); // Pagination
messageSchema.index({ sender: 1 }); // sender lookup
messageSchema.index({ receiver: 1 }); // receiver lookup

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;