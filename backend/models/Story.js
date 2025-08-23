const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, maxlength: 100 },
    story: { type: String, required: true, maxlength: 5000 },
    color: { type: String, default: "#ffffff" },
    appendedBy: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                name: { type: String, required: true, maxlength: 100 },
                story: { type: String, required: true, maxlength: 5000 }, 
                color: { type: String, default: "#f0f0f0" },
            }
        ]
    } , { timestamps: true });

module.exports = mongoose.model('Story', StorySchema);
