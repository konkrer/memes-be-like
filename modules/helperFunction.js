'use strict'



// store font and stroke prefrences into local storage
function setLocalStorageText(font, text1Stroke, text2Stroke) {
    localStorage.setItem('font', font);
    localStorage.setItem('text1Stroke', text1Stroke);
    localStorage.setItem('text2Stroke', text2Stroke);
}

// store text style JSON into sessionStorage
function setSessionStorageText(
    fontSize, lineHeightFactor, topMarginFactor, 
    bottomMarginFactor, textAlignTop, textAlignBottom, 
    text1Color, text1StrokeColor, text1Stroke,
    text2Color, text2StrokeColor, text2Stroke,) {

        let textData = {
            fontSize,
            lineHeightFactor,
            topMarginFactor,
            bottomMarginFactor,
            textAlignTop,
            textAlignBottom,
            text1Color,
            'text1StrokeColor': text1StrokeColor.value,
            text1Stroke,
            text2Color,
            'text2StrokeColor': text2StrokeColor.value,
            text2Stroke,
        }
        textData = JSON.stringify(textData);
        sessionStorage.setItem('textData', textData);
}


// load text style prefrences from sessionStorage to DOM
// if data passed in use that data to set DOM values
function setFromSessionStorageTextStyles(textData) {
    // if no textData has been passed in (for reseting form to original values)
    if (!textData) {
        // check for session textData
        if (sessionStorage.getItem('textData')) {
            textData = JSON.parse(sessionStorage.getItem('textData')); 
        }
    }
    if (textData) {
        setSliderColorValues(textData);  
        setTextStroke(textData);
        setTextAlignment(textData);       
    }
}


// load text and border stroke defaults from localStorage
function loadFromLocalStorage() {
    if (localStorage.getItem('font')) {

        selectFontDom();

        if (localStorage.getItem('text1Stroke')==='false') {
            document.getElementById('text-1-outline').removeAttribute('checked');
        }
        if (localStorage.getItem('text2Stroke')==='false') {
            document.getElementById('text-2-outline').removeAttribute('checked');
        }
        if (localStorage.getItem('imageBorder')==='false') {
            document.getElementById('border').removeAttribute('checked');
        }
    }
}

// reset DOM text style values to original html coded values
function resetDomToDefault(e) {
    e.preventDefault();

    setFromSessionStorageTextStyles(TEXT_DEFAULTS);
    sessionStorage.setItem('textData', JSON.stringify(TEXT_DEFAULTS));
}

//reset all edit control sliders and values
function resetAllEditControlsValues() {
    document.querySelector('#edit-form').reset(); 
    TOP_CROP = 0, BOTTOM_CROP = 0, LEFT_CROP = 0, RIGHT_CROP = 0;
    resetImgScale();
}

// reset zoom and scale base factors
function resetImgScale() {
    CURR_CANVAS_BASE_SIZE = 1;
    SCALE_FACTORS = [1, 1];
}

// clamp output scale input values to desired range
// and round to two decimal places
function clampRoundOutputScale(outScaleValue) {
    if (outScaleValue > 3) outScaleValue = 3;
    else if (outScaleValue < 0.1) outScaleValue = 0.1;
    return Math.round(outScaleValue * 100 + Number.EPSILON) / 100;
}

// factory function for remove button in gallery
function createDeleteBtn() {
    const btn = document.createElement('button');
    btn.innerText = 'Remove this meme';
    btn.addEventListener('click', (e) => {
        e.target.previousElementSibling.remove();
        e.target.remove();
    });
    return btn;
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

// CANVAS.onclick = function(e) {
    
//     var x = e.offsetX;
//     var y = e.offsetY;
//     console.log(y)
//     CTX.beginPath();
//     CTX.fillStyle = 'black';
//     CTX.arc(x, y, 15, 1, Math.PI * 2);
//     CTX.fill();
//     console.log('in CANVAS')
//   };