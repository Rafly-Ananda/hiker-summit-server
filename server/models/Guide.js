const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// ? Apakah track route yg pengen unik atau destination id yang unik
const GuideSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    destination_id: { type: String, required: true },
    hiking_experience: { type: Number, required: true },
    track_route: { type: String, required: true },
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
GuideSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Guide_Agent", GuideSchema);
