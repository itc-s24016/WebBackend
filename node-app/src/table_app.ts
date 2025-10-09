import http from 'node:http'
import path from 'node:path'
import qs from 'node:querystring'
import url from 'node:url'
import pug from 'pug'

const index_template = pug.compileFile(path.join(import.meta.dirname, 'index.pug'))
const other_template = pug.compileFile(path.join(import.meta.dirname, 'other.pug'))

const server = http.createServer(getFromClient)
server.listen(3210)

const data = {
    'Taro': '090-999-999',
    'Hanako': '080-888-888',
    'Sachiko': '070-777-777',
    'Ichiro': '060-666-666'
}

async function getFromClient(req: http.IncomingMessage, res: http.ServerResponse) {
    const url_parts = new url.URL(req.url || '', 'http://localhost:3210')

    switch (url_parts.pathname) {
        case '/':
            await response_index(req, res)
            break
        case '/other':
            await response_other(req, res)
            break
        default: {
            res.writeHead(404, {'Content-Type': 'text/plain; charset=UTF-8'})
            res.end('page not found')
            break
        }
    }
}

async function response_index(req: http.IncomingMessage, res: http.ServerResponse) {
    let msg = 'これは Index ページです。'
    const content = index_template({
        title: 'Index',
        content: msg,
        data,
    })
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'})
    res.write(content)
    res.end()
}

async function response_other(req: http.IncomingMessage, res: http.ServerResponse) {
    let msg = 'これは Other ページです。'

    if (req.method === 'POST') {
        const post_data = await (new Promise<qs.ParsedUrlQuery>((resolve, reject) => {
            let body = ''
            req.on('data', (chunk) => {
                body += chunk
            })
            req.on('end', () => {
                try {
                    resolve(qs.parse(body))
                } catch (e) {
                    console.error(e)
                    reject(e)
                }
            })
        }))
        msg += `あなたは「${post_data.msg}」と書きました。`
        const content = other_template({
            title: 'Other',
            content: msg,
        })
        res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'})
        res.write(content)
        res.end()
    } else {
        // POST 以外のアクセス
        const content = other_template({
            title: 'Other',
            content: 'ページがありません。',
        })
        res.writeHead(404, {'Content-Type': 'text/html; charset=UTF-8'})
        res.write(content)
        res.end()
    }
}