import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { width: 320, height: 568, name: "320px_se" },
  { width: 360, height: 640, name: "360px_android" },
  { width: 375, height: 667, name: "375px_iphone8" },
  { width: 390, height: 844, name: "390px_iphone12" },
  { width: 430, height: 932, name: "430px_pro_max" },
  { width: 768, height: 1024, name: "768px_tablet" },
  { width: 820, height: 1180, name: "820px_ipad_air" },
  { width: 1024, height: 768, name: "1024px_laptop" },
  { width: 1280, height: 800, name: "1280px_desktop" },
  { width: 1366, height: 768, name: "1366px_hd" },
  { width: 1440, height: 900, name: "1440px_fhd" },
  { width: 1920, height: 1080, name: "1920px_uhd" },
];

test.describe("SHONGJOG V4.2 Localization & Responsive Acceptance Suite", () => {
  test.beforeAll(async () => {
    const screenshotDir = path.join(process.cwd(), "docs", "screenshots");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ request }) => {
    await request.post("/api/demo/reset");
  });

  test("1. Language persistence, instant switching & zero-flash across routes", async ({ page }) => {
    await page.goto("/");

    // Default is English
    await expect(page.locator("h1")).toContainText("A warning is only a beginning.");

    // Switch to Bengali
    const langBtn = page.getByRole("button", { name: /Toggle language/i });
    await langBtn.click();
    await expect(page.locator("h1")).toContainText("সতর্কবার্তা কেবল একটি সূচনা।");

    // Check localStorage persistence
    const savedLang = await page.evaluate(() => localStorage.getItem("shongjog_lang"));
    expect(savedLang).toBe("bn");

    // Navigate to Operations in Bengali mode
    await page.goto("/operations");
    await expect(page.locator("h1")).toContainText("অন্তর্ভুক্তিমূলক ইভাকুয়েশন ডিসপ্যাচ ও টেলিমেট্রি");
    await expect(page.getByText("সক্রিয় অনুরোধসমূহ")).toBeVisible();

    // Navigate to Request Help in Bengali mode
    await page.goto("/request-help");
    await expect(page.locator("h1")).toContainText("এখন কী ঘটছে?");

    // Switch back to English on Request Help
    await page.getByRole("button", { name: /Toggle language/i }).click();
    await expect(page.locator("h1")).toContainText("What is happening right now?");

    const savedLangEn = await page.evaluate(() => localStorage.getItem("shongjog_lang"));
    expect(savedLangEn).toBe("en");
  });

  test("2. Zero Horizontal Document Overflow (scrollWidth <= innerWidth) across all 12 viewports (EN & BN)", async ({
    page,
  }) => {
    test.setTimeout(90000);
    const routes = ["/", "/operations", "/request-help", "/resources", "/responder"];

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const route of routes) {
        // Test in English
        await page.goto(route);
        await page.waitForLoadState("domcontentloaded");

        const overflowEn = await page.evaluate(() => {
          const doc = document.documentElement;
          return {
            scrollWidth: doc.scrollWidth,
            clientWidth: doc.clientWidth,
            innerWidth: window.innerWidth,
            hasOverflow: doc.scrollWidth > window.innerWidth,
          };
        });

        expect(
          overflowEn.hasOverflow,
          `Horizontal document overflow (EN) detected on route ${route} at ${vp.width}x${vp.height}: scrollWidth ${overflowEn.scrollWidth} > innerWidth ${overflowEn.innerWidth}`
        ).toBe(false);

        // Test in Bengali on key mobile and desktop boundary viewports
        if ([320, 390, 768, 1440].includes(vp.width)) {
          await page.evaluate(() => {
            localStorage.setItem("shongjog_lang", "bn");
            window.dispatchEvent(new Event("shongjog_lang_change"));
          });
          await page.waitForTimeout(100);

          const overflowBn = await page.evaluate(() => {
            const doc = document.documentElement;
            return {
              scrollWidth: doc.scrollWidth,
              clientWidth: doc.clientWidth,
              innerWidth: window.innerWidth,
              hasOverflow: doc.scrollWidth > window.innerWidth,
            };
          });

          expect(
            overflowBn.hasOverflow,
            `Horizontal document overflow (BN) detected on route ${route} at ${vp.width}x${vp.height}: scrollWidth ${overflowBn.scrollWidth} > innerWidth ${overflowBn.innerWidth}`
          ).toBe(false);

          // Reset back to English
          await page.evaluate(() => {
            localStorage.setItem("shongjog_lang", "en");
            window.dispatchEvent(new Event("shongjog_lang_change"));
          });
        }
      }
    }
  });

  test("3. Interactive Element Bounding Boxes & Usability (Controls Not Suppressed or Clipped)", async ({ page }) => {
    const testViewports = [
      { width: 320, height: 568 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ];

    for (const vp of testViewports) {
      await page.setViewportSize(vp);

      // 1. Landing Page Interactive Elements
      await page.goto("/");
      const langBtn = page.getByRole("button", { name: /Toggle language/i });
      await expect(langBtn).toBeVisible();
      const langBox = await langBtn.boundingBox();
      expect(langBox).not.toBeNull();
      expect(langBox!.width).toBeGreaterThanOrEqual(32);
      expect(langBox!.height).toBeGreaterThanOrEqual(32);

      const requestCta = page.getByRole("link", { name: /Request assistance|সাহায্যের জন্য অনুরোধ/i }).first();
      await expect(requestCta).toBeVisible();
      const ctaBox = await requestCta.boundingBox();
      expect(ctaBox).not.toBeNull();
      expect(ctaBox!.width).toBeGreaterThanOrEqual(100);
      expect(ctaBox!.height).toBeGreaterThanOrEqual(36);

      // 2. Operations Center Controls
      await page.goto("/operations");
      const simulateBtn = page.getByRole("button", { name: /Simulate Influx|সিমুলেট ইনফ্লাক্স/i });
      await expect(simulateBtn).toBeVisible();
      const simBox = await simulateBtn.boundingBox();
      expect(simBox).not.toBeNull();
      expect(simBox!.height).toBeGreaterThanOrEqual(32);

      // 3. Request Help Inputs
      await page.goto("/request-help");
      const textarea = page.locator("textarea");
      await expect(textarea).toBeVisible();
      const areaBox = await textarea.boundingBox();
      expect(areaBox).not.toBeNull();
      // On 320px viewport with outer (32px) and card padding (48px), available inner width is 238px-240px
      expect(areaBox!.width).toBeGreaterThanOrEqual(200);
      expect(areaBox!.height).toBeGreaterThanOrEqual(80);

      // 4. Resources Ledger Switchers
      await page.goto("/resources");
      const gridBtn = page.getByRole("button", { name: /Grid|গ্রিড/i });
      await expect(gridBtn).toBeVisible();
      const gridBox = await gridBtn.boundingBox();
      expect(gridBox).not.toBeNull();
      expect(gridBox!.width).toBeGreaterThanOrEqual(40);
    }
  });

  test("4. Operations Center Mobile Navigation Drawer on viewports < 1280px", async ({ page }) => {
    // Test on 390px mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/operations");

    // Mobile nav trigger must be visible
    const mobileMenuTrigger = page.getByRole("button", { name: /Open Menu|মেনু খুলুন|operations menu/i });
    await expect(mobileMenuTrigger).toBeVisible();

    // Click to open slide-over drawer
    await mobileMenuTrigger.click();

    // Verify drawer dialog opens
    const drawerTitle = page.getByText(/Operations Control|অপারেশনাল কন্ট্রোল/i);
    await expect(drawerTitle).toBeVisible();

    // Close the drawer
    const closeBtn = page.getByRole("button", { name: "Close menu" });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(drawerTitle).not.toBeVisible();
  });

  test("5. Capture comprehensive visual verification screenshots (Desktop & Mobile, EN & BN)", async ({
    page,
  }) => {
    // A. Desktop Landing Page (EN & BN)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.screenshot({ path: "docs/screenshots/desktop_landing_en.png", fullPage: true });

    await page.getByRole("button", { name: /Toggle language/i }).click();
    await expect(page.locator("h1")).toContainText("সতর্কবার্তা কেবল একটি সূচনা।");
    await page.screenshot({ path: "docs/screenshots/desktop_landing_bn.png", fullPage: true });

    // B. Desktop Operations Center (BN)
    await page.goto("/operations");
    await page.waitForTimeout(500);
    await page.screenshot({ path: "docs/screenshots/desktop_operations_bn.png", fullPage: true });

    // C. Mobile Landing Page 390px (BN)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.screenshot({ path: "docs/screenshots/mobile_landing_390_bn.png", fullPage: true });

    // D. Mobile Operations Center 390px (BN)
    await page.goto("/operations");
    await page.waitForTimeout(500);
    await page.screenshot({ path: "docs/screenshots/mobile_operations_390_bn.png", fullPage: true });

    // E. Mobile Request Help 390px (BN)
    await page.goto("/request-help");
    await page.screenshot({ path: "docs/screenshots/mobile_request_help_390_bn.png", fullPage: true });

    // F. Mobile Resources Ledger 390px (BN)
    await page.goto("/resources");
    await page.screenshot({ path: "docs/screenshots/mobile_resources_390_bn.png", fullPage: true });

    // G. Mobile Responder App 390px (BN)
    await page.goto("/responder");
    await page.screenshot({ path: "docs/screenshots/mobile_responder_390_bn.png", fullPage: true });
  });
});
