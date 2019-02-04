const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");
class CustomPage {
  constructor(page) {
    this.page = page;
  }
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);
    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }
  async login() {
    const user = await userFactory();
    const { page } = this;
    // console.log("user:", user);
    const { sessionString, sig } = sessionFactory(user);
    await Promise.all([
      page.setCookie({ name: "session", value: sessionString }),
      page.setCookie({ name: "session.sig", value: sig }),
      page.goto("http://localhost:3000/blogs"),
      page.waitFor('a[href="/auth/logout', 10)
    ]);
  }
  async getContentsFrom(selector) {
    console.log(selector);
    return await this.page.$eval(selector, el => el.innerHTML);
  }
  async get(path) {
    const { page } = this;
    return await page.evaluate(path => {
      return fetch(path, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-type": "application/json"
        }
      }).then(res => res.json());
    }, path);
  }
  async post(path, body) {
    const { page } = this;
    return page.evaluate(
      (path, body) => {
        return fetch(path, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }).then(res => res.json());
      },
      path,
      body
    );
  }
  async execRequests(actions) {
    return await Promise.all(
      actions.map(({ method, path, body }) => {
        return this[method](path, body);
      })
    );
  }
}
module.exports = CustomPage;
