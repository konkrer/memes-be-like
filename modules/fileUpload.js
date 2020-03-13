'use strict'


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
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                image = img;
                document.querySelector("#image-upload-web").value = "";
            };
        };       
        FR.readAsDataURL( this.files[0] );
    }
}


function webUpload(e) {
    e.preventDefault();
    resetAllEditControlsValues();
    const webLink = document.querySelector('#image-upload-web').value;
    const img = new Image();
    img.src = webLink;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        image = img;
        fileUploadLocal.value = "";
    }
}