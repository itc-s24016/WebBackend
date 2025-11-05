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
}
// ユーザー一覧表示ができるようになった
router.get('/', async (req: Request<{}, {}, {}, UserParams>, res, next) => {
    const id = parseInt(req.query.id || '')

    const users = await (id ? prisma.user.findMany({where: {id}})
        : prisma.user.findMany())

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

export default router