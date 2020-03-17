'use strict'



// editing data variables
let IMAGE, TOP_CROP = 0, BOTTOM_CROP = 0, LEFT_CROP = 0, RIGHT_CROP = 0;
let CURR_CANVAS_BASE_SIZE = [1, 1];
let SCALE_FACTORS = [1, 1];
let OUTPUT_SCALE = 1;


// edit control variables
const EDIT_FORM = document.querySelector('#edit-form')
const TEXT_AREAS = document.querySelector('#overlay-text');
const MOUSE_WHEEL_EVT = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"


// editing event listeners
EDIT_FORM.addEventListener(MOUSE_WHEEL_EVT, mouseAdjust);
EDIT_FORM.addEventListener('submit', (e) => e.preventDefault());
document.querySelector('#zoom-img').addEventListener('click', zoomImg);
TEXT_AREAS.addEventListener('keyup', paintImage);
TEXT_AREAS.addEventListener('change', paintImage);
document.querySelector('#advanced-vis-control').addEventListener('click', toggleAdvanced);
document.querySelector('#filter-form').addEventListener('change', paintImage);
document.querySelector('#crop-form').addEventListener('change', cropImg);
document.querySelector('#scale-form').addEventListener('change', scaleImg);
document.getElementById('output-scale').addEventListener('change', changeOutputScaleValue);


// Make Memes button event listener - i.e. start button.
document.querySelector('header button').addEventListener('click', startInit);

// zoom main event listener
document.querySelector('#canvas-wrapper').addEventListener(MOUSE_WHEEL_EVT, zoomMain);

// Save meme event listener
document.querySelector('#save-btn button').addEventListener('click', saveMeme);


// start button function -
// slide header off screen and change overflow to auto after slide up complete
function startInit(e) {
    const headerWrapper = e.target.parentElement.parentElement.parentElement;
    headerWrapper.classList.add('hide-up');
    document.querySelector('main').classList.remove('display-none');
    document.getElementById('font-hack').classList.add('display-none');
    setTimeout(() => {
        document.body.style.overflowY = 'auto';
        headerWrapper.classList.add('display-none');
    }, 3000);
}


// main paint to canvas function
function paintImage() {
    if (!IMAGE) return;

        let sx = Math.round(LEFT_CROP * IMAGE.width);
        let sy = Math.round(TOP_CROP * IMAGE.height);
        let sWidth = IMAGE.width - sx - Math.round(RIGHT_CROP * IMAGE.width);
        let sHeight = IMAGE.height - sy - Math.round(BOTTOM_CROP * IMAGE.height);

        canvas.width = sWidth * CURR_CANVAS_BASE_SIZE[0] * SCALE_FACTORS[0];
        canvas.height = sHeight * CURR_CANVAS_BASE_SIZE[1] * SCALE_FACTORS[1];
        ctx.drawImage(IMAGE, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

        changeOverlayFilter();
        changeOverlayText();
        changeborder();
        showImageSize();
}

// draw image border if input checked
function changeborder() {
    const imageBorder = document.getElementById('border').checked;
    if (imageBorder) {
        const color = document.getElementById('border-color').value;
        ctx.strokeStyle = color;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
    localStorage.setItem('imageBorder', imageBorder);
}


// display image size in scale output area
function showImageSize() {
    const width = canvas.width, height = canvas.height;
    document.getElementById(
        'current-size'
        ).innerText = `${Math.round(width)} X ${Math.round(height)}`;
    document.getElementById(
        'output-size'
        ).innerText = `${Math.round(width * OUTPUT_SCALE)} X ${Math.round(height * OUTPUT_SCALE)}`;
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
        case 'font-form':
            paintImage();
            break;
        case 'text-form-1':
            paintImage();
            break;
        case 'text-form-2':
            paintImage();
            break;
        default:
            console.error("bad mouse wheel flag", parentId);
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
            CURR_CANVAS_BASE_SIZE[0] += 0.05;
            CURR_CANVAS_BASE_SIZE[1] += 0.05;
            break;
        case 'zoom-out':
            CURR_CANVAS_BASE_SIZE[0] -= 0.05;
            CURR_CANVAS_BASE_SIZE[1] -= 0.05;
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
            TOP_CROP = (e.target.value / 100).toFixed(2);
            break;
        case 'crop-bottom':
            BOTTOM_CROP = (e.target.value / 100).toFixed(2);
            break;
        case 'crop-left':
            LEFT_CROP = (e.target.value / 100).toFixed(2);
            break;
        case 'crop-right':
            RIGHT_CROP = (e.target.value / 100).toFixed(2);
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
    TOP_CROP = 0, BOTTOM_CROP = 0, LEFT_CROP = 0, RIGHT_CROP = 0;
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
            SCALE_FACTORS[0] = (e.target.value / 100).toFixed(2);
            break;
        case 'scale-y':
            SCALE_FACTORS[1] = (e.target.value / 100).toFixed(2);
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
    SCALE_FACTORS[0] = 1;
    SCALE_FACTORS[1] = 1;
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
    let {

        font, fontSize, lineHeight, topMargin, 
        textAlignTop, textAlignBottom, xStartTop, 
        xStartBotm, textArray1, textArray2, bOffset,
        text1Color, text1StrokeColor, text1Stroke,
        text2Color, text2StrokeColor, text2Stroke,

    } = getTextVaribles();

    ctx.font = `${fontSize}px ${font}`;
   
    // text area 1
    ctx.textAlign = textAlignTop;
    ctx.fillStyle = text1Color;
    ctx.strokeStyle = text1StrokeColor.value;

    let offset = 0;
    textArray1.forEach(line => {
        ctx.fillText(line, xStartTop, topMargin + .76*fontSize + offset, canvas.width);
        if (text1Stroke) ctx.strokeText(
            line, xStartTop, topMargin + .76*fontSize + offset, canvas.width
            );
        offset += lineHeight;
    })

    // text area 2 
    ctx.textAlign = textAlignBottom;
    ctx.fillStyle = text2Color;
    ctx.strokeStyle = text2StrokeColor.value;

    textArray2.forEach(line => {
        ctx.fillText(line, xStartBotm, canvas.height - bOffset, canvas.width);
        if (text2Stroke) ctx.strokeText(
            line, xStartBotm, canvas.height - bOffset, canvas.width
            );
        bOffset -= lineHeight;
    })
}


function changeOutputScaleValue(e) {
    e.preventDefault();
    let outScaleValue = e.target.value;
    if (outScaleValue > 3) outScaleValue = 3;
    else if (outScaleValue < 0.1) outScaleValue = 0.1;
    outScaleValue = (Math.round(outScaleValue * 100 + Number.EPSILON) / 100) 
    document.getElementById('output-scale').value = outScaleValue;
    OUTPUT_SCALE = outScaleValue;
    showImageSize();
}


// save meme function
function saveMeme(e) {
    const gallery = document.querySelector('.gallery');

    const newImage = new Image();
    newImage.classList.add('gallery-item');
    newImage.src = canvas.toDataURL('image/png');
    newImage.onload = () => {
        newImage.width = newImage.width * OUTPUT_SCALE;
        newImage.height = newImage.height * OUTPUT_SCALE;
        gallery.lastElementChild.prepend(newImage, createDeleteBtn());
        // don't actually NEED to do this each time
        gallery.classList.remove('display-none');
        document.body.style.paddingBottom = "3em";
    }
    animateCanvasSave();
}