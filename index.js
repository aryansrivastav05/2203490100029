const express = require("express");
const axios = require("axios");
const app = express();

const PORT = 9876;
const WINDOW_SIZE = 10;
let window = [];

const mockNumbers = {
  p: [2, 3, 5, 7, 11, 13, 17],
  f: [0, 1, 1, 2, 3, 5, 8],
  e: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
  r: [42, 17, 89, 34, 25, 63]
};


async function fetchNumbers(type) {

  await new Promise(resolve => setTimeout(resolve, 100));
  console.log(`Mocked fetch for '${type}'`);
  return mockNumbers[type] || [];
}

function updateWindow(newNumbers) {
  const prevState = [...window];

  for (const num of newNumbers) {
    if (!window.includes(num)) {
      window.push(num);
    }
  }

  if (window.length > WINDOW_SIZE) {
    window = window.slice(window.length - WINDOW_SIZE);
  }

  return {
    prevState,
    currState: [...window]
  };
}

app.get("/numbers/:numberid", async (req, res) => {
  const id = req.params.numberid;

  if (!["p", "f", "e", "r"].includes(id)) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const newNumbers = await fetchNumbers(id);
  const { prevState, currState } = updateWindow(newNumbers);

  const avg = currState.length
    ? parseFloat((currState.reduce((a, b) => a + b, 0) / currState.length).toFixed(2))
    : 0;

  res.json({
    windowPrevState: prevState,
    windowCurrState: currState,
    numbers: newNumbers,
    avg: avg
  });
});

app.listen(PORT, () => {
  console.log(`✅ Average Calculator running at http://localhost:${PORT}`);
});
