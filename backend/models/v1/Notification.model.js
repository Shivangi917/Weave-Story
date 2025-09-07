// deprecated
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

    story: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Story" 
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
