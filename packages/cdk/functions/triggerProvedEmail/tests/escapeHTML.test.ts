import { escapeHTML } from "../escapeHTML";

describe("escapeHTML", () => {
  it("should escape < and >", () => {
    const escaptedStr = escapeHTML("<script>bad bad</script>");
    expect(escaptedStr).toBe("&lt;script&gt;bad bad&lt;/script&gt;");
  });
  it("should escape double quote", () => {
    const escaptedStr = escapeHTML('name"');
    expect(escaptedStr).toBe("name&quot;");
  });
});
