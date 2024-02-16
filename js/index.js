var ram_capacity = 16;
var ram_used = 0;
var ram_usage = 70;
var ram_balance = 100 - ram_usage;

// ramCapacity.innerText = ram_capacity + "GB";
// ramUsed.innerText = (ram_usage / 100) * ram_capacity + "GB";

var previousCPU = null;

//Number of processor in the system==================
console.log(
  `Number of processor in the system ${navigator.hardwareConcurrency}`
);
//System CPU and RAM processing monitoring ==========================

function SysStat() {
  // RAM Load ================================

  chrome.system.memory.getInfo(function (info) {
    ram_usage =
      100 - Math.round((info.availableCapacity / info.capacity) * 100);
    ram_capacity = parseInt(info.capacity / 1000000000);
    console.log(`RAM capacity ${ram_capacity}`);
    console.log(`RAM usage ${ram_usage}%`);
  });
}

// Ram Data ======================================
const ram_data = {
  labels: ["Mon", "Tue"],
  datasets: [
    {
      label: "Weekly Sales",
      data: [ram_usage, ram_balance],
      backgroundColor: ["#209E91", "rgba(0, 0, 0, 0.2)"],
      borderColor: ["#209E91", "rgba(0, 0, 0, 0.2)"],
      borderWidth: 1,
      cutout: "70%",
      circumference: 180,
      rotation: 270,
    },
  ],
};
// plugin block
const gaugeChartText = {
  id: "gaugeChartText",
  afterDatasetsDraw(chart, args, pluginOptions) {
    const {
      ctx,
      data,
      chartArea: { top, bottom, left, right, width, height },
      scales: { r },
    } = chart;

    ctx.save();
    const xcord = chart.getDatasetMeta(0).data[0].x;
    const ycord = chart.getDatasetMeta(0).data[0].y;

    // ctx.fillRect(xcord, ycord, 400, 1);
    ctx.font = "15px sans-serif";
    ctx.fillStyle = "white";
    // ctx.fillText("0%", left + 12, ycord + 20);
    ctx.textAlign = "right";
    // ctx.fillText("100%", right, ycord + 20);
    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${ram_usage}%`, xcord, ycord);
  },
};
// config
const ramChart = {
  type: "doughnut",
  data: ram_data,
  options: {
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  },
  plugins: [gaugeChartText],
};

// render init block
const myChart = new Chart(document.getElementById("ram-chart"), ramChart);

// Define a function to update chart data
function updateChartData() {
  // document.getElementById("ramUsed").innerHTML = ram_usage;
  ramCapacity.innerText = ram_capacity + "GB";
  ramUsed.innerText = (ram_usage / 100) * ram_capacity + "GB";
  myChart.data.datasets[0].data = [ram_usage, 100 - ram_usage];
  myChart.update();
}

// CPU and RAM Load trigger ===============================
setInterval(function () {
  SysStat();
  updateChartData();
}, 500);
