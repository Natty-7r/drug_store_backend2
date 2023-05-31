let sockteGlobal = undefined;
let ioGlobal = undefined;
exports.socketConnection = (socket, io) => {
  if (sockteGlobal) return { socket: sockteGlobal, io: io ?? ioGlobal };
  if (socket) sockteGlobal = socket;
  if (io) ioGlobal = io;
  return { io, socket };
};
