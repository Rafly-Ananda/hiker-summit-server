const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const TicketSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  destination_id: { type: String, required: true },
  subject: { type: String, required: true },
  details: { type: String, required: true },
});
