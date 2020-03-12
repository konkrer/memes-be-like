'use strict'



// display image variables
const fileUploadWeb = document.querySelector('#upload-zone');
const fileUploadLocal  = document.querySelector('#image-upload-local');
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext("2d");
insertDefaultText();

// editing data variables
let image, topCrop = 0, bottomCrop = 0, leftCrop = 0, rightCrop = 0;
let currCanvasSizeBase = [1, 1];
let scaleFactors = [1, 1];

// edit elements
const zoomBtns = document.querySelector('#zoom-img');
const cropSliders = document.querySelector('#crop-form');
const scaleSliders = document.querySelector('#scale-img');
const overlayColor = document.querySelector('#overlay-filter');
const textAreas = document.querySelector('#overlay-text');

// editing listeners
zoomBtns.addEventListener('click', zoomImg);
cropSliders.addEventListener('change', cropImg);
scaleSliders.addEventListener('change', scaleImg);
overlayColor.addEventListener('change', paintImage);
textAreas.addEventListener('keyup', paintImage);
textAreas.addEventListener('change', paintImage);

//Save functionality
document.querySelector('#save-btn button').addEventListener('click', saveMeme);

// Make Memes button - i.e. start button.
document.querySelector('header button').addEventListener('click', (e) => {
    e.target.parentElement.classList.add('hide-up');
    document.querySelector('main').classList.remove('display-none');
    setTimeout(() => {
        document.body.style.overflow = 'auto';
    }, 3000);
});

// Fade in
setTimeout(() => {
    document.querySelector('header').classList.remove('hidden');
}, 300);



// this function copied from Stack Overflow for the most part
// https://stackoverflow.com/a/42614316
fileUploadLocal.onchange = readImage;
function readImage() {
    resetAll();
    document.querySelector('#edit-form').reset();
    if ( this.files && this.files[0] ) {
        // was not familiar with FileReader or creating Image objects like this
        var FR= new FileReader();
        FR.onload = function(e) {
            var img = new Image();
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

fileUploadWeb.addEventListener('submit', (e) => {
    e.preventDefault();
    resetAll();
    document.querySelector('#edit-form').reset();
    let webLink = document.querySelector('#image-upload-web').value;
    const img = new Image();
    img.src = webLink;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        image = img;
        fileUploadLocal.value = "";
    }
})


function resetImgScale() {
    currCanvasSizeBase = [1, 1];
    scaleFactors = [1, 1];
}


function paintImage() {
    if (!image) return;

        let sx = Math.round(leftCrop * image.width);
        let sy = Math.round(topCrop * image.height);
        let sWidth = image.width - sx - Math.round(rightCrop * image.width);
        let sHeight = image.height - sy - Math.round(bottomCrop * image.height);

        canvas.width = sWidth * currCanvasSizeBase[0] * scaleFactors[0];
        canvas.height = sHeight * currCanvasSizeBase[1] * scaleFactors[1];

        ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

        changeOverlayFilter();
        changeOverlayText();

}


function zoomImg(e) {
    // e.preventDefault();
    const id = e.target.id;
    switch(id) {
        case 'zoom-in':
            currCanvasSizeBase[0] += 0.05;
            currCanvasSizeBase[1] += 0.05;
            break;
        case 'zoom-out':
            currCanvasSizeBase[0] -= 0.05;
            currCanvasSizeBase[1] -= 0.05;
            break;
        default: 
            console.error('bad zoom switch flag')
            break;
    } 
    paintImage();
}


function cropImg(e) {
    const id = e.target.id;
    switch (id) {
        case 'crop-top':
            topCrop = (e.target.value / 100).toFixed(2);
            break;
        case 'crop-bottom':
            bottomCrop = (e.target.value / 100).toFixed(2);
            break;
        case 'crop-left':
            leftCrop = (e.target.value / 100).toFixed(2);
            break;
        case 'crop-right':
            rightCrop = (e.target.value / 100).toFixed(2);
            break;
        default: 
            console.error('bad crop switch flag')
            break;
    }
    paintImage();
}

// Crop Reset
document.querySelector('#reset-crop').addEventListener('click', (e) => {
    e.preventDefault();
    topCrop = 0, bottomCrop = 0, leftCrop = 0, rightCrop = 0;
    document.querySelector('#crop-top').value = 0, 
    document.querySelector('#crop-bottom').value = 0, 
    document.querySelector('#crop-left').value = 0, 
    document.querySelector('#crop-right').value = 0, 
    paintImage();
});


function scaleImg(e) {
    const id = e.target.id;
    switch(id) {
        case 'scale-x':
            scaleFactors[0] = (e.target.value / 100).toFixed(2);
            break;
        case 'scale-y':
            scaleFactors[1] = (e.target.value / 100).toFixed(2);
            break;
        default: 
            console.error('bad scale switch flag')
            break;
    } 
    paintImage();
}

// Scale Reset
document.querySelector('#reset-scale').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#scale-x').value = 100;
    document.querySelector('#scale-y').value = 100;
    scaleFactors[0] = 1;
    scaleFactors[1] = 1;
    paintImage();
});


