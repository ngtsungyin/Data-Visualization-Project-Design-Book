// visualisation4.js
// Q4 — Age-group patterns (bar chart + heatmap) with per-group colors + legend

d3.csv("data/visualisation4.csv").then(data => {
  data.forEach(d => {
    d.Total_Fines = +d.Total_Fines;
  });

  const ages = data.map(d => d.AGE_GROUP);
  const values = data.map(d => d.Total_Fines);

  // ===== BAR CHART =====
  const margin = { top: 30, right: 20, bottom: 120, left: 80 };
  const width = 520 - margin.left - margin.right;
  const height = 420 - margin.top - margin.bottom;

  const svgBar = d3.select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 80) // extra space for legend
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(ages)
    .range([0, width])
    .padding(0.25);

  const y = d3.scaleLinear()
    .domain([0, d3.max(values)])
    .range([height, 0])
    .nice();

  svgBar.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(0,8) rotate(-0)")
    .style("text-anchor", "middle");

  svgBar.append("g")
    .call(d3.axisLeft(y).ticks(6).tickFormat(d3.format(",")));

  // color mapping (distinct color per age group)
  const colorMap = {
    "0-16": "#7FB069",
    "17-25": "#F4A261",
    "26-39": "#E76F51",
    "40-64": "#9B2C2C",
    "65 and over": "#A66DA6"
  };
  // fallback for any unexpected age group
  const colorScale = d => colorMap[d] || "#6FA8DC";

  // Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "dv-tooltip")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("padding", "10px")
    .style("border-radius", "8px")
    .style("box-shadow", "0 8px 30px rgba(0,0,0,0.12)")
    .style("pointer-events", "none")
    .style("display", "none")
    .style("font-size", "14px");

  svgBar.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.AGE_GROUP))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.Total_Fines))
    .attr("height", d => height - y(d.Total_Fines))
    .attr("fill", d => colorScale(d.AGE_GROUP))
    .style("cursor", "pointer")
    .on("mousemove", (event, d) => {
      tooltip.style("display", "block")
        .html(`
          <strong style="font-size:15px">${d.AGE_GROUP}</strong>
          <div style="margin-top:6px">Fines: ${d3.format(",")(d.Total_Fines)}</div>
        `)
        .style("left", (event.pageX + 14) + "px")
        .style("top", (event.pageY + 14) + "px");
    })
    .on("mouseout", () => tooltip.style("display", "none"));

  // value labels on bars (optional)
  svgBar.selectAll(".val-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "val-label")
    .attr("x", d => x(d.AGE_GROUP) + x.bandwidth() / 2)
    .attr("y", d => y(d.Total_Fines) - 8)
    .attr("text-anchor", "middle")
    .text(d => d3.format(",")(d.Total_Fines))
    .style("font-size", "12px")
    .style("fill", "#333");

  // ===== LEGEND =====
  const legend = svgBar.append("g")
    .attr("transform", `translate(0, ${height + 40})`);

  const legendItemSize = 14;
  const legendSpacing = 18;

  ages.forEach((age, i) => {
    const g = legend.append("g")
      .attr("transform", `translate(${i * 120}, 0)`);

    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", legendItemSize)
      .attr("height", legendItemSize)
      .attr("fill", colorScale(age))
      .attr("rx", 3);

    g.append("text")
      .attr("x", legendItemSize + 8)
      .attr("y", legendItemSize - 2)
      .text(age)
      .style("font-size", "13px")
      .style("fill", "#333");
  });

  // ===== HEATMAP =====
  const hmW = 280, hmH = 360;
  const rowH = hmH / ages.length;

  const svgHM = d3.select("#heatmap")
    .append("svg")
    .attr("width", hmW + 120)
    .attr("height", hmH + 80)
    .append("g")
    .attr("transform", "translate(60,40)");

  // color scale for heatmap (use same palette but gradient based on value)
  const hmColor = d3.scaleLinear()
    .domain([0, d3.max(values)])
    .range(["#fff5f0", "#7f0000"]);

  svgHM.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * rowH)
    .attr("width", hmW)
    .attr("height", rowH - 8)
    .attr("fill", d => hmColor(d.Total_Fines))
    .style("cursor", "pointer")
    .on("mousemove", (event, d) => {
      tooltip.style("display", "block")
        .html(`
          <strong style="font-size:15px">${d.AGE_GROUP}</strong>
          <div style="margin-top:6px">Fines: ${d3.format(",")(d.Total_Fines)}</div>
        `)
        .style("left", (event.pageX + 14) + "px")
        .style("top", (event.pageY + 14) + "px");
    })
    .on("mouseout", () => tooltip.style("display", "none"));

  svgHM.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", -14)
    .attr("y", (d, i) => i * rowH + rowH / 2)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .text(d => d.AGE_GROUP)
    .style("font-size", "14px");

  svgHM.append("text")
    .attr("x", hmW / 2)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .text("Heatmap — Age Groups");

});
