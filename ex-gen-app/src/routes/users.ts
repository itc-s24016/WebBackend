import {Request, Router} from 'express'
import {PrismaMariaDb} from '@prisma/adapter-mariadb'
import { Prisma, PrismaClient } from 'db'

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
    prev?: string
    next?: string
}
const PAGE_SIZE = 3 // 1ページあたりの表示件数(今回はデータが少ないので3件に設定)

// ユーザー一覧を名前の昇順で表示できるようになった
router.get('/', async (req: Request<{}, {}, {}, UserParams>, res, next) => {
    const conditions: Prisma.UserFindManyArgs = {
        orderBy: [
            {id: 'asc'},
        ],
        take: PAGE_SIZE
    }
    const {prev: prevCursor, next: nextCursor} = req.query // クエリパラメータからprevとnextを取得、prevCursor, nextCursorという別名に変える
    if (nextCursor) { // 次のページへ
        conditions.cursor = {id: parseInt(nextCursor)}
        conditions.skip = 1
    }
    if (prevCursor) { // 前のページへ
        conditions.take = -PAGE_SIZE
        conditions.cursor = {id: parseInt(prevCursor)}
        conditions.skip = 1
    }

    const users = await prisma.user.findMany(conditions)
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