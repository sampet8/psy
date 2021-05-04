if (!(window.FileList && window.File && window.FileReader)) console.log("File upload is ot supported!")

const input = document.getElementById("data");
const img = document.getElementById("photo");
const output = document.getElementById("output");
const img_data = document.getElementById("img_data");

const url = "https://dogsbreed.cognitiveservices.azure.com/customvision/v3.0/Prediction/4a1302fa-9fb3-4a84-90b4-a3a45eb5ac14/classify/iterations/Iteration4/image";
const prediction_key = "30439904b8a0492189823c6513ed8447";


const sendRequest = (data) => {
    var parts = data.split(';base64,');
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    var imgContent = new Blob([uInt8Array], { type: contentType });

    fetch(url, {
        method: 'POST',
        headers: {
            'Prediction-Key': prediction_key,
            'Content-Type': 'application/octet-stream'
        },
        body: imgContent
    })
        .then(res => res.json())
        .then(data => {
            const prediction = data.predictions[0];
            output.innerText += `${prediction.tagName} : ${prediction.probability * 100}%`
        })
        .catch((err) => console.error(err));
}



function readImage(file) {
    if (file.type && !file.type.startsWith('image/')) {
        console.log('File is not an image.', file.type, file);
        return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        const loadedFile = event.target.result;
        img.src = loadedFile;
        img.hidden = false;
        sendRequest(loadedFile);
    });
    reader.readAsDataURL(file);
}



input.addEventListener("change", (e) => {
    const files = e.target.files;
    if (files.length != 1) return;

    img.hidden = true;
    img.src = "";
    output.innerHTML = "";

    img_data.innerHTML = "";
    img_data.innerHTML = files[0].name + "<br>" + files[0].size;

    readImage(files[0]);
})

