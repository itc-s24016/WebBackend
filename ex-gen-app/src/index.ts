import express, { Request, Response } from "express"

const app = express()

app.get('/', async (req: Request, res: Response) => {
    res.send('Welcome to Express!')
})

app.listen(3000, async () => {
    console.log('Start server port:3000')
})