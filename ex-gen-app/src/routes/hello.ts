import { Router } from 'express';

const router = Router();

// /hello ではなく、 / にすることで、 app.ts で /hello を指定した際に正しく動作する
router.get('/', (req, res, next) => {
    const data = {
        title: 'Hello',
        content: 'これは、サンプルのコンテンツです<br>this is sample content.'
    }
    res.render('hello', data);
})

// この行で import できるようにする
export default router;