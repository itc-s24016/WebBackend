import { Router } from 'express'
import mariadb from 'mariadb'
import { check, validationResult } from 'express-validator'

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

// データを追加する(http://localhost:3210/hello/add など)
router.get('/add', async(req, res, next) => {
    res.render('hello/add', {
        title: 'Hello/Add',
        content: '新しいレコードを入力',
        form: {name: '', mail: '', age: 0}, // 初期値とエラー用のパラメーターも追加
        error:  {}
    })
})

router.post('/add',
    check('name', 'NAME は必ず入力してください').notEmpty().escape(),
    check('mail', 'MAIL はメールアドレスを入力してください').isEmail().escape(),
    check('age', 'AGE は年齢（整数）を入力してください').isInt().escape(),
    async (req, res, next) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        // 入力チェックに引っかかったら、もう一度画面をレンダリングする（やり直し）
        res.render('hello/add', {
            title: 'Hello/Add',
            content: '新しいレコードを入力',
            form: req.body,
            error: result.mapped()
        })
        return
    }
    const {name, mail, age} = req.body
    await db.query('INSERT INTO mydata (name, mail, age) VALUES (?, ?, ?)', [
        name, mail, age
    ])
    // 追加したら一覧に戻る
    res.redirect('/hello')
})

// 指定したIDのデータを表示(http://localhost:3210/hello/show?id=2 など)
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

// 指定したIDのデータを削除する(http://localhost:3210/hello/delete?id=9 など)
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