import {Router} from 'express'
import passport from '../libs/auth.js' // 拡張済みの手作り passport を選択

const router = Router()

router.get('/login', async (req, res) => {
  res.render('users/login', {
    error: (req.session.messages || []).pop() // 連続してエラーメッセージが出た場合、メッセージが溜まり過ぎないように pop で取得しながら削除する
  })
})

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/board',
    failureRedirect: '/users/login',
    failureMessage: true,
    badRequestMessage: 'ユーザー名とパスワードを入力してください'
  })
)

export default router