plotlyDiv = document.getElementById('graph');

function zoomGraph(){
    plotDiv.on('plotly_selected', (eventData) => {
        console.log(eventData)
    
    });
}