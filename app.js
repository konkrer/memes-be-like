'use strict'



// editing data variables
let IMAGE, TOP_CROP = 0, BOTTOM_CROP = 0, LEFT_CROP = 0, RIGHT_CROP = 0;
let CURR_CANVAS_BASE_SIZE = 1;
let SCALE_FACTORS = [1, 1];
let OUTPUT_SCALE = 1;


// edit control variables
const EDIT_FORM = document.querySelector('#edit-form')
const TEXT_AREAS = document.querySelector('#overlay-text');
const MOUSE_WHEEL_EVT = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"


// editing event listeners
EDIT_FORM.addEventListener(MOUSE_WHEEL_EVT, mouseAdjust, {passive: false, capture: true});
EDIT_FORM.addEventListener('submit', (e) => e.preventDefault());
TEXT_AREAS.addEventListener('keyup', paintImage);
TEXT_AREAS.addEventListener('change', paintImage);
document.getElementById('zoom-img').addEventListener('click', zoomImg);
document.getElementById('advanced-vis-control').addEventListener('click', toggleAdvanced);
document.getElementById('filter-form').addEventListener('change', paintImage);
document.getElementById('crop-form').addEventListener('change', cropImg);
document.getElementById('scale-form').addEventListener('change', scaleImg);
document.getElementById('output-scale').addEventListener('change', changeOutputScaleValue);


// Make Memes button event listener - i.e. start button.
document.querySelector('header button').addEventListener('click', startInit);

// zoom main event listener
document.querySelector(
    '#canvas-wrapper'
    ).addEventListener(MOUSE_WHEEL_EVT, zoomMain, {passive: false, capture: true});

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

        CANVAS.width = sWidth * CURR_CANVAS_BASE_SIZE * SCALE_FACTORS[0];
        CANVAS.height = sHeight * CURR_CANVAS_BASE_SIZE * SCALE_FACTORS[1];
        CTX.drawImage(IMAGE, sx, sy, sWidth, sHeight, 0, 0, CANVAS.width, CANVAS.height);

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
        CTX.strokeStyle = color;
        CTX.strokeRect(0, 0, CANVAS.width, CANVAS.height);
    }
    localStorage.setItem('imageBorder', imageBorder);
}


// display image size in scale output area
function showImageSize() {
    const width = CANVAS.width, height = CANVAS.height;
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

// ZOOM in or out by adjusting CURR_CANVAS_BASE_SIZE
// scaling factor that influence canvas size
function zoomImg(e) {
    const id = e.target.id;
    switch(id) {
        case 'zoom-in':
            CURR_CANVAS_BASE_SIZE += 0.05;
            break;
        case 'zoom-out':
            CURR_CANVAS_BASE_SIZE -= 0.05;
            break;
        default: 
            console.error('bad zoom switch flag')
            break;
    } 
    paintImage();
}

// To toggle advanced controls.
// i.e. overlay, crop, scale, output scale
function toggleAdvanced(e) {
    e.preventDefault();
    document.getElementById('advanced-zone').classList.toggle('display-none');
    if (e.target.innerText==="Show Advanced") e.target.innerText = "Hide Advanced"
    else e.target.innerText = "Show Advanced";
}

// crop image variables adjustment
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

// scale image coefficent adjustment
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

// Scale Reset. reset scale coefficients
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
    CTX.fillStyle = hexToRgbA(color, opacity);
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
}

// update overlay text from text-zone inputs
function changeOverlayText(e) {
    let textData = getTextVaribles();

    CTX.font = `${textData.fontSize}px ${textData.font}`;
    // text area 1 set CTX properties
    setCanvasTextStyle(textData.textAlignTop, textData.text1Color, textData.text1StrokeColor);
    // add top text
    addTopText(textData);
    // text area 2 set CTX properties
    setCanvasTextStyle(textData.textAlignBottom, textData.text2Color, textData.text2StrokeColor);
    // add bottom text
    addBottomText(textData);   
}

// Set CTX text styles
function setCanvasTextStyle(align, color, stroke) {
    CTX.textAlign = align;
    CTX.fillStyle = color;
    CTX.strokeStyle = stroke.value;
}

// Draw top text on canvas.
function addTopText(textData) {
    let offset = 0;
    textData.textArray1.forEach(line => {
        CTX.fillText(line, textData.xStartTop, textData.topMargin + .76*textData.fontSize + offset, CANVAS.width);
        if (textData.text1Stroke) CTX.strokeText(
            line, textData.xStartTop, textData.topMargin + .76*textData.fontSize + offset, CANVAS.width
            );
        offset += textData.lineHeight;
    });
}

// Draw bottom text on canvas.
function addBottomText(textData) {
    textData.textArray2.forEach(line => {
        CTX.fillText(line, textData.xStartBotm, CANVAS.height - textData.bOffset, CANVAS.width);
        if (textData.text2Stroke) CTX.strokeText(
            line, textData.xStartBotm, CANVAS.height - textData.bOffset, CANVAS.width
            );
        textData.bOffset -= textData.lineHeight;
    });
}

// set OUTPUT_SCALE and change output scale display table 
function changeOutputScaleValue(e) {
    e.preventDefault();
    let outScaleValue = e.target.value;
    
    // clamp output scale and round to two decimal places
    outScaleValue = clampRoundOutputScale(outScaleValue);

    // paint DOM with clamped and rounded value
    document.getElementById('output-scale').value = outScaleValue;

    // set output scale coefficient to rounded value
    OUTPUT_SCALE = outScaleValue;

    // display correct input and output pixle sizes
    // in output-scale-form table
    showImageSize();
}


// save meme function
function saveMeme(e) {
    const gallery = document.querySelector('.gallery');

    const newImage = new Image();
    newImage.classList.add('gallery-item');
    newImage.src = CANVAS.toDataURL('image/png');
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


/* /* /* /* /* /* /* /* /* /* /* /* /* /* /* /*
/* alterd save meme function for img animation
/* instead of canvas animation
/* same problem persisted
/*
/*
/* // save meme function
/* function saveMeme(e) {
/*    const gallery = document.querySelector('.gallery');
/*
/*    const newImage = new Image();
/*    newImage.src = CANVAS.toDataURL('image/png');
/*    newImage.onload = () => {
/*        CANVAS_WRAPPER.prepend(newImage);
/*        CANVAS.classList.add('display-none');
/*        setTimeout(animateCanvasSave, 10);
/*    }
/*    
/* }
/* /* /* /* /* /* /* /* /* /* /* /* /* /* */