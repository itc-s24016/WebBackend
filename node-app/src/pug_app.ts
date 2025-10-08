import http from "node:http"
import pug from 'pug'
import url from 'node:url'

// 最初で読み込んで置くことで、毎回読み込む必要がなくなる
const index_template = pug.compileFile('./pug_index.pug')
const other_template = pug.compileFile('./other.pug')

const server = http.createServer(getFromClient)
server.listen(3210)

async function getFromClient(req: http.IncomingMessage, res: http.ServerResponse) {
    // 第二引数に適当な URL を指定すると、req.url が undefined でもエラーにならない
    const url_parts = new url.URL(req.url || '', 'http://localhost:3210')

    switch (url_parts.pathname) {
        case '/':{
            const content = index_template({
                title: 'Index',
                content: 'これはテンプレートを使ったサンプルページです。'
            })
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(content)
            res.end()
            break
        }
        case '/other':{
            const content = other_template({
                title: 'Other',
                content: 'これは新しく用意したページです。'
            })
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(content)
            res.end()
            break
        }
        default:{
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.end('no page...')
            break
        }
    }
}