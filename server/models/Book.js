const mongoose = require("mongoose");

const DestinationBookingSchema = new mongoose.Schema( // ? tambah proof of payment
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
    hiker_count: { type: Number, required: true }, //? min 1 max 5
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

module.exports = mongoose.model(
  "Destination_Booking",
  DestinationBookingSchema
);
