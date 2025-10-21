import { Router } from 'express';

const router = Router();

declare module 'express-session' {
    interface SessionData {
        message?: string;
    }
}

// /hello ではなく、 / にすることで、 app.ts で /hello を指定した際に正しく動作する
router.get('/', (req, res, next) => {
    const msg = req.session.message !== undefined
        ? `Last Message: ${req.session.message}` : '何か書いて送信してください'

    const data = {
        title: 'Hello',
        content: msg
    }
    res.render('hello', data);
})

router.post('/post', async (req, res, next) => {
    // string | undefined にすることにより、1 + 1 を計算してしまうバグを防ぐ
    const msg = req.body.message as string | undefined
    // セッションストレージにメッセージを保存
    req.session.message = msg;
    
    const data ={
        title: 'Hello!',
        content: `あなたは、「${msg}」と送信しました。`
    }
    res.render('hello', data)
})

// この行で import できるようにする
export default router;