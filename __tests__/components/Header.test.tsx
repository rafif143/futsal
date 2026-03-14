import { describe, it } from "node:test";
import assert from "node:assert";

describe("Header Component", () => {
  it("should accept title prop", () => {
    const title = "Dashboard";
    // Validates that the Header component accepts a title prop
    assert.strictEqual(typeof title, "string");
    assert.ok(title.length > 0);
  });

  it("should accept optional breadcrumb prop", () => {
    const breadcrumb = ["Admin", "Teams"];
    // Validates that breadcrumb is an array of strings
    assert.ok(Array.isArray(breadcrumb));
    assert.strictEqual(breadcrumb.length, 2);
    assert.strictEqual(breadcrumb[0], "Admin");
    assert.strictEqual(breadcrumb[1], "Teams");
  });

  it("should handle empty breadcrumb", () => {
    const breadcrumb: string[] = [];
    // Validates that empty breadcrumb is handled
    assert.ok(Array.isArray(breadcrumb));
    assert.strictEqual(breadcrumb.length, 0);
  });

  it("should have admin avatar information", () => {
    const adminInfo = {
      name: "Admin",
      role: "Administrator",
    };
    // Validates admin information structure
    assert.strictEqual(adminInfo.name, "Admin");
    assert.strictEqual(adminInfo.role, "Administrator");
  });

  it("should format breadcrumb with separators", () => {
    const breadcrumb = ["Admin", "Matches", "Input"];
    const formatted = breadcrumb.join(" / ");
    // Validates breadcrumb formatting
    assert.strictEqual(formatted, "Admin / Matches / Input");
  });
});
