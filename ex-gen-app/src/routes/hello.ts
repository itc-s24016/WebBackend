import { Router } from 'express';

const router = Router();

// /hello ではなく、 / にすることで、 app.ts で /hello を指定した際に正しく動作する
router.get('/', (req, res, next) => {
    const data = {
        title: 'Hello',
        content: '※何か書いて送信してください'
    }
    res.render('hello', data);
})

router.post('/post', async (req, res, next) => {
    // string | undefined にすることにより、1 + 1 を計算してしまうバグを防ぐ
    const msg = req.body.message as string | undefined
    const data ={
        title: 'Hello!',
        content: `あなたは、「${msg}」と送信しました。`
    }
    res.render('hello', data)
})

// この行で import できるようにする
export default router;