require('dotenv');

module.exports = wetherRequest = async (location) => {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WETHER_API_KEY}&q=${location}&aqi=no`);

        if(response.ok) {
            const res = await response.json();

            return {
                location: res.location.name,
                region: res.location.region,
                country: res.location.country,
                locationTime: res.location.localtime,
                temp_c: res.current.temp_c,
                cloud: res.current.cloud
            }
        }
        else{
            console.log('error');
        }
}
