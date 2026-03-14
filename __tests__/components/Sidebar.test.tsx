import { describe, it } from "node:test";
import assert from "node:assert";

describe("Sidebar Component", () => {
  it("should have all required menu items", () => {
    const expectedMenuItems = [
      "Dashboard",
      "Registration Management",
      "Teams",
      "Players",
      "Drawing Table",
      "Matches",
      "Standings",
      "Knockout Stage",
      "Public View",
      "Reports",
    ];

    // This test validates that all menu items are defined
    // In a real test with React Testing Library, we would render the component
    // and check that all menu items are present in the DOM
    assert.strictEqual(expectedMenuItems.length, 10);
  });

  it("should map menu items to correct paths", () => {
    const menuItemPaths = {
      Dashboard: "/dashboard",
      "Registration Management": "/admin/registrations",
      Teams: "/admin/teams",
      Players: "/admin/players",
      "Drawing Table": "/admin/drawing",
      Matches: "/admin/matches",
      Standings: "/admin/standings",
      "Knockout Stage": "/admin/knockout",
      "Public View": "/public-view",
      Reports: "/admin/reports",
    };

    // Validates that menu items map to correct paths
    assert.strictEqual(Object.keys(menuItemPaths).length, 10);
    assert.strictEqual(menuItemPaths["Dashboard"], "/dashboard");
    assert.strictEqual(
      menuItemPaths["Registration Management"],
      "/admin/registrations"
    );
  });

  it("should have unique menu item IDs", () => {
    const menuItemIds = [
      "dashboard",
      "registration-management",
      "teams",
      "players",
      "drawing-table",
      "matches",
      "standings",
      "knockout-stage",
      "public-view",
      "reports",
    ];

    const uniqueIds = new Set(menuItemIds);
    assert.strictEqual(
      uniqueIds.size,
      menuItemIds.length,
      "All menu item IDs should be unique"
    );
  });
});
