exports = function (changeEvent) {

    var axios = require('axios');
    // CHANGE THE URL WITH YOU EC2 HOST ACCORDINGLY
    var host = "https://7b4b-45-198-5-93.ngrok.io";
    var path = "/item/added/atlas";
    axios.post(host + path, changeEvent.fullDocument)
        .then(resp => { console.log(resp); })
        .catch(err => { console.error(err) });

}