const wppBot = require('./bot')

class QueueMessage {
    constructor() {
        // Initializing the queue with given arguments 
        this.elements = [];
    }
    // Proxying the push/shift methods
    push(...args) {
        return this.elements.push(...args);
    }
    shift(...args) {
        return this.elements.shift(...args);
    }
    // Add some length utility methods
    get length() {
        return this.elements.length;
    }
    set length(length) {
        return this.elements.length = length;
    }
}

const queueMessage = new QueueMessage()

async function startWppBot() {
    await wppBot.init()
    const status = await wppBot.checkStatus()
    if (status == 'offline') await wppBot.login()
}
async function sendFirstMessage() {
    if (queueMessage.length === 0) return

    const { contact, message } = queueMessage.elements[0]
    await wppBot.sendMessage(contact, message)
    queueMessage.shift()
}

let inProgress = false
async function run() {
    if (queueMessage.length > 0 && !inProgress) {
        inProgress = true
        await sendFirstMessage()
        inProgress = false
        return run()
    }
    return
}

process.on('message', async message => {
    message = message.split('$')
    switch (message[0]) {
        case 'start':
            await startWppBot()
            break;

        case 'stop':
            await wppBot.stop()
            break;

        case 'addQueue':
            queueMessage.push({
                contact: message[1],
                message: message[2]
            })
            await run()
            break;

        default:
            break;
    }
})
