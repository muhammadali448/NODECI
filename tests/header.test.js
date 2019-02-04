// const puppeteer = require("puppeteer");
const CustomPage = require("./helpers/page");
let page;
beforeEach(async () => {
  // browser = await puppeteer.launch({
  //   headless: false
  // });
  // page = await browser.newPage();
  page = await CustomPage.build();
  await page.goto("http://localhost:3000");
});
afterEach(async () => {
  await page.close();
});
test("The header has the correct test", async () => {
  // const text = await page.$eval("a.brand-logo", el => el.innerHTML);
  const text = await page.getContentsFrom("a.brand-logo");
  expect(text).toBe("Blogster");
});
test("clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});
test("when sign in show logout buttons", async () => {
  // const user = await userFactory();
  // console.log("user:", user);
  // const { sessionString, sig } = sessionFactory(user);
  // await Promise.all([
  //   page.setCookie({ name: "session", value: sessionString }),
  //   page.setCookie({ name: "session.sig", value: sig }),
  //   page.goto("localhost:3000"),
  //   page.waitFor('a[href="/auth/logout', 10)
  // ]);
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toBe("Logout");
});
