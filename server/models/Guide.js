const mongoose = require("mongoose");

const GuideSchema = new mongoose.Schema(
  {
    hiking_experience: { type: Number, required: true },
    destination_id: { type: String, required: true },
    track_route: { type: Array, required: true },
    allowed_hiker_count: { type: Number, required: true },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guide_Proposal", GuideSchema);
