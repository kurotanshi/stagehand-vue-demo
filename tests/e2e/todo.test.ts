import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer, type ViteDevServer } from "vite";
import { localBrowser, Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod/v4";

const PORT = 5199;
const BASE_URL = `http://localhost:${PORT}`;

let server: ViteDevServer;
let browser: Awaited<ReturnType<typeof localBrowser.launch>>;
let stagehand: Stagehand;

beforeAll(async () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "缺少 OPENAI_API_KEY:請複製 .env.example 為 .env 並填入你的 key",
    );
  }

  server = await createServer({ server: { port: PORT, strictPort: true } });
  await server.listen();

  browser = await localBrowser.launch({ headless: true });
  stagehand = await Stagehand.create({
    browser,
    model: {
      modelName: "openai/gpt-5.6-luna",
      apiKey: process.env.OPENAI_API_KEY,
    },
  });
});

afterAll(async () => {
  await stagehand?.close();
  await browser?.close();
  await server?.close();
});

describe("待辦清單 E2E (Stagehand v4)", () => {
  it("可以新增待辦事項並正確顯示統計", async () => {
    const [page] = await browser.context.pages();
    await page.goto(BASE_URL);

    // Stagehand 的鐵則:act 一次只做一件事
    await stagehand.act("在待辦事項輸入框輸入「買牛奶」");
    await stagehand.act("點擊新增按鈕");

    await stagehand.act("在待辦事項輸入框輸入「寫部落格文章」");
    await stagehand.act("點擊新增按鈕");

    // extract + Zod schema:用自然語言擷取,拿回型別安全的結構化資料
    const { data } = await stagehand.extract(
      "擷取目前清單上所有待辦事項的文字,以及底部顯示的未完成事項數量",
      z.object({
        todos: z.array(z.string()),
        remaining: z.number(),
      }),
    );

    expect(data.todos).toHaveLength(2);
    expect(data.todos).toContain("買牛奶");
    expect(data.todos).toContain("寫部落格文章");
    expect(data.remaining).toBe(2);
  });

  it("observe 先找到動作,act 再零推論重放", async () => {
    // 每個測試自己準備狀態,不依賴上一個測試的執行結果
    const [page] = await browser.context.pages();
    await page.goto(BASE_URL);

    await stagehand.act("在待辦事項輸入框輸入「買牛奶」");
    await stagehand.act("點擊新增按鈕");

    // observe 回傳 Action 物件,餵回 act() 時不再呼叫 LLM
    const { data: actions } = await stagehand.observe(
      "找出「買牛奶」這個待辦事項的完成核取方塊",
    );
    expect(actions.length).toBeGreaterThan(0);

    await stagehand.act(actions[0]);

    const { data } = await stagehand.extract(
      "擷取底部顯示的未完成事項數量",
      z.object({ remaining: z.number() }),
    );
    expect(data.remaining).toBe(0);
  });
});
