import http from "node:http"
import pug from 'pug'

// pugで記述したものをHTMLに変換して表示する

const server = http.createServer(getFromClient)

server.listen(3210)

async function getFromClient(req: http.IncomingMessage, res: http.ServerResponse) {
    const content = pug.renderFile('./index.pug', {
        title: 'Index',
        content: 'これはPugを使ったWebページです。'
    })
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    res.write(content)
    res.end()
}