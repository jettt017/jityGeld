// Debug script for weekly spending aggregation
import { getSpendingData } from "../actions/spending.ts";

(async () => {
  const result = await getSpendingData("weekly");
  console.log("Weekly Spending Result:\n", JSON.stringify(result, null, 2));
})();
