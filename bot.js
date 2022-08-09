const puppeteer = require("puppeteer");
const QRCode = require('qrcode');

class WppBot {
  constructor() {
    this.browser
    this.page
  }

  async init() {
    // Configures puppeteer
    this.browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
    this.page = await this.browser.newPage();
    this.page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
  }
  async login() {
    try {
      // Navigates to Whatsapp
      await this.page.goto("https://web.whatsapp.com/");

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
      await this.page.type(".p3_M1", message, { delay: 10 /* delay to hide automatic behavior */ })
      await this.page.waitForSelector('span[data-testid="send"]')
      await this.page.click('span[data-testid="send"]')
      await this.delay(10); // delay to hide automatic behavior
    } catch (error) {
      return error
    }
  }

  delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
}

module.exports = WppBot