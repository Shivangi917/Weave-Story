const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  comment: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

const AppendedContentSchema = new mongoose.Schema({
  parentContent: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
  parentAppend: { type: mongoose.Schema.Types.ObjectId, ref: 'AppendedContent' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 5000 },
  color: { type: String, default: "#f0f0f0" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
  locked: { type: Boolean, default: false },
}, { timestamps: true });

AppendedContentSchema.pre('validate', function(next) {
  if (!this.parentContent && !this.parentAppend) {
    return next(new Error("AppendedContent must have either a parentContent or parentAppend."));
  }
  if (this.parentContent && this.parentAppend) {
    return next(new Error("AppendedContent cannot have both parentContent and parentAppend."));
  }
  next();
});

const ContentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 5000 },
  color: { type: String, default: "#ffffff" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  genres: { type: [String], validate: v => v.length > 0 },
  comments: [CommentSchema],
}, { timestamps: true });

const Content = mongoose.model('Content', ContentSchema);
const AppendedContent = mongoose.model('AppendedContent', AppendedContentSchema);

module.exports = { Content, AppendedContent };
