const { userInfo } = require("os");
const puppeteer = require("puppeteer");
const QRCode = require('qrcode');
const resolve = require('path').resolve;

class WppBot {
  constructor() {
    this.browser
    this.page
  }

  async init() {
    // Configures puppeteer
    const userDir = resolve(__dirname, 'user-data-dir')
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox',
        '--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36'],
      userDataDir: userDir
    });
    this.page = await this.browser.newPage();
    this.page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
    // Navigates to Whatsapp
    await this.page.goto("https://web.whatsapp.com/");
  }
  async login() {
    try {
      // Get and generate Qr Code
      console.log('Read the qrcode with your smartphone to login')
      await this.page.waitForSelector('div[data-testid="qrcode"]')
      const qrCode = await this.page.$eval('div[data-testid="qrcode"]', $qrCodeElement => $qrCodeElement.getAttribute('data-ref'))
      QRCode.toString(qrCode, { type: 'terminal', width: 100, small: true }, (er, url) => console.log(url))
      await this.page.waitForSelector('div[data-tab="4"]');
    }
    catch (error) {
      await this.browser.close()
      console.log('Timeout exceeded')
      process.exit(1)
    }
  }

  async sendMessage(contact, message) {
    try {
      // replace \n to shift+enter


      // Load contacts 
      await this.page.waitForSelector('div[data-tab="4"]');
      await this.delay(10); // delay to hide automatic behavior

      // Change to contact you want to send messages to
      await this.page.type('div[data-testid="chat-list-search"]', contact, { delay: 10 })
      await this.page.waitForSelector(`span[title="${contact}"]`, { timeout: 2000 }).catch(async () => {
        await this.page.waitForSelector('span[data-testid="x-alt"]')
        await this.page.click('span[data-testid="x-alt"]')
        throw new Error('Invalid contact')
      })
      await this.page.click(`span[title='${contact}']`);

      // Checks if the text contains line breaks
      if (message.includes('\\n')) {
        message = message.split('\\n')
        for (const m of message) {
          await this.page.type(".p3_M1", m, { delay: 10 /* delay to hide automatic behavior */ })
          await this.page.keyboard.down('ShiftLeft')
          await this.page.keyboard.press('Enter')
        }
      } else {
        await this.page.type(".p3_M1", message, { delay: 10 /* delay to hide automatic behavior */ })
      }


      await this.page.waitForSelector('span[data-testid="send"]')
      await this.page.click('span[data-testid="send"]')
      await this.delay(10); // delay to hide automatic behavior
    } catch (error) {
      return error
    }
  }

  async checkStatus() {
    await this.page.reload()
    // Check if page app is open
    return await this.page.waitForSelector('#side', { timeout: 20000 })
      .then(() => 'online')
      .catch(() => 'offline')
  }

  delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
}

module.exports = WppBot