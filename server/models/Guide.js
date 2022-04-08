const mongoose = require("mongoose");

// ? Apakah track route yg pengen unik atau destination id yang unik
const GuideSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    destination_id: { type: String, required: true },
    hiking_experience: { type: Number, required: true },
    track_route: { type: Array, required: true },
    allowed_hiker_count: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "unactive"],
      default: "unactive",
      required: true,
    },
    about_me: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guide_Agent", GuideSchema);

// satu user bisa menjadi guide, tapi user hanya bisa nge guide satu destinasi masksimal 1 rute jadi gabisa misal di rute rinjani ada list guide itu 3 kali berturut" patokan ke rute aja
