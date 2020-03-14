'use strict'



// editing data variables
let image, topCrop = 0, bottomCrop = 0, leftCrop = 0, rightCrop = 0;
let currCanvasSizeBase = [1, 1];
let scaleFactors = [1, 1];
let outputScale = 1;


// edit control variables
const textAreas = document.querySelector('#overlay-text');
const mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"


// editing event listeners
document.querySelector('#edit-form').addEventListener(mousewheelevt, mouseAdjust);
document.querySelector('#zoom-img').addEventListener('click', zoomImg);
textAreas.addEventListener('keyup', paintImage);
textAreas.addEventListener('change', paintImage);
document.querySelector('#filter-form').addEventListener('change', paintImage);
document.querySelector('#advanced-vis-control').addEventListener('click', toggleAdvanced);
document.querySelector('#crop-form').addEventListener('change', cropImg);
document.querySelector('#scale-form').addEventListener('change', scaleImg);
document.getElementById('output-scale').addEventListener('change', changeOutputScaleValue);


// Make Memes button event listener - i.e. start button.
document.querySelector('header button').addEventListener('click', startInit);

// zoom main event listener
document.querySelector('#canvas-wrapper').addEventListener(mousewheelevt, zoomMain);

// Save meme event listener
document.querySelector('#save-btn button').addEventListener('click', saveMeme);

// Fade in
setTimeout(() => {
    document.querySelector('header').classList.remove('hidden');
}, 200);


// start button function -
// slide header off screen and change overflow to auto after slide up complete
function startInit(e) {
    const header = e.target.parentElement;
    header.classList.add('hide-up');
    document.querySelector('main').classList.remove('display-none');
    setTimeout(() => {
        document.body.style.overflowY = 'auto';
        header.classList.add('display-none');
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
        showImageSize();

        changeOverlayFilter();
        changeOverlayText();
}


// display image size in scale output area
function showImageSize() {
    const width = canvas.width, height = canvas.height;
    document.getElementById(
        'current-size'
        ).innerText = `${Math.round(width)} X ${Math.round(height)}`;
    document.getElementById(
        'output-size'
        ).innerText = `${Math.round(width * outputScale)} X ${Math.round(height * outputScale)}`;
}


// allow mousewhell events in canvas wrapper to change zoom level
function zoomMain(e) {
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
    if (e.target.type==='number') {
        mouseChangeNumberValue(e),
        changeOutputScaleValue(e);
    }
    if (e.target.type==='range') {
        e = mouseChangeSliderValue(e);
        sliderSwitch(e);     
    }    
}


// make proper adjustment after any slider being moved
function sliderSwitch(e) {
    const parentId = e.target.parentElement.id;   
    switch(parentId) {
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
function mouseChangeNumberValue(e) {
    if ((e.wheelDeltaY && +e.wheelDeltaY < 0) || (e.detail && +e.detail > 0)) {
        e.target.value = +e.target.value + 0.1;
    }else e.target.value = +e.target.value - 0.1;
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


function toggleAdvanced(e) {
    e.preventDefault();
    document.getElementById('advanced-zone').classList.toggle('display-none');
    if (e.target.innerText==="Show Advanced") e.target.innerText = "Hide Advanced"
    else e.target.innerText = "Show Advanced";
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


function changeOutputScaleValue(e) {
    let outScaleValue = e.target.value;
    if (outScaleValue > 3) outScaleValue = 3;
    else if (outScaleValue < 0.1) outScaleValue = 0.1;
    outScaleValue = (Math.round(outScaleValue * 100 + Number.EPSILON) / 100) 
    document.getElementById('output-scale').value = outScaleValue;
    outputScale = outScaleValue;
    showImageSize();
}


// save meme function
function saveMeme(e) {
    const gallery = document.querySelector('.gallery');

    const newImage = new Image();
    newImage.classList.add('gallery-item');
    newImage.src = canvas.toDataURL('image/png');
    newImage.onload = () => {
        newImage.width = newImage.width * outputScale;
        newImage.height = newImage.height * outputScale;
        gallery.lastElementChild.prepend(newImage, createDeleteBtn());
        // don't actually NEED to do this each time
        gallery.classList.remove('display-none');
        document.body.style.paddingBottom = "3em";
    }      
}


// factory function for remove button
function createDeleteBtn() {
    const btn = document.createElement('button');
    btn.innerText = 'Remove this meme';
    btn.addEventListener('click', (e) => {
        e.target.previousElementSibling.remove();
        e.target.remove();
    });
    return btn;
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


// // insert text after meme saved showing user how to reload image
// function insertDefaultText() {
//     ctx.font = '30px BenchNine';
//     ctx.textAlign = 'center';
//     ctx.fillText('Mouse Scroll Here', canvas.width/2, 36, canvas.width);
//     ctx.fillText('To Reload Last Image', canvas.width/2, canvas.height - 18, canvas.width);
//     ctx.strokeRect(0, 0, canvas.width, canvas.height);
// }


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

// canvas.onclick = function(e) {
    
//     var x = e.offsetX;
//     var y = e.offsetY;
//     console.log(y)
//     ctx.beginPath();
//     ctx.fillStyle = 'black';
//     ctx.arc(x, y, 15, 1, Math.PI * 2);
//     ctx.fill();
//     console.log('in canvas')
//   };