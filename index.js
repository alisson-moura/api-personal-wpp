const express = require('express')
const WppBot = require('./bot')

const app = express()
const port = 3000
let wppBot

app.use(express.urlencoded({ extended: true, }));
app.use(express.json());

// array with ips allowed to use api
const allowHosts = []
const allowHostsMiddleware = (req, res, next) => {
    let ip = req.ip

    if (ip.substr(0, 7) == '::ffff:')
        ip = ip.substr(7)

    if (allowHosts.includes(ip))
        return next()

    return res.status(403).json({ message: 'Access denied: host not allowed' })
}

app.post('/send', allowHostsMiddleware, async (req, res) => {
    const { contact, message } = req.body
    if (!contact || !message)
        return res.status(400).json({ error: 'contact or message not provided' })

    const result = await wppBot.sendMessage(contact, message)
    if (result) {
        return res.status(500).json({ error: result.message })
    }
    return res.status(201).end()
})

app.get('/status', allowHostsMiddleware, async (req, res) => {
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

app.listen(port, async () => {
    await startWppBot()
    console.log('API running on port: 3000')
})