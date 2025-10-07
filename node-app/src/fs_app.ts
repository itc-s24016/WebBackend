import http from "node:http"
import fs from "node:fs"
import * as console from "node:console";

const server = http.createServer(
    (request, response) => {

        console.log('before readFile')
        fs.readFile('./home.html', 'utf-8', (error, data) => {
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            response.write(data)
            response.end()
            console.log('response end')
        })
        console.log('after readFile')
    }
)

server.listen(3210)
console.log('readFile start!')