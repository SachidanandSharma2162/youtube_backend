const mongoose = require("mongoose");

const subscriberSchema =
  ({
    subscriber: {
      type: mongoose.Schema.Types.ObjectId, // one who is subscribing
      ref: "User",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId, // one who is subscribed
      ref: "User",
    },
  },
  {
    timestamps: true,
  });

module.exports = mongoose.model("Subscriber", subscriberSchema);
