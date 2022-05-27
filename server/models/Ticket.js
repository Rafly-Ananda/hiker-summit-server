const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const TicketSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  ticket_details: { type: String, required: true },
});
