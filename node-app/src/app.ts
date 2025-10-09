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
    msg: 'no message...'
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
    if (req.method === 'POST') {
        const post_data = await parse_body(req)
        data.msg = post_data.msg as string

        // クッキー表示の機能
        setCookie('msg', data.msg, res)

        /*
        POSTで送信して(302)
        テキスト表示のためにGETしてほしいので(200)
        Location ヘッダーのパスにリダイレクト（転送）させる作業を自動化する
        */
        res.writeHead(302, 'Found', {'Location': '/'})
        res.end()

    } else {
        write_index(req, res)
    }
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

function parse_body(req: http.IncomingMessage): Promise<qs.ParsedUrlQuery> {
    return new Promise((resolve, reject) => {
        let body = ''
        req.on('data', (chunk) => {
            body += chunk
        })
        req.on('end', () => {
            resolve(qs.parse(body))
        })
    })
}

function write_index(req: http.IncomingMessage, res: http.ServerResponse) {
    // 全てのクッキーを取得
    const cookie_data = getCookie(req)
    const content = index_template({
        title: 'Index',
        content: '※伝言を表示します。',
        data,
        cookie_data,
    })
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'})
    res.write(content)
    res.end()
}
// クッキーをエンコードして保存する関数
function setCookie(key: string, value: string, res: http.ServerResponse) {
    /*
    [key]の意味は、変数keyの中身をプロパティ名にする　例（key = 'msg' のとき、{msg: value}）
    qs.stringify() は {msg: value} というオブジェクトをエンコードする
    */
    const encoded_cookie = qs.stringify({[key]: value})
    res.setHeader('Set-Cookie', [encoded_cookie])
}

// クッキーを取得してオブジェクトに変換する関数
function getCookie(req: http.IncomingMessage) {
    // クッキーがない場合、undefined になるので空文字にする
    const cookie_data = req.headers.cookie != undefined
        ? req.headers.cookie : ''
    /*
    複数のクッキーを';'区切りの配列にして、空白を削除しながらデコードする (フレームワークを使用したら、もっと簡単にできる)
    理由）クッキーは複数保存でき、';'で区切られている
    　　　{key: value}, {key2: value2}...
    それを .reduce() でオブジェクトに変換して扱いやすくする
         {key: value; key2: value2; ...}
    */
    const data = cookie_data.split(';')
        .map(raw_cookie => qs.parse(raw_cookie.trim()))
        .reduce((acc, cookie) => ({...acc, ...cookie}))
    return data
}