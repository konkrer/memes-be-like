'use strict'


const fileUploadLocal = document.querySelector('#image-upload-local');
const fileUploadForm = document.querySelector('#upload-form');
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext("2d");

// file upload  event listeners
// on local and web file input read data and load image to canvas
fileUploadLocal.onchange = readImage;
fileUploadForm.addEventListener('submit', webUpload);


// this function copied from Stack Overflow for the most part
// https://stackoverflow.com/a/42614316
function readImage() {
    resetAllEditControlsValues();
    if ( this.files && this.files[0] ) {
        // was not familiar with FileReader or creating Image objects like this
        const FR= new FileReader();
        FR.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
           
            img.onload = function() {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                image = img;
                paintImage();
                document.querySelector("#image-upload-web").value = "";
            };
        };       
        FR.readAsDataURL( this.files[0] );
    }
}


function webUpload(e, link) {
    e.preventDefault();
    resetAllEditControlsValues();
    
    const webLink = link || document.querySelector('#image-upload-web').value;
    if (!webLink) return;

    const img = new Image();
    toDataURL(webLink, (dataUrl) => img.src = dataUrl);
    img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        image = img;
        paintImage();
        fileUploadLocal.value = "";
    }
}


function toDataURL(url, callback){

    let xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'blob';
    xhr.onload = function(){
      let fr = new FileReader();
    
      fr.onload = function(){
        callback(this.result);
      };
    
      fr.readAsDataURL(xhr.response); // async call
    };

    xhr.send();
}