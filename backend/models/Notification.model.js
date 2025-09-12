const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    actor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    content: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Content" 
    },

    appendedContent: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "AppendedContent" 
    },

    type: { 
      type: String, 
      enum: ["like", "comment", "append", "lock"], 
      required: true 
    },

    message: { 
      type: String 
    },

    seen: { 
      type: Boolean, 
      default: false 
    } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
