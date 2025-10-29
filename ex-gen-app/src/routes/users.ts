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

export default router