const width = 800
const height = 400
const margin = {
    top: 10,
    bottom: 40, 
    left: 40,
    right: 10
};

const svg = d3.select("div#chart").append("svg").attr("width", width).attr("height", height);
const elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`);
const axisGroup = svg.append("g").attr("id", "axisGroup");
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`);
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1); // Dimensiones eje x (el tamaño del "papel" donde se representa)
const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]); // Dimensiones eje y (el tamaño del "papel" donde se representa). Utilizamos scaleBand porque da 
// los valores discretos (los nombres de los paises, que no son continuos sino discretos). Padding da un porcentaje de separación entre barras (del 0 al 1)    

const xAxis = d3.axisBottom().scale(x);
const yAxis = d3.axisLeft().scale(y);

d3.csv("WorldCup.csv").then(data => {
    console.log(data)
    data.map(d => {
        d.Year = +d.Year
    });

    let nest = d3.nest() // esta función permite agrupar en conjuntos, en este caso por nombre. Agrupamos por nombre y le pasamos una entrada de datos 
        .key(d => d.Winner) // Agrupamos
        .entries(data); // Pasamos entrada de datos
    
    console.log(nest);

    const xLabel = elementGroup.append("text").text("Equipo")
        .attr("transform", `translate(${width - margin.right - 45}, ${height - margin.bottom + 25})`)
        .attr("text-anchor", "end");

    const yLabel = elementGroup.append("text").text("N° Mundiales")
        .attr("transform", `translate(${20}, ${95}) rotate(-90)`);
    
    x.domain(nest.map(d => d.key)); 
    y.domain([0, d3.max(nest, function(d) { return d.values.length})]);
    
    yAxis.ticks(y.domain()[1])
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
    
    let mundiales = elementGroup.selectAll("rect").data(nest)
    mundiales.enter()
        .append("rect")
        .attr("fill", "#87CEFA")
        .attr("class", "mundial")
        .attr("x", d => x(d.key))
        .attr("width", x.bandwidth()) 
        .attr("height", d => height - margin.top - margin.bottom - y(d.values.length))
        .attr("y", d => y(d.values.length))
});
