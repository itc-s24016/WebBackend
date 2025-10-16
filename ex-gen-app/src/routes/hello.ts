import { Router } from 'express';

const router = Router();

// /hello ではなく、 / にすることで、 app.ts で /hello を指定した際に正しく動作する
router.get('/', (req, res, next) => {
    const name = req.query.name
    const mail = req.query.mail
    const data = {
        title: 'Hello',
        content: `あなたの名前は ${name} です。<br> メールアドレスは ${mail} です。`
    }
    res.render('hello', data);
})

// この行で import できるようにする
export default router;