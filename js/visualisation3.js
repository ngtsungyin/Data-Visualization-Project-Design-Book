// visualisation3.js
// Load data and build charts with larger hover zones, vertical guideline, tooltip and legend

const margin = { top: 40, right: 140, bottom: 40, left: 60 }; // leave space on right for legend
const width = 900 - margin.left - margin.right;
const height = 420 - margin.top - margin.bottom;

const container = d3.select("#chart");

const svg = container
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("overflow", "visible")
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip (absolute div)
const tooltip = container
  .append("div")
  .attr("class", "dv-tooltip")
  .style("position", "absolute")
  .style("background", "white")
  .style("padding", "8px 12px")
  .style("border", "1px solid rgba(0,0,0,0.12)")
  .style("border-radius", "6px")
  .style("pointer-events", "none")
  .style("font-size", "13px")
  .style("box-shadow", "0 6px 18px rgba(0,0,0,0.08)")
  .style("opacity", 0);

// vertical guideline
const guideline = svg
  .append("line")
  .attr("class", "dv-guideline")
  .attr("y1", 0)
  .attr("y2", height)
  .attr("stroke", "rgba(0,0,0,0.12)")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", "3 3")
  .style("opacity", 0);

// legend container (we'll draw inside updateChart)
const legendG = svg.append("g").attr("class", "legend-group");

