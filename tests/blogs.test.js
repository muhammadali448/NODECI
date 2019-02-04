const CustomPage = require("./helpers/page");
let page;
beforeEach(async () => {
  page = await CustomPage.build();
  await page.goto("http://localhost:3000");
});
afterEach(async () => {
  await page.close();
});
describe("when user is not logged in", async () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs"
    },
    {
      method: "post",
      path: "/api/blogs",
      body: {
        title: "My title",
        content: "My content"
      }
    }
  ];
  test("blog related actions are probihited", async () => {
    const results = await page.execRequests(actions);
    for (const result of results) {
      expect(result).toEqual({ error: "You must log in!" });
    }
  });
  //   test("cannot post the blog", async () => {
  //     const result = await page.post("/api/blogs", {
  //       title: "My title",
  //       content: "My content"
  //     });
  //     expect(result).toEqual({ error: "You must log in!" });
  //   });
  //   test("use cannot get the list of blogs", async () => {
  //     const result = await page.get("/api/blogs");
  //     expect(result).toEqual({ error: "You must log in!" });
  //   });
});
describe("when logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a[href='/blogs/new']");
  });
  test("when logged in, can see create blog form", async () => {
    const label = await page.getContentsFrom("form label");
    expect(label).toBe("Blog Title");
  });
  describe("using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });
    test("the form shows an error message", async () => {
      const title = await page.getContentsFrom(".title .red-text");
      const content = await page.getContentsFrom(".content .red-text");
      expect(title).toBe("You must provide a value");
      expect(content).toBe("You must provide a value");
    });
  });
  describe("using valid inputs", async () => {
    beforeEach(async () => {
      await page.type("input[name=title]", "My testing blog");
      await page.type("input[name=content]", "My testing content");
      await page.click("form button");
    });
    test("submitting takes user to review screen", async () => {
      const texth5 = await page.getContentsFrom("form h5");
      expect(texth5).toBe("Please confirm your entries");
    });
    test("submitting then saving add blog to index page", async () => {
      await page.click("form button.green");
      await page.waitFor(".card");
      const title = await page.getContentsFrom(".card-title");
      const content = await page.getContentsFrom("p");
      expect(title).toBe("My testing blog");
      expect(content).toBe("My testing content");
    });
  });
});
