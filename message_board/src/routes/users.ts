import {Router} from 'express'

const router = Router()

router.get('/login', async (req, res) => {
  res.render('users/login', {
    title: 'Users/Login',
  })
})

export default router