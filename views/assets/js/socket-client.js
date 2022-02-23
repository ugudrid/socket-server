/**
 * @NOTE
 * Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
 * It takes the following options when connection
 * forceNew. Default value: false. Whether to create a new Manager instance. ...
 * multiplex. Default value: true. ...
 * transports. Default value: ["polling", "websocket"] ...
 * upgrade. Default value: true. ...
 * rememberUpgrade. Default value: false. ...
 * path. Default value: /socket.io/ ...
 * query. Default value: - ...
 * extraHeaders. Default value: -
 * 
 * Visit the following URL for more detailed explanation
 * https://socket.io/docs/v4/client-options/
 */
var socket;

function INIT() {

    document.getElementById('btnJoin').addEventListener('click', async (e) => {
        e.preventDefault();
        await join();
    })

}

async function join() {
    let formData = new FormData(contactForm);
    let uname = formData.get('uname');
    let group = formData.get('group');
    // let result = await XMLHttpRequestPromise('POST', '/register/user', { uname: uname, group: group })
    socket = io({ query: `userid=${uname}&group=${group}` });

    socket.on('connect', function () {
        console.log('Connected');
        contactForm.classList.add('hide');
        document.getElementById('groupName').innerText = group;
        document.getElementById('userID').innerText = uname;

        document.getElementById('lobby').classList.remove('hide');
        // Send ehlo event right after connect:
    });

    socket.on('item_added', function (data) {
        /**
         * We will display the message for Item Added on the sceen in this event
         */
        console.log(data);
        document.getElementById('itemlist').innerHTML += `<label for="uname"><b>ItemName: </b><span>${data.item}</span></label> <br>`;


    })

}


async function XMLHttpRequestPromise(type, url, data) {
    return new Promise((resolve, reject) => {

        let http = new XMLHttpRequest();
        http.open(type, url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/json');

        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                resolve(http.response);
            }
            if (http.readyState == 4 && http.status >= 400) {
                reject(http.response);
            }
        }
        http.send(JSON.stringify(data));
    })
}

INIT();