function changeOverlayFilter(e) {
    let color = document.querySelector('#overlay-color').value;
    let opacity = document.querySelector('#overlay-opacity').value / 100;
    ctx.fillStyle = hexToRgbA(color, opacity);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function changeOverlayText(e) {
    ctx.font = '80px Bangers';
    ctx.textAlign = 'center';
    
    const text1 = document.querySelector('#overlay-text-1').value;
    ctx.fillStyle = document.querySelector('#text-1-color').value;
    ctx.strokeStyle = document.querySelector('#text-1-stroke-color').value;
    ctx.fillText(text1, canvas.width/2, 100, canvas.width);
    ctx.strokeText(text1, canvas.width/2, 100, canvas.width);
    
    const text2 = document.querySelector('#overlay-text-2').value;
    ctx.fillStyle = document.querySelector('#text-2-color').value;
    ctx.strokeStyle = document.querySelector('#text-2-stroke-color').value;
    ctx.fillText(text2, canvas.width/2, canvas.height - 50, canvas.width);
    ctx.strokeText(text2, canvas.width/2, canvas.height - 50, canvas.width);
}


function saveMeme(e) {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.classList.add('gallery-item')    
    wrapper.append(canvas);

    const remove = document.createElement('button');
    remove.innerText = 'Remove this meme';
    remove.addEventListener('click', (e) => {
        e.target.previousElementSibling.remove();
        e.target.remove();
    })

    const gallery = document.querySelector('.gallery');
    gallery.append(wrapper, remove);
    gallery.classList.remove('display-none');

    resetAll();
    document.querySelector('#upload-form').reset();

    const newCanvas = document.createElement('canvas');
    document.querySelector('#canvas-wrapper').append(newCanvas);
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext("2d");
}


function resetAll() {
    document.querySelector('#edit-form').reset(); 
    topCrop = 0, bottomCrop = 0, leftCrop = 0, rightCrop = 0;
    resetImgScale();
}


function insertDefaultText() {
    canvas.width = 800;
    canvas.height = 700;
    ctx.font = '80px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('This meme...', canvas.width/2, 100, canvas.width);
    ctx.fillText('is the memeiest -_-', canvas.width/2, canvas.height - 50, canvas.width);
}

// helper function from S.O. https://stackoverflow.com/a/21648508/11164558
function hexToRgbA(hex, opacity){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+ `, ${opacity})`;
    }
    throw new Error('Bad Hex');
}


// from S.O. just extra stuff to look at for learning

// canvas.nextElementSibling.onclick = function(e) {
    
//     var x = e.offsetX;
//     var y = e.offsetY;
//     console.log(y)
//     ctx.beginPath();
//     ctx.fillStyle = 'black';
//     ctx.arc(x, y, 5, 0, Math.PI * 2);
//     ctx.fill();
//     console.log('in canvas')
//   };