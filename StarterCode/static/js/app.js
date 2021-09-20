function buildMeta(sample){
    d3.json('../samples.json').then((data)=>{
        var sample_meta = data.metadata;
        var results = sample_meta.filter(sampleObject => sampleObject.id==sample);
        var result = results[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value])=>{
            panel.append("h6").text(`${key.toUpperCase()}:${value}`);
        });
    });
}

function buildCharts(sample){
    d3.json('../samples.json').then((data)=>{
        var samples = data.samples;
        var results = samples.filter(sampleObject => sampleObject.id==sample);
        var result = results[0];
        var otu_ids=result.otu_ids
        var otu_labels=result.otu_labels
        var sample_values=result.sample_values
        // build var chart (horizontal)

        var yticks = otu_ids.slice(0,10).map(x=>`OTU ${x}`).reverse();
        var barData = [{y:yticks,
                        x: sample_values.slice(0,10).reverse(),
                        text: otu_labels.slice(0,10).reverse(),
                        type: "bar",
                        orientation:"h",
                        }];
        var barLayout = {title: "Top 10 Bacteria Cultures Found",
                        margin: {t:30, l:150}};
        Plotly.newPlot("bar",barData,barLayout); 
console.log(samples[0].otu_ids)
        // build bubble chart
        var data_bubble = [{
            x: samples[0].otu_ids,
            y: samples[0].sample_values,
            text:samples[0].otu_labels.slice(0,10),
            mode: 'markers',
            marker: {
              size: samples[0].sample_values,
              color: samples[0].otu_ids
            }
          }];
          var layout_bubble = {
            title:{
              text: ` OTU IDs and Corresponding Sample Values`
            } ,
            xaxis: {
              title: `OTU ID`
            },
            yaxis: {
              title: `Sample Value`
            }
          };
      
          Plotly.newPlot('bubble', data_bubble,layout_bubble);
        
        
        
    });
}

function updatePage(){
	var dropdown=d3.selectAll('#selDataset');
	d3.json('../samples.json').then((data)=>{
    var sample_names = data.names
	sample_names.forEach((name)=>{
	dropdown.append('option').text(name).property('value', name);
	});
    var firstSample = sample_names[0];
    buildCharts(firstSample);
    buildMeta(firstSample);
	});
}

function optionChanged(newSample){
    buildCharts(newSample);
    buildMeta(newSample);
}
updatePage();


