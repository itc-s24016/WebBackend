import http from "node:http"

//サーバーの作成
const server = http.createServer(
    (request, response) => {
        //ヘッダー情報の設定
        response.setHeader('Content-Type', 'text/html')
        //レスポンスボディの設定(今回はHTMLを返す)
        response.write('<!DOCTYPE html>')
        response.write('<html lang="ja">')
        response.write('<head><meta charset="UTF-8">')
        response.write('<title>Hello</title></head>')
        response.write('<body><h1>Hello Node.js!</h1>')
        response.write('<p>This is Node.js sample page.</p>')
        response.write('<p>これは、Node.jsのサンプルページです。</p>', 'utf-8')
        response.write('</body></html>')
        //レスポンスを終了する
        response.end()
        //Method
    }
)
//ポート3000でサーバーを起動
server.listen(3000)

/*
const server        ：関数
request, response   ：引数
http.createServer()：サーバーの作成
response.setHeader()：ヘッダー情報の設定
response.write()    :レスポンスボディの設定
response.end()      ：レスポンスを終了する
server.listen(3000) ：ポート3000でサーバーを起動
*/