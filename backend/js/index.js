import app from "./app.js";
import http from 'http'



const PORT = process.env.PORT || 3000


http.createServer(app)

http.listen(PORT)
