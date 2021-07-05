// Register DOM
document.addEventListener("DOMContentLoaded", init, false);

// function for DOM
function init() {
  const currentData = {
    pairs: [],
    slope: 0,
    coeficient: 0,
    line: [],
  };
  // get update graph button class
  const btnUpdateGraph = document.querySelector(".btn-update-graph");
  // get table class
  const tablePairs = document.querySelector(".table-pairs");
  // get formula class
  const spanFormula = document.querySelector(".span-formula");

  // get input x class
  const inputX = document.querySelector(".input-x");
  // get input y class
  const inputY = document.querySelector(".input-y");

  // initiate chart
  const chart = initChart();

  // function for get x and y value then operate them
  btnUpdateGraph.addEventListener("click", () => {
    const x = parseFloat(inputX.value);
    const y = parseFloat(inputY.value);

    updateTable(x, y);
    updateFormula(x, y);

    updateChart();

    clearInputs();
  });

  // update chart based on formula
  function updateChart() {
    chart.data.datasets[0].data = currentData.pairs;
    chart.data.datasets[1].data = currentData.line;

    chart.update();
  }

  // this is all the calculation take part
  function updateFormula(x, y) {
    // push new input (in form of object) to "pairs array"
    // 1 element of "pairs array" will contain: x, y, xy, xy^2
    currentData.pairs.push({
      x,
      y,
      xy: x * y,
      squareX: x ** 2,
    });

    // count the data
    const pairsAmount = currentData.pairs.length;

    // sum of x, y, xy, xy^2  in "pairs array"
    const sum = currentData.pairs.reduce(
      (prevValues, currentValues) => ({
        x: prevValues.x + currentValues.x,
        y: prevValues.y + currentValues.y,
        xy: prevValues.xy + currentValues.xy,
        squareX: prevValues.squareX + currentValues.squareX,
      }),
      {
        // initial value
        x: 0,
        y: 0,
        xy: 0,
        squareX: 0,
      }
    );

    // calculate the average (mean) of x and y
    const average = {
      x: sum.x / pairsAmount,
      y: sum.y / pairsAmount,
    };

    // calculate the slopeDividend = (nΣ(xy) – Σ(x)*Σ(y))
    const slopeDividend = currentData.pairs.reduce(
      () => parseFloat(pairsAmount * sum.xy - sum.x * sum.y),
      0
    );

    // calculate the slopeDividend = (nΣ(x^2)-Σ(x)^2)
    const slopeDivisor = currentData.pairs.reduce(
      () => parseFloat(pairsAmount * sum.squareX - sum.x ** 2),
      0
    );

    // calculate slope = m = b
    const slope =
      slopeDivisor !== 0 ? parseFloat(slopeDividend / slopeDivisor) : 0;

    // calculate coeficient = c = a
    const coeficient = parseFloat((average.y - slope * average.x).toFixed(3));

    // calculate the line equation (y = mx + c or y = bx + a)
    currentData.line = currentData.pairs.map((pair) => ({
      x: pair.x,
      y: parseFloat((slope * pair.x + coeficient).toFixed(3)),
    }));
    spanFormula.innerHTML = `Formula: y = ${parseFloat(slope).toFixed(
      3
    )} * x + ${coeficient}`;
  }

  // update table every time there's a new input
  function updateTable(x, y) {
    const tr = document.createElement("tr");
    const tdX = document.createElement("td");
    const tdY = document.createElement("td");

    tdX.innerHTML = x;
    tdY.innerHTML = y;

    tr.appendChild(tdX);
    tr.appendChild(tdY);

    tablePairs.querySelector("tbody").appendChild(tr);
  }

  // clear inputs
  function clearInputs() {
    inputX.value = "";
    inputY.value = "";
  }

  // generate the chart
  function initChart() {
    const ctx = document.getElementById("myChart").getContext("2d");

    return new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Scatter Dataset (Actual)",
            backgroundColor: "rgb(125,67,120)",
            data: [],
          },
          {
            label: "Line Dataset (Prediction)",
            fill: false,
            data: [],
            type: "line",
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              type: "linear",
              position: "bottom",
              display: true,
              scaleLabel: {
                display: true,
                labelString: "(X)",
              },
            },
          ],
          yAxes: [
            {
              type: "linear",
              position: "bottom",
              display: true,
              scaleLabel: {
                display: true,
                labelString: "(Y)",
              },
            },
          ],
        },
      },
    });
  }
}
