// ─────────────────────────────────────────────────────────────────────────────
// script.js
//
// This file implements Steps 2–5 for Lab 9: 
//   • Step 2: Console methods bound to buttons
//   • Step 3: try / catch / finally in the calculator
//   • Step 4: throw + custom Error type
//   • Step 5: global error handler + TrackJS placeholder
// ─────────────────────────────────────────────────────────────────────────────

// ────────────────────
// 1. Custom Error Class
// ────────────────────
class CalculationError extends Error {
  constructor(message) {
    super(message);
    this.name = "CalculationError";
  }
}

// ────────────────────────────
// 2. Grab References to DOM
// ────────────────────────────
const form = document.querySelector("form");
const output = document.querySelector("output");

const errorBtns = Array.from(
  document.querySelectorAll("#error-btns > button")
);

// ────────────────────────────────────────────────────────────────────────────
// 3. WRAPPING CALCULATION WITH try / catch / finally
//    (This covers Steps 3 & 4: try/catch/finally + throw + custom error.)
// ────────────────────────────────────────────────────────────────────────────
form.addEventListener("submit", (e) => {
  e.preventDefault();

  try {
    // 3.1. Parse input values
    const firstValRaw = document.querySelector("#first-num").value.trim();
    const secondValRaw = document.querySelector("#second-num").value.trim();
    const operator = document.querySelector("#operator").value;

    const firstNum = Number(firstValRaw);
    const secondNum = Number(secondValRaw);

    // 3.2. If either input is not a number, throw a CalculationError
    if (isNaN(firstNum) || isNaN(secondNum)) {
      throw new CalculationError(
        "Both inputs must be valid numbers. Received: " +
          `[${firstValRaw}, ${secondValRaw}]`
      );
    }

    // 3.3. Prevent division by zero if operator is "/"
    if (operator === "/" && secondNum === 0) {
      throw new CalculationError("Cannot divide by zero.");
    }

    // 3.4. Perform the calculation
    let result;
    switch (operator) {
      case "+":
        result = firstNum + secondNum;
        break;
      case "-":
        result = firstNum - secondNum;
        break;
      case "*":
        result = firstNum * secondNum;
        break;
      case "/":
        result = firstNum / secondNum;
        break;
      default:
        // Should never happen, but just in case:
        throw new CalculationError(`Unknown operator "${operator}".`);
    }

    // 3.5. If we reach here, set the output to the computed result
    output.innerHTML = result;
  } catch (err) {
    // 3.6. If we caught a CalculationError, display its message
    if (err instanceof CalculationError) {
      output.innerHTML = `Error: ${err.message}`;
      console.error("%cCalculationError thrown:", "color: red;", err.message);
    } else {
      // If some other error slipped through, rethrow or log it
      console.error(err);
      output.innerHTML = "An unexpected error occurred.";
    }
  } finally {
    // 3.7. The finally block always runs
    console.log("Calculation attempt finished (try/catch/finally).");
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 4. BINDING THE CONSOLE BUTTONS (STEP 2)
//    We will rely on the fixed index order of the buttons in #error-btns.
//    That order is (0-based index):
//      0: Console Log
//      1: Console Error
//      2: Console Count
//      3: Console Warn
//      4: Console Assert
//      5: Console Clear
//      6: Console Dir
//      7: Console dirxml
//      8: Console Group Start
//      9: Console Group End
//     10: Console Table
//     11: Start Timer
//     12: End Timer
//     13: Console Trace
//     14: Trigger a Global Error
// ────────────────────────────────────────────────────────────────────────────
let counterLabel = 0; // used for console.count

errorBtns[0].addEventListener("click", () => {
  console.log("👋 Hello from console.log! Here is a random number:", Math.random());
});

errorBtns[1].addEventListener("click", () => {
  console.error("🚨 This is a console.error demonstration.");
});

errorBtns[2].addEventListener("click", () => {
  counterLabel++;
  console.count(`Counter has been clicked ${counterLabel} times`);
});

errorBtns[3].addEventListener("click", () => {
  console.warn("⚠️ Warning: This is a console.warn example!");
});

errorBtns[4].addEventListener("click", () => {
  // This assertion will fail, so it will print a message if false
  const testValue = 1 + 1;
  console.assert(testValue === 3, "Assertion failed: 1 + 1 is not 3.");
});

errorBtns[5].addEventListener("click", () => {
  console.clear();
  console.log("Console was cleared!");
});

errorBtns[6].addEventListener("click", () => {
  // Log the <main> element as a JavaScript object
  const mainEl = document.querySelector("main");
  console.dir(mainEl);
});

errorBtns[7].addEventListener("click", () => {
  // Show the XML/HTML representation of <main>
  const mainEl = document.querySelector("main");
  console.dirxml(mainEl);
});

errorBtns[8].addEventListener("click", () => {
  console.group("📂 My Console Group");
  console.log("Inside group: message #1");
  console.log("Inside group: message #2");
});

errorBtns[9].addEventListener("click", () => {
  console.groupEnd();
});

errorBtns[10].addEventListener("click", () => {
  // Show a table of sample data
  const sampleData = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 32 },
    { name: "Charlie", age: 29 },
  ];
  console.table(sampleData);
});

errorBtns[11].addEventListener("click", () => {
  console.time("MyTimer");
  console.log("Timer started. Perform some operations…");
});

errorBtns[12].addEventListener("click", () => {
  console.timeEnd("MyTimer");
});

errorBtns[13].addEventListener("click", () => {
  function firstFunc() {
    secondFunc();
  }
  function secondFunc() {
    thirdFunc();
  }
  function thirdFunc() {
    console.trace("This is where the trace occurred");
  }
  firstFunc();
});

// ────────────────────────────────────────────────────────────────────────────
// 5. GLOBAL ERROR HANDLER (STEP 5)
//    We use window.addEventListener("error", …) so any uncaught error
//    (e.g. from “Trigger a Global Error”) gets logged here.
// ────────────────────────────────────────────────────────────────────────────
window.addEventListener("error", (event) => {
  // Prevent the browser from also showing the default error dialog
  event.preventDefault();

  console.log(
    `%cGlobal error caught:`,
    "color: orange; font-weight: bold;",
    event.message
  );

  // TODO: If you sign up for TrackJS (or another service),
  //       copy/paste their <script> snippet in index.html (see below).
  //       Then here you would invoke the TrackJS API, e.g.:
  //
  //   TrackJS.track(event.error);
  //
  //       (Refer to https://docs.trackjs.com/ for the correct JS snippet.)
});

errorBtns[14].addEventListener("click", () => {
  // Intentionally call an undefined function to trigger a global error:
  notARealFunction();
});
