import * as d3 from 'd3';

export function RadarChart(container, data, colors, widthIndRadar, heightIndRadar) {
  const cfg = {
    w: widthIndRadar,
    h: heightIndRadar,
    levels: 8,
    maxValue: 1,
    labelFactor: 1,
    wrapWidth: 6,
    opacityArea: 0.35,
    dotRadius: 3,
    strokeWidth: 1,
    roundStrokes: true,
    color: d3.scaleOrdinal().range(colors)
  };

  d3.select(container).select('svg').remove();
  const svg = d3.select(container).append('svg')
    .attr('width', cfg.w)
    .attr('height', cfg.h)
    .append('g')
    .attr('transform', `translate(${cfg.w / 2}, ${cfg.h / 2})`);

  const maxValue = cfg.maxValue;

  const allAxis = data[0].map((i) => i.axis),
    total = allAxis.length,
    radius = Math.min(cfg.w / 2, cfg.h / 2),
    Format = d3.format('.0%'),
    angleSlice = Math.PI * 2 / total;

  const rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([0, maxValue]);

  const axisGrid = svg.append("g").attr("class", "axisWrapper");

  axisGrid.selectAll(".levels")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", (d) => radius / cfg.levels * d)
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityArea);

  const axis = axisGrid.selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr("y2", (d, i) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  const radarLine = d3.lineRadial()
    .curve(d3.curveCardinalClosed)
    .radius((d) => rScale(d.value))
    .angle((d, i) => i * angleSlice);

  const radarWrapper = svg.selectAll(".radarWrapper")
    .data(data)
    .enter().append("g")
    .attr("class", "radarWrapper");

  radarWrapper.append("path")
    .attr("class", "radarArea")
    .attr("d", (d) => radarLine(d))
    .style("fill", (d, i) => cfg.color(i))
    .style("fill-opacity", cfg.opacityArea)
    .on('mouseover', function () {
      d3.select(this).style("fill-opacity", 0.7);
    })
    .on('mouseout', function () {
      d3.select(this).style("fill-opacity", cfg.opacityArea);
    });

  radarWrapper.append("path")
    .attr("class", "radarStroke")
    .attr("d", (d) => radarLine(d))
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", (d, i) => cfg.color(i))
    .style("fill", "none");

  radarWrapper.selectAll(".radarCircle")
    .data((d) => d)
    .enter().append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
    .style("fill", (d, i, j) => cfg.color(j))
    .style("fill-opacity", 0.8);

  // Tooltip
  const tooltip = 
    d3.select(container)
    // d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("text-align", "center")
    // .style("background", (d, i) => cfg.color(i))
    .style("width", "33px")
    .style("width", "auto")
    .style("padding", "2px")
    .style("height", "16px")
    .style("height", "auto")
    // .style("border", "0px")
    .style("border-radius", "8px")
    .style("font", "12px sans-serif")
    .style("pointer-events", "none")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center");

  radarWrapper.selectAll(".radarCircle")

    .on('mouseover', function (event, d) {
      const parentData = d3.select(this.parentNode).datum();
      const colorIndex = data.indexOf(parentData);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(Format(d.value))
        .style("background", `${cfg.color(colorIndex)}30`)
        .style("border", "1px solid red")
        .style("border", `1px solid ${cfg.color(colorIndex)}`)
        .style("font-weight", "bold")
        .style("color", "black")
        // .style("left", `${event.pageX + 20}px`)
        // .style("top", `${event.pageY + 30}px`);
        .style("left", `3px`)
        .style("top", `3px`);
    })

    // .on('mouseover', function (event, d) {
    //     tooltip.transition().duration(300).style("opacity", 0.9);
    //     tooltip.html(Format(d.value))
    //         // .style("left", `3px`)
    //         // .style("top", `3px`);
    //         .style("left", (event.pageX + 20) + "px")
    //         .style("top", (event.pageY + 30) + "px");
    // })
    .on('mousemove', function (event) {
        tooltip
          .style("left", `3px`)
          .style("top", `3px`);
          // .style("left", (event.pageX + 20) + "px")
          // .style("top", (event.pageY + 30) + "px");
    })
    .on('mouseout', function () {
        tooltip.transition().duration(500).style("opacity", 0);
    });
}
