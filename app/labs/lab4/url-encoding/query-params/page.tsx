import { Suspense } from "react";
import QueryCalculatorInner from "./QueryCalculator";

export default function QueryCalculatorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryCalculatorInner />
    </Suspense>
  );
}