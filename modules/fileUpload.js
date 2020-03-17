'use strict'


const fileUploadLocal = document.querySelector('#image-upload-local');
const fileUploadForm = document.querySelector('#upload-form');
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext("2d");

// file upload  event listeners
// on local and web file input read data and load image to canvas
fileUploadLocal.onchange = readImage;
fileUploadForm.addEventListener('submit', webUpload);
document.querySelector('#upload-form button').addEventListener('dblclick', resetDomToDefault);


// this function copied from Stack Overflow for the most part
// https://stackoverflow.com/a/42614316
function readImage() {
    resetAllEditControlsValues();
    removeDefaultText();
    if ( this.files && this.files[0] ) {
        // was not familiar with FileReader or creating Image objects like this
        const FR= new FileReader();
        FR.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
           
            img.onload = function() {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                IMAGE = img;
                paintImage();
                document.querySelector("#image-upload-web").value = "";
            };
        };       
        FR.readAsDataURL( this.files[0] );
    }
}

// for uploading web links to images. If blank works as reset.
function webUpload(e, link) {
    e.preventDefault();
    resetAllEditControlsValues();
    if (!link) removeDefaultText();

    const webLink = link || document.querySelector('#image-upload-web').value;
    // if blank paint last image
    if (!webLink) {
        paintImage();
        return;
    }
    const img = new Image();
    toDataURL(webLink, (dataUrl) => img.src = dataUrl);
    img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        IMAGE = img;
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