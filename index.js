// x - axis -> salary
// y - axis -> headcount
// z - axis -> compratio
// title

// origin - avg of x values and y values
// z-index -> z value

// minX, maxY ->  left, bottom ~ 0 0

// get width in px
// ratio = screen width / (max x value - min)
// postion left -> ratio * x value

// get height in px
// ratio = screen height / (max y value - min)
// postion bottom -> ratio * y value

function CreateQuad() {
  const api_url = "https://mocki.io/v1/18936d28-2f79-4840-b146-5622e8ad1e77";
  var apiData,
    rootElement,
    minX = Infinity,
    minY = Infinity,
    maxX = 0,
    maxY = 0,
    avgX,
    avgY,
    xRatio,
    yRatio
    ;

  var init = function (rootElm) {
    rootElement = rootElm;
    window.addEventListener("resize", updateWithResize);
  };

  var getApiData = function () {
    const api = fetch(api_url);
    api
      .then((data) => {
        data
          .json()
          .then((jsonData) => {
            apiData = jsonData;
            console.log("API Data -> ", apiData);
            getAxisData(apiData);
            createTemplate();
          })
          .catch((error) => console.error("Error in parsing data", error));
      })
      .catch((error) => console.error("Error in fetching data => ", error));
  };

  var getAxisData = function (dataArr) {
    let sumX = 0,
      sumY = 0;
    for (let data of dataArr) {
      sumX += data.salary;
      sumY += data.headcount;
      minX = Math.min(minX, data.salary);
      minY = Math.min(minX, data.headcount);

      maxX = Math.max(maxX, data.salary);
      maxY = Math.max(maxY, data.headcount);
    }
    avgX = Math.floor(sumX / dataArr.length);
    avgY = Math.floor(sumY / dataArr.length);

    console.log(minX, maxX, minY, maxY, avgX, avgY);
  };

  var createTemplate = function () {
    getScreenRatio();
    const xAxis = document.createElement("div");
    xAxis.classList.add("x-axis");
    const yAxis = document.createElement("div");
    yAxis.classList.add("y-axis");

    rootElement.appendChild(xAxis);
    rootElement.appendChild(yAxis);
    for (let data of apiData) {
      const bubble = document.createElement("div");
      bubble.classList.add("bubble");
      bubble.innerHTML = data.title;
      bubble.style.zIndex = data.compratio;
      const bottomPos = yRatio * (data.headcount - minY);
      bubble.style.bottom = `${bottomPos}px`;
      let leftPos = xRatio * (data.salary - minX);
      if (data.salary === maxX) {
        leftPos -= data.compratio;
      }
      bubble.style.left = `${leftPos}px`;
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      bubble.style.background = `#${randomColor}`;
      bubble.style.height = `${data.compratio}px`
      bubble.style.width = `${data.compratio}px`;
      rootElement.appendChild(bubble);
    }
  };

  var getScreenRatio = function() {
    const viewPort_height = window.innerHeight;
    const viewPort_width = window.innerWidth;
    xRatio = Math.floor(viewPort_width / (maxX - minX));
    yRatio = Math.floor(viewPort_height / (maxY - minY));
  };

  var drawChart = function () {
    getApiData();
  };

  var updateWithResize = function () {
    getScreenRatio();
    rootElement.innerHTML = "";
    createTemplate();
  };

  var destroy = function() {
    window.removeEventListener("resize");
  }


  return {
    init,
    drawChart,
    destroy
  };
}

const rootElm = document.getElementById("root-elm");

if (rootElm) {
  const createQuad = CreateQuad();
  createQuad.init(rootElm);
  createQuad.drawChart();
}
