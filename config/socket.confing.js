import { Server } from "socket.io";

const configSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*"
          }
    })
    return io
}

export default configSocket