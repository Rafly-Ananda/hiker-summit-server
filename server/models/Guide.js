const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// TODO: Apakah track route yg unik atau destination id yang unik
const GuideSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    destination_id: { type: String, required: true },
    hiking_experience: { type: Number, required: true },
    track_route: { type: String, required: true },
    allowed_hiker_count: { type: Number, required: true },
    about_me: { type: String },
    transaction_history: { type: String }, // ? this will be the booking id
    ongoing_transaction: { typ: String }, // ? this will be the booking id
    status: {
      type: String,
      enum: ["active", "unactive"],
      default: "unactive",
      required: true,
    },
    suspended: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
GuideSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Guide_Agent", GuideSchema);
