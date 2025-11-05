import {Request, Router} from 'express'
import {PrismaMariaDb} from '@prisma/adapter-mariadb'
import { PrismaClient } from 'db'

const router = Router()

const adapter = new PrismaMariaDb({
    host: 'localhost',
    port: 3306,
    user: 'prisma',
    password: 'prisma',
    database: 'chap6',
    connectionLimit: 5
})

const prisma = new PrismaClient({adapter})

interface UserParams {
    id?: string
    name?: string
    min?: string
    max?: string
    mail?: string
    page?: string
}
const PAGE_SIZE = 3 // 1ページあたりの表示件数(今回はデータが少ないので3件に設定)

// ユーザー一覧を名前の昇順で表示できるようになった
router.get('/', async (req: Request<{}, {}, {}, UserParams>, res, next) => {
    const page = req.query.page && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1 // 0以下のページ番号は1, それ以外は指定されたページ番号

    const users = await prisma.user.findMany({
        orderBy: [{
            name: 'asc'
        }],
        skip: (page - 1) * PAGE_SIZE, // スキップする件数 (例: 2ページ目: (2-1)*3= 3件スキップで4件目から表示)
        take: PAGE_SIZE, // 1ページあたりの表示件数
    })

    res.render('users/index', {
        title: 'Users/Index',
        content: users,
    })
})

// 複数検索ができるようになった
router.get('/find', async (req: Request<{}, {}, {}, UserParams>, res, next) => {
    const {name, mail} = req.query

    const users = await prisma.user.findMany({where: {
        OR: [
            {name: {contains: name}},
            {mail: {contains: mail}},
        ]
    }})

    res.render('users/index', {
        title: 'Users/Find',
        content: users,
    })
})

// 新規ユーザーの追加ができるようになった
router.get('/add', async (req, res, next) => {
    res.render('users/add', {
        title: 'Users/Add',
    })
})

router.post('/add', async (req, res, next) => {
    const {name, pass, mail} = req.body
    const age = parseInt(req.body.age)
    await prisma.user.create({
        data: {name, pass, mail, age}
    })
    res.redirect('/users')
})

// ユーザー情報の編集ができるようになった
router.get('/edit/:id', async (req, res, next) => {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({where: {id}})
    res.render('users/edit', {
        title: 'Users/Edit',
        user
    })
})

router.post('/edit', async (req, res, next) => {
    const id = parseInt(req.body.id)
    const {name, pass, mail} = req.body
    const age = parseInt(req.body.age)
    await prisma.user.update({
        where: {id},
        data: {name, pass, mail, age}
    })
    res.redirect('/users')
})

// ユーザーの削除ができるようになった
router.get('/delete/:id', async (req, res, next) => {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({where: {id}})
    res.render('users/delete', {
        title: 'Users/Delete',
        user
    })
})
router.post('/delete', async (req, res, next) => {
    const id = parseInt(req.body.id)
    await prisma.user.delete({
        where: {id}
    })
    res.redirect('/users')
})

export default router