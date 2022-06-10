const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const TicketSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    destination_id: { type: String },
    subject: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

TicketSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Tickets", TicketSchema);
