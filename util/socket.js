let sockteGlobal = undefined;
let ioGlobal = undefined;
const prescriptionSearch =
  require("../controllers/customer").prescriptionSearch;

exports.socketConnection = (socket, io) => {
  if (sockteGlobal) return { socket: sockteGlobal, io: io ?? ioGlobal };
  if (socket) sockteGlobal = socket;
  if (io) ioGlobal = io;
  socket.on("prescription", (prescriptionImage) => {
    prescriptionSearch(socket, prescriptionImage);
  });
  return { io, socket };
};
