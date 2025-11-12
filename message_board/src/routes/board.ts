import {Router} from 'express'
import prisma from '../libs/db.js'

const router = Router()
const ITEMS_PER_PAGE = 5

router.use(async (req, res, next) => {
  // ログイン中かどうかをチェックするミドルウェア
  if (!req.isAuthenticated()) {
    // ログインしていない場合はログインページへリダイレクト
    res.redirect('users/login')
    return
  }
  next()
})

router.get('/{:page}', async (req, res) => {
  // ページネーション対応の掲示板一覧表示
  const page = parseInt(req.params.page || '1')

  res.send(`Welcome to board. page: ${page}`)
})

export default router