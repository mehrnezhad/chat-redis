import express from "express"
import http from "http"
import configSocket from "./config/socket.confing.js";
import router from "./routes/app.routes.js";
import redisClient from "./config/redis.confing.js";
const main = async () => {
    const app = express()
    const server = http.createServer(app);
    const io = configSocket(server)
    const multi = redisClient.multi()

    async function getList(socket) {

        const data = await redisClient.sendCommand(['LRANGE', 'messages','0','-1']); // ['key1', 'field1', 'key2', 'field2']
        data.forEach(item=>{
            const [username, message] = item.split(":")
            
            socket.emit("SentMessage", {
                username,
                message
            })
        })

    }

    
    io.on("connection", async socket => {

        getList(socket)
        socket.on("message", async (data) => {
            const { username, message } = data

            try {

                multi.rPush("messages", `${username}:${message}`).exec()

            } catch (error) {
                console.error("Error pushing message to Redis:", error);
            }

            io.emit("SentMessage", {
                username,
                message
            })


        })
    })
    app.use(router)
    app.set("view engine", "ejs")
    server.listen("3001", () => {
        console.log('create server successfully...')
    })
}

main()


