var fetch = require('node-fetch');

exports.mapsTspEndpoint = async function(startPosition, nodePoints) {
    start = startPosition;
    points = nodePoints.split(';');
    points = [...new Set(points)];
    let notes = {};
    for (let i = 0; i < points.length; i++) {
        notes[i] =  {
            route: [start],
            distance: 0
        };
    }
    let min = -999;
    let finished = false;
    let tempIdx = -1;
    for (i in notes) {
        if (min == -999 || notes[i]['distance'] < min) {
            let query = 'https://api.openrouteservice.org/v2/directions/driving-car?api_key='+ process.env.API_KEY + '&start='+start+'&end='+points[parseInt(i)];
            const mapsResponse = await fetch(query);
            const json = await mapsResponse.json();
            if (json['error'] != null) {
                console.log(json['error']);
                return null;
            }
            notes[i]['route'].push(points[parseInt(i)]);
            notes[i]['distance'] += parseFloat(json['features'][0]['properties']['segments'][0]['distance']);
            if (min == -999 || notes[i]['distance'] < min) {
                min = notes[i]['distance'];
                tempIdx = i;
            }
        }
    }
    let arrTemp = points;
    while (!finished) {
        for (i in notes) {
            if (notes[i]['route'].length == points.length+1) {
                tempIdx = i;
                finished = true;
                break;
            }
            if (notes[i]['distance'] <= min) {
                for (j in arrTemp){
                    if (notes[i]['route'].indexOf(arrTemp[j]) == -1){
                        let query = 'https://api.openrouteservice.org/v2/directions/driving-car?api_key='+ process.env.API_KEY + '&start='+notes[i]['route'][notes[i]['route'].length-1]+'&end='+arrTemp[j];
                        console.log(notes[i]['route']);
                        const mapsResponse = await fetch(query);
                        const json = await mapsResponse.json();
                        notes[i]['route'].push(points[j]);
                        notes[i]['distance'] += parseFloat(json['features'][0]['properties']['segments'][0]['distance']);
                        min = notes[i]['distance'];
                        for (k in notes){
                            if (notes[k]['distance'] < min){
                                min = notes[k]['distance'];
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    return {
        route: notes[tempIdx]['route'],
        temp: tempIdx 
    };
}