const { fork } = require('child_process');
const { resolve } = require('path');
const express = require('express')

const app = express()
const port = 3000

const child = fork(resolve(__dirname, 'queue.js'))

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

    child.send(`addQueue$${contact}$${message}`)
    return res.status(201).end()
})

app.get('/status', allowHostsMiddleware, async (req, res) => {
    return res.json({
        status: 'ok',
    })
})

app.listen(port, async () => {
    child.send('start')
    console.log('API running on port: 3000')
})