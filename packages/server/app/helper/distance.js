var fetch = require('node-fetch')

exports.getDistance = async function(start, end){
    let query = "https://api.openrouteservice.org/v2/directions/driving-car?api_key="+ process.env.API_KEY + "&start="+start+"&end="+end
    try{
        const mapsResponse = await fetch(query)
        const json = await mapsResponse.json()
        console.log(query)
        return {
            distance: json["features"][0]["properties"]["segments"][0]["distance"]
        } 
    }catch(error){
        return error
    }
}