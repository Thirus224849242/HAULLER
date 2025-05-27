const { expect } = require("chai");

describe("Dummy Test", () => {
  it("should always pass", () => {
    expect(true).to.equal(true);
  });

  it("should validate math", () => {
    expect(2 + 2).to.equal(4);
  });
});
