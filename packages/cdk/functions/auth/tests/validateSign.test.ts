import { validateSign } from "../validateSign";
import { MockProvider } from "ethereum-waffle";
const provider = new MockProvider();
describe("validateSign", () => {
  it("should return true", async () => {
    const [wallet] = provider.getWallets();
    const signature = await wallet.signMessage(`Proved nonce 1234`);
    expect(
      validateSign({ nonce: "1234", address: wallet.address, signature })
    ).toBe(true);
  });
  it("should return false", async () => {
    const [wallet] = provider.getWallets();
    const signature = await wallet.signMessage(`Proved nonce 1234`);
    expect(
      validateSign({ nonce: "5678", address: wallet.address, signature })
    ).toBe(false);
  });
});
