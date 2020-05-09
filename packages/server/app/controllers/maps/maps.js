var fetch = require('node-fetch')

//Usage supply source with lat lon and dest with lat lon

var response = require('../../helper/response')
var dist = require('../../helper/distance')

exports.mapsCreateEndpoint = async function(req,res){
    let start = req.query.start
    let end = req.query.end
    let query = "https://api.openrouteservice.org/v2/directions/driving-car?api_key="+ process.env.API_KEY + "&start="+start+"&end="+end
    try{
        const mapsResponse = await fetch(query)
        const json = await mapsResponse.json()
        return res.status(200).send(response.response(
            {
                points: json["features"][0]["geometry"]["coordinates"]
            },
            'Route found!',
            200
        )) 
    }catch(error){
        return res.status(500).send(response.errorResponse(error.toString(), 500))
    }
    
}

exports.mapsDurationEndpoint = async function(req,res){
    let start = req.query.start
    let end = req.query.end
    let query = "https://api.openrouteservice.org/v2/directions/driving-car?api_key="+ process.env.API_KEY + "&start="+start+"&end="+end
    try{
        const mapsResponse = await fetch(query)
        const json = await mapsResponse.json()
        console.log(query)
        return res.status(200).send(response.response(
            {
                distance: json["features"][0]["properties"]["segments"][0]["distance"]
            },
            'Route found!',
            200
        )) 
    }catch(error){
        return res.status(500).send(response.errorResponse(error.toString(), 500))
    }
    
}

exports.mapsTspEndpoint = async function(req,res){
    let start = req.query.start
    let points = req.query.points.split(";")
    let notes = {}
    let dist = []
    for (let i = 0; i < points.length; i++){
        notes[i] =  {
            route:[start],
            distance :0
        }
    }
    try{
        let min = -999
        let finished = false
        let result = -1
        let tempIdx = -1
        for (i in notes){
            if (min == -999 || notes[i]["distance"] < min){
                let query = "https://api.openrouteservice.org/v2/directions/driving-car?api_key="+ process.env.API_KEY + "&start="+start+"&end="+points[parseInt(i)]
                const mapsResponse = await fetch(query)
                const json = await mapsResponse.json()
                notes[i]["route"].push(points[parseInt(i)])
                notes[i]["distance"] += parseFloat(json["features"][0]["properties"]["segments"][0]["distance"])
                if (min == -999 || notes[i]["distance"] < min){
                    min = notes[i]["distance"]
                    tempIdx = i
                }           
            }
        }   
        let arrTemp = points
        while (!finished){
            for (i in notes){
                if (notes[i]["route"].length == points.length+1){
                    tempIdx = i
                    finished = true
                    break
                }
                if (notes[i]["distance"] <= min){
                    for (j in arrTemp){
                        if (notes[i]["route"].indexOf(arrTemp[j]) == -1){
                            let query = "https://api.openrouteservice.org/v2/directions/driving-car?api_key="+ process.env.API_KEY + "&start="+notes[i]["route"][notes[i]["route"].length-1]+"&end="+arrTemp[j]
                            console.log(notes[i]["route"])
                            const mapsResponse = await fetch(query)
                            const json = await mapsResponse.json()
                            notes[i]["route"].push(points[j])
                            //console.log(json)
                            notes[i]["distance"] += parseFloat(json["features"][0]["properties"]["segments"][0]["distance"])
                            min = notes[i]["distance"]
                            for (k in notes){
                                if (notes[k]["distance"] < min){
                                    min = notes[k]["distance"]
                                }
                            }
                            break
                        }
                    }
                }
            }   
        }

        console.log(notes)
        return res.status(200).send(response.response(
            {
                route: notes[tempIdx]["route"],
                temp: tempIdx 
            },
            'Route found!',
            200
        )) 
        
    }catch(error){
        return res.status(500).send(response.errorResponse(error.toString(), 500))
    }
    
}