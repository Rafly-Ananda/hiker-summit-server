const Tickets = require("../models/Ticket");

const createTicket = async (req, res) => {
  // ? notion commit test
  let tst = 'xoxo'
  const newTicket = new Tickets(req.body);
  newTicket.user_id = req.params.id;

  try {
    const savedTicket = await newTicket.save();

    res.status(200).json({
      succes: true,
      message: "Ticket Created.",
      result: savedTicket,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

const getAllTicket = async (req, res) => {
  const paginationOptions = {
    page: parseInt(req.query.page || 0),
  };

  req.query.page_size
    ? (paginationOptions.limit = +req.query.page_size)
    : (paginationOptions.pagination = false);
  req.query.newest ? (paginationOptions.sort = { createdAt: -1 }) : "";

  try {
    const result = await Tickets.paginate({}, paginationOptions);
    res.status(200).json({
      succes: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

const getSingleTicket = async (req, res) => {
  try {
    const ticket = await Tickets.findById(req.params.ticket_id);
    res.status(200).json({
      succes: true,
      result: ticket,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    await Tickets.findByIdAndDelete(req.params.ticket_id);

    res.status(200).json({
      succes: true,
      message: `Ticket Deleted`,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  createTicket,
  getAllTicket,
  getSingleTicket,
  deleteTicket,
};
