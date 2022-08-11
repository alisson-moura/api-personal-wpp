const express = require('express')
const WppBot = require('./bot')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true, }));
app.use(express.json());
let wppBot

app.post('/send', async (req, res) => {
    const { contact, message } = req.body
    if (!contact || !message)
        return res.status(400).json({ error: 'contact or message not provided' })

    const result = await wppBot.sendMessage(contact, message)
    if (result) {
        return res.status(500).json({ error: result.message })
    }
    return res.status(201).end()
})

app.get('/status', async (req, res) => {
    const status = await wppBot.checkStatus()
    return res.json({
        status,
    })
})

async function startWppBot() {
    wppBot = new WppBot()
    await wppBot.init()
    const status = await wppBot.checkStatus()
    if (status == 'offline') await wppBot.login()
}

app.listen(port, 'localhost', async () => {
    await startWppBot()
    console.log('API running on port: 3000')
})