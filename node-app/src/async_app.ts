import http from "node:http"
import fs from "node:fs/promises"
// async/await構文を使うため、Promiseベースのfsモジュールをインポート

const server = http.createServer(getFromClient)

server.listen(3210)
console.log('readFile start!')

//ーーーーーーーーーーー ↑ ここまでがメインプログラム ↑ ーーーーーーーーーーーーー

async function getFromClient(req: http.IncomingMessage, res: http.ServerResponse) {
    const data = await fs.readFile('./home.html', 'utf-8')
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    res.write(data)
    res.end()
}