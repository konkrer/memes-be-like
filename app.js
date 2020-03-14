'use strict'


// display image variables
const fileUploadLocal = document.querySelector('#image-upload-local');
const fileUploadForm = document.querySelector('#upload-form');
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext("2d");


// editing data variables
let image, topCrop = 0, bottomCrop = 0, leftCrop = 0, rightCrop = 0;
let currCanvasSizeBase = [1, 1];
let scaleFactors = [1, 1];


// edit control elements
const editZone = document.querySelector('#edit-zone');
const zoomBtns = document.querySelector('#zoom-img');
const cropSliders = document.querySelector('#crop-form');
const scaleSliders = document.querySelector('#scale-form');
const overlayColor = document.querySelector('#filter-form');
const textAreas = document.querySelector('#overlay-text');


// editing event listeners
const mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"
editZone.addEventListener(mousewheelevt, mouseAdjust);
zoomBtns.addEventListener('click', zoomImg);
cropSliders.addEventListener('change', cropImg);
scaleSliders.addEventListener('change', scaleImg);
overlayColor.addEventListener('change', paintImage);
textAreas.addEventListener('keyup', paintImage);
textAreas.addEventListener('change', paintImage);


// Make Memes button event listener - i.e. start button.
document.querySelector('header button').addEventListener('click', startInit);

// zoom main event listener
document.querySelector('#canvas-wrapper').addEventListener(mousewheelevt, zoomMain);

// Save meme event listener
document.querySelector('#save-btn button').addEventListener('click', saveMeme);

// file upload  event listeners
// on local and web file input read data and load image to canvas
fileUploadLocal.onchange = readImage;
fileUploadForm.addEventListener('submit', webUpload);


// Fade in
setTimeout(() => {
    document.querySelector('header').classList.remove('hidden');
}, 200);


// start button function -
// slide header off screen and change overflow to auto after slide up complete
function startInit(e) {
    e.target.parentElement.classList.add('hide-up');
    document.querySelector('main').classList.remove('display-none');
    setTimeout(() => {
        document.body.style.overflow = 'auto';
    }, 3000);
}


// main paint to canvas function
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


// allow mousewhell events in canvas wrapper to change zoom level
function zoomMain(e) {
    console.log(e)
    e.preventDefault();
    zoomImg(changeIdForZoom(e));
}


// deligate edit-zone mousewheel events to proper funcitons
function mouseAdjust(e) {
    e.preventDefault();
    
    if (e.target.id.includes('zoom')) {      
        zoomImg(changeIdForZoom(e));
        return;
    }
    if (e.target.type!=='range') return;
    e = mouseChangeSliderValue(e);

    const parentId = e.target.parentElement.id;    
    switch(parentId) {
        case 'zoom-form':
            zoomImg(e);
            break;
        case 'crop-form':
            cropImg(e);
            break;
        case 'scale-form':
            scaleImg(e)
            break;
        case 'filter-form':
            paintImage();
            break;
        default:
            console.error("bad mouse wheel flag");
            break;
    }  
}


// change id to zoom-in or zoom-out on dummy e object
// allowing zoomImg to function with mousewheel scroll events
function changeIdForZoom(e) {
    if ((e.wheelDeltaY && +e.wheelDeltaY < 0) || (e.detail && +e.detail > 0)) {
        e = {target: {id: 'zoom-in'}};
    }else e = {target: {id: 'zoom-out'}};
    return e;
}


// use mousewheel events to change slider values
function mouseChangeSliderValue(e) {
    if ((e.wheelDeltaY && +e.wheelDeltaY < 0) || (e.detail && +e.detail > 0)) {
        e.target.value = +e.target.value + 1;
    }else e.target.value = +e.target.value - 1;
    return e;
}


function zoomImg(e) {
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


// change overlay color filter
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


// save meme function
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

    const newCanvas = document.createElement('canvas');
    document.querySelector('#canvas-wrapper').append(newCanvas);
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext("2d");
    insertDefaultText();

    resetAllEditControlsValues();
    document.querySelector('#upload-form').reset();
}


//reset all edit control sliders and values
function resetAllEditControlsValues() {
    document.querySelector('#edit-form').reset(); 
    topCrop = 0, bottomCrop = 0, leftCrop = 0, rightCrop = 0;
    resetImgScale();
}


// reset zoom and scale base factors
function resetImgScale() {
    currCanvasSizeBase = [1, 1];
    scaleFactors = [1, 1];
}


// insert text after meme saved showing user how to reload image
function insertDefaultText() {
    ctx.font = '30px BenchNine';
    ctx.textAlign = 'center';
    ctx.fillText('Mouse Scroll Here', canvas.width/2, 36, canvas.width);
    ctx.fillText('To Reload Last Image', canvas.width/2, canvas.height - 18, canvas.width);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
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