const express = require('express')
const cors = require('cors')
const WppBot = require('./bot')

const app = express()
app.use(cors())
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

app.listen(port, async () => {
    wppBot = new WppBot()
    await wppBot.init()
    await wppBot.login()
})