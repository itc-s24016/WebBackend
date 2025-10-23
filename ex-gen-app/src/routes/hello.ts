import { Router } from 'express'
import mariadb from 'mariadb'

const router = Router()
const db = await mariadb.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'example',
    database: 'mydb',
})

interface MyData {
    id: number
    name: string
    mail: string
    age: number
}

// 全件表示
router.get('/', async (req, res, next) => {
    const result = await db.query<MyData>('SELECT * FROM mydata')
    res.render('hello/index', {
        title: 'Hello!',
        content: result
    })
})

// データを追加する
router.get('/add', async(req, res, next) => {
    res.render('hello/add', {
        title: 'Hello/Add',
        content: '新しいレコードを入力'
    })
})

router.post('/add', async(req, res, next) => {
    const {name, mail, age} = req.body
    await db.query('INSERT INTO mydata (name, mail, age) VALUES (?, ?, ?)', [
        name, mail, age
    ])
    // 追加したら一覧に戻る
    res.redirect('/hello')
})

// 指定したIDのデータを表示
router.get('/show', async(req, res, next) => {
    const id = Number(req.query.id)
    const result: MyData[] = await db.query(
        'SELECT * FROM mydata WHERE id = ?', [id]
    )
    res.render('hello/show', {
        title: 'Hello/show',
        content: `id = ${id} のレコード`,
        mydata: result[0]
    })
})

// 指定したIDのデータを編集する
router.get('/edit', async(req, res, next) => {
    const id = Number(req.query.id)
    const result: MyData[] = await db.query(
        'SELECT * FROM mydata WHERE id = ?', [id]
    )
    res.render('hello/edit', {
        title: 'Hello/edit',
        content: `id = ${id} のレコードを編集`,
        mydata: result[0]
    })
})

router.post('/edit', async(req, res, next) => {
    const {id, name, mail, age} = req.body
    await db.query(
        'UPDATE mydata SET name = ?, mail = ?, age = ? WHERE id = ?', [
            name, mail, age, id
        ])
    // 編集したら一覧に戻る
    res.redirect('/hello')
})

router.get('/delete', async(req, res, next) => {
    const id = Number(req.query.id)
    const result: MyData[] = await db.query(
        'SELECT * FROM mydata WHERE id = ?', [id]
    )
    res.render('hello/delete', {
        title: 'Hello/delete',
        content: `id = ${id} のレコードを削除`,
        mydata: result[0]
    })
})

router.post('/delete', async(req, res, next) => {
    const id = Number(req.body.id)
    await db.query(
        'DELETE FROM mydata WHERE id = ?', [id]
    )
    // 削除したら一覧に戻る
    res.redirect('/hello')
})

export default router