const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  comment: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
});

const AppendedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, maxlength: 100 },
  story: { type: String, required: true, maxlength: 5000 }, 
  color: { type: String, default: "#f0f0f0" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema]
});

const StorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, maxlength: 100 },
  story: { type: String, required: true, maxlength: 5000 },
  color: { type: String, default: "#ffffff" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
  appendedBy: [AppendedSchema]
}, { timestamps: true });

module.exports = mongoose.model('Story', StorySchema);
