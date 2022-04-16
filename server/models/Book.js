const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const DestinationBookingSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    destination_id: { type: String, required: true },
    track_route: { type: Array, required: true },
    date: [
      {
        departure: { type: String, required: true },
        arrival: { type: String, required: true },
      },
    ],
    hiker_count: { type: Number, min: 1, max: 5, required: true },
    proof_of_payment: {
      bucket: { type: String },
      assets_key: { type: String },
    },
    note: { type: String },
    paid_status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

DestinationBookingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(
  "Destination_Booking",
  DestinationBookingSchema
);
