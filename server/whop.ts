import Whop from "@whop/sdk";
import { ENV } from "./_core/env";

let _whop: InstanceType<typeof Whop> | null = null;

export function getWhop() {
  if (!_whop) {
    if (!ENV.whopApiKey) {
      throw new Error("WHOP_API_KEY is not configured");
    }
    _whop = new Whop({
      apiKey: ENV.whopApiKey,
      ...(ENV.whopSandbox ? { baseURL: "https://sandbox-api.whop.com/api/v1" } : {}),
    });
  }
  return _whop;
}
