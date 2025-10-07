import http from "node:http"
import pug from 'pug'
import url from 'node:url'
import fs from 'node:fs/promises'

// 最初で読み込んで置くことで、毎回読み込む必要がなくなる
const index_template = pug.compileFile('./index.pug')
const style_css = await fs.readFile('./style.css', 'utf-8')

const server = http.createServer(getFromClient)
server.listen(3210)

async function getFromClient(req: http.IncomingMessage, res: http.ServerResponse) {
    // 第二引数に適当な URL を指定すると、req.url が undefined でもエラーにならない
    const url_parts = new url.URL(req.url || '', 'http://localhost:3210')

    switch (url_parts.pathname) {
        case '/':
            const content = index_template({
                title: 'Index',
                content: 'これはテンプレートを使ったサンプルページです。'
            })
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(content)
            res.end()
            break

        case '/style.css':
            res.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'})
            res.write(style_css)
            res.end()
            break

        default:
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.end('no page...')
            break
    }
}