d3.csv("data/visualisation3.csv").then((data) => {
  data.forEach((d) => {
    d.YEAR = +d.YEAR;
    d.Camera_Issued = +d.Camera_Issued;
    d.Police_Issued = +d.Police_Issued;
  });

  // sort by year just in case
  data.sort((a, b) => a.YEAR - b.YEAR);

  let mode = "stacked"; // 'stacked' or 'line'
  let percentMode = false;

  function updateChart() {
    svg.selectAll(".plot-group").remove();
    legendG.selectAll("*").remove();

    // prepare plot data
    const plotData = data.map((d) => {
      const total = d.Camera_Issued + d.Police_Issued;
      return {
        YEAR: d.YEAR,
        Camera: percentMode ? (total ? d.Camera_Issued / total : 0) : d.Camera_Issued,
        Police: percentMode ? (total ? d.Police_Issued / total : 0) : d.Police_Issued,
        rawCamera: d.Camera_Issued,
        rawPolice: d.Police_Issued,
        totalRaw: total
      };
    });

    const x = d3
      .scaleLinear()
      .domain(d3.extent(plotData, (d) => d.YEAR))
      .range([0, width]);

    const yMax = percentMode ? 1 : d3.max(plotData, (d) => d.Camera + d.Police);

    const y = d3.scaleLinear().domain([0, yMax]).nice().range([height, 0]);

    // axes
    svg
      .append("g")
      .attr("class", "plot-group")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(plotData.length).tickFormat(d3.format("d")));

    svg
      .append("g")
      .attr("class", "plot-group")
      .call(
        d3
          .axisLeft(y)
          .ticks(6)
          .tickFormat((v) => (percentMode ? (v * 100).toFixed(0) + "%" : v))
      );

    const color = d3.scaleOrdinal().domain(["Camera", "Police"]).range(["#4C8CF5", "#E35B5B"]);

    // plot group
    const plotG = svg.append("g").attr("class", "plot-group");

    // stacked area
    if (mode === "stacked") {
      const stack = d3.stack().keys(["Camera", "Police"]);
      const stacked = stack(plotData);

      const area = d3
        .area()
        .x((d) => x(d.data.YEAR))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]));

      plotG
        .selectAll(".layer")
        .data(stacked)
        .enter()
        .append("path")
        .attr("class", "layer")
        .attr("d", area)
        .attr("fill", (d) => color(d.key))
        .attr("opacity", 0.85);
    }

    // multiline
    if (mode === "line") {
      const line = d3
        .line()
        .x((d) => x(d.YEAR))
        .y((d) => y(d.value))
        .curve(d3.curveMonotoneX);

      ["Camera", "Police"].forEach((key) => {
        plotG
          .append("path")
          .datum(
            plotData.map((d) => ({
              YEAR: d.YEAR,
              value: d[key],
              rawCamera: d.rawCamera,
              rawPolice: d.rawPolice,
              totalRaw: d.totalRaw
            }))
          )
          .attr("fill", "none")
          .attr("stroke", color(key))
          .attr("stroke-width", 2.2)
          .attr("d", line);
      });
    }

    // --- LARGER HOVER AREAS (overlay strips) ---
    // compute midpoints between adjacent x positions to set overlay widths
    const xs = plotData.map((d) => x(d.YEAR));
    const midpoints = [];
    for (let i = 0; i < xs.length - 1; i++) {
      midpoints.push((xs[i] + xs[i + 1]) / 2);
    }
    // left edge for first, right edge for last
    const overlays = [];
    for (let i = 0; i < xs.length; i++) {
      const left = i === 0 ? 0 : midpoints[i - 1];
      const right = i === xs.length - 1 ? width : midpoints[i];
      overlays.push({ i, left, right, data: plotData[i] });
    }

    // transparent overlay group
    const overlayG = svg.append("g").attr("class", "overlay-group");

    overlayG
      .selectAll("rect.overlay")
      .data(overlays)
      .enter()
      .append("rect")
      .attr("class", "overlay")
      .attr("x", (d) => d.left)
      .attr("y", 0)
      .attr("width", (d) => Math.max(2, d.right - d.left))
      .attr("height", height)
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("mousemove", function (event, d) {
        // show guideline at the exact mouse x (or centre of overlay)
        const [mx] = d3.pointer(event, svg.node());
        guideline.attr("x1", mx).attr("x2", mx).style("opacity", 1);

        // position tooltip near mouse but keep within viewport
        const page = container.node().getBoundingClientRect();
        const mousePageX = event.pageX;
        const mousePageY = event.pageY;

        // build tooltip content
        const dd = d.data;
        let camText = percentMode ? (dd.Camera * 100).toFixed(1) + "%" : dd.rawCamera.toLocaleString();
        let polText = percentMode ? (dd.Police * 100).toFixed(1) + "%" : dd.rawPolice.toLocaleString();

        tooltip
          .style("opacity", 1)
          .html(`<strong>${dd.YEAR}</strong><br>Camera: ${camText}<br>Police: ${polText}`)
          // prefer right side of cursor, but if near right edge, place left
          .style("left", Math.min(mousePageX + 18, page.right - 220) + "px")
          .style("top", Math.max(mousePageY - 40, page.top + 6) + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("opacity", 0);
        guideline.style("opacity", 0);
      });

    // --- LEGEND (top-right, inside svg) ---
    const legendItems = ["Camera", "Police"];
    const legendX = width + 20; // relative to svg group
    const legendY = 6;
    const itemGap = 28;
    const sw = 14; // swatch width

    const legend = legendG
      .attr("transform", `translate(${legendX}, ${legendY})`)
      .selectAll(".legend-item")
      .data(legendItems)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * itemGap})`);

    legend
      .append("rect")
      .attr("width", sw)
      .attr("height", sw)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("fill", (d) => color(d));

    legend
      .append("text")
      .attr("x", sw + 10)
      .attr("y", sw / 2)
      .attr("dy", "0.35em")
      .style("font-size", "13px")
      .text((d) => d + (percentMode ? " (%)" : ""));

    // optional: legend subtitle showing units
    legendG
      .append("text")
      .attr("x", legendX)
      .attr("y", legendY + legendItems.length * itemGap + 12)
      .style("font-size", "12px")
      .style("fill", "rgba(0,0,0,0.6)")
      .text(percentMode ? "Values shown as % of year total" : "Values shown as absolute counts");

  } // end updateChart

  // initial draw
  updateChart();

  // controls (assuming these IDs exist on page)
  d3.select("#btn-stacked").on("click", () => {
    mode = "stacked";
    updateChart();
  });

  d3.select("#btn-line").on("click", () => {
    mode = "line";
    updateChart();
  });

  d3.select("#percentMode").on("change", function () {
    percentMode = this.checked;
    updateChart();
  });
});
