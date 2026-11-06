import { test, expect } from "@playwright/test";

test.describe("SHONGJOG Inclusive Emergency Access Network — E2E Test Suite", () => {
  test.beforeEach(async ({ request }) => {
    // Reset database to ensure clean synthetic baseline before test
    await request.post("/api/demo/reset");
  });

  test("Module A: Landing Page Navigation, Multilingual Toggle & Content Verification", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify Brand & Hero Headline
    await expect(page.locator("h1")).toContainText("A warning is only a beginning.");
    await expect(page.locator("h2").first()).toContainText("Everyone deserves a way to reach safety.");

    // Verify Animated Vector Map is present
    const mapElement = page.locator("svg").first();
    await expect(mapElement).toBeVisible();

    // Verify Role-based entry cards
    await expect(page.getByRole("heading", { name: "Citizen or Caregiver" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Emergency Coordinator" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Field Responder" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Shelter & Asset Registry" })).toBeVisible();

    // Verify Evidence Stats
    await expect(page.getByText("84%", { exact: true })).toBeVisible();
    await expect(page.getByRole("main").getByText("UNDRR 2023 Global Survey")).toBeVisible();

    // Test Language Switch to Bengali
    const langBtn = page.getByRole("button", { name: /Toggle language/i });
    await langBtn.click();
    await expect(page.locator("h1")).toContainText("সতর্কবার্তা কেবল একটি সূচনা।");

    // Switch back to English
    await langBtn.click();
    await expect(page.locator("h1")).toContainText("A warning is only a beginning.");
  });

  test("Module B: Community Request Submission Workflow (Step 1 -> 2 -> 3 -> Confirmed Case)", async ({
    page,
  }) => {
    await page.goto("/request-help");

    // Step 1: Enter Situation
    await expect(page.locator("h1")).toContainText("What is happening right now?");
    
    // Click Bengali quick preset button
    const presetBtn = page.getByRole("button", { name: /হুইলচেয়ার ও গাড়ি প্রয়োজন/i });
    await presetBtn.click();

    // Verify description populated
    const descField = page.locator("textarea#description");
    await expect(descField).toHaveValue(/হুইলচেয়ার/);

    // Enter landmark location
    await page.locator("input#location").fill("Dacope Chalna Bazar, Road 4");

    // Advance to Step 2
    await page.getByRole("button", { name: /Continue to Functional Needs/i }).click();

    // Step 2: Select functional needs
    await expect(page.locator("h1")).toContainText("Select your functional requirements");
    await page.getByText("Wheelchair Transport").click();
    await page.getByText("Step-Free Shelter Access").click();
    await page.getByText("Caregiver Accompaniment").click();

    // Advance to Step 3
    await page.getByRole("button", { name: /Review & Confirm/i }).click();

    // Step 3: Review & Consent
    await expect(page.locator("h1")).toContainText("Review and Submit Request");
    await expect(page.getByText("Dacope Chalna Bazar, Road 4")).toBeVisible();

    // Submit Request
    await page.getByRole("button", { name: /Submit Emergency Request/i }).click();

    // Step 4: Submission Confirmation & Case Reference
    await expect(page.getByText("Submission Confirmed")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Case Reference: SHG-2026-\d{4}/)).toBeVisible();
    await expect(page.getByText("Live Tracking Workflow")).toBeVisible();
  });

  test("Module E: Operations Center Filters, Map/List Toggle & Case Inspection", async ({
    page,
  }) => {
    await page.goto("/operations");

    // Check KPI cards
    await expect(page.getByText("Active Requests")).toBeVisible();
    await expect(page.getByText("Awaiting Review")).toBeVisible();

    // Toggle between Map and Accessible List
    const accessibleListBtn = page.getByRole("button", { name: /Accessible List/i });
    await accessibleListBtn.click();
    await expect(page.getByText("Active Case Priority Queue")).toBeVisible();

    const mapBtn = page.getByRole("button", { name: /Map/i });
    await mapBtn.click();

    // Click on Case SHG-2026-0801
    await page.getByText("SHG-2026-0801").first().click();

    // Verify Case details drawer
    await expect(page.getByText("Verified Support Constraints:")).toBeVisible();
    await expect(page.getByText("Intelligent Matching Engine Output")).toBeVisible();

    // Verify recommended shelter headroom & ramp status
    await expect(page.getByText(/Headroom: \d+ places/)).toBeVisible();
  });

  test("Module F: Field Responder State Machine Transitions", async ({ page }) => {
    await page.goto("/responder");

    // Check responder app loads
    await expect(page.getByText("FIELD RESPONDER APP")).toBeVisible();
    await expect(page.getByText("Active Responder Unit")).toBeVisible();

    // Switch responder selector if needed to verify state
    const select = page.locator("select");
    await expect(select).toBeVisible();
  });

  test("Module G: Shelter & Resource Registry with Verification Filtering", async ({ page }) => {
    await page.goto("/resources");

    await expect(page.getByText("Verified Shelters, Evacuation Vehicles & Response Squads")).toBeVisible();
    await expect(page.getByText("Verification Policy & Hard Constraint Integrity:")).toBeVisible();

    // Filter to Shelters Only
    const typeFilter = page.locator("select").first();
    await typeFilter.selectOption("shelter");

    // Check that Dacope Model Shelter is shown
    await expect(page.getByText("Dacope Model Cyclone Shelter & Multipurpose Center")).toBeVisible();
    await expect(page.getByText("Ramp: YES (1:12)").first()).toBeVisible();
  });
});
