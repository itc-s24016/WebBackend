import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import argon2 from 'argon2'
import prisma from './db.js'

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    // ユーザーをデータベースから取得
    const user = await prisma.user.findUnique({where: {email: username}})

    // ユーザーが存在しない場合はログイン失敗
    if (!user) {
      return done(
        null, false, {message: 'またはパスワードが違います'}
      )
    }

    // パスワードが一致しない場合はログイン失敗
    if (!await argon2.verify(user.password, password)) {
      return done(
        null, false, {message: 'またはパスワードが違います'}
      )
    }

    // ログイン成功の場合
    return done(null, {id: user.id, name: user.name})
  } catch (e) {
    return done(e)
  }
}))

// ログインに成功したらセッションに保存する
passport.serializeUser<Express.User>((user, done) => {
  process.nextTick(() => {
    done(null, user)
  })
})

// 上の関数によって保存されたセッションからユーザー情報を取得する
passport.deserializeUser<Express.User>((user, done) => {
  process.nextTick(() => {
    return done(null, user)
  })
})

export default passport