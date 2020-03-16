'use strict'


document.querySelector('#default-font').addEventListener('click', setDefaultFont);
document.querySelector('#set-style').addEventListener('click', setTextStyle);



function getTextVaribles() {  
    // get values from index.html(#overlay-text) for canvas text overlay
    // and calculate additional values as necessarry.
    const fontSize = document.getElementById('font-size').value;
    const lineHeightFactor = document.getElementById('line-height').value;
    const lineHeight = (lineHeightFactor / 100) * +fontSize;
  
    const topMarginFactor = document.getElementById('text1-margin').value;
    const bottomMarginFactor = document.getElementById('text2-margin').value;
    const topMargin = lineHeight * (topMarginFactor / 100);
    const bottomMargin = lineHeight * (bottomMarginFactor / 100);

    const font = document.getElementById('font-select').value;
    const textAlignTop = document.getElementById('text1-align').value;
    const textAlignBottom = document.getElementById('text2-align').value;

    // calculate x axis start values for text alignment choices
    const xStartTop = getXStart(textAlignTop, topMargin);
    const xStartBotm = getXStart(textAlignBottom, bottomMargin);

    let [textArray1, textArray2] = getTextArrays();

    // bottom offset. offset bottom text upwards so additonal lines 
    // of  text appear below the previous lines
    let bOffset = (textArray2.length - 1) * lineHeight + bottomMargin;

    const text1Color = document.querySelector('#text-1-color').value;
    const text1StrokeColor = document.querySelector('#text-1-stroke-color');
    const text1Stroke = text1StrokeColor.nextElementSibling.checked;

    const text2Color = document.querySelector('#text-2-color').value;
    const text2StrokeColor = document.querySelector('#text-2-stroke-color');
    const text2Stroke = text2StrokeColor.nextElementSibling.checked;

    setSessionStorageText(
        fontSize, lineHeightFactor, topMarginFactor, 
        bottomMarginFactor, textAlignTop, textAlignBottom, 
        text1Color, text1StrokeColor, text1Stroke,
        text2Color, text2StrokeColor, text2Stroke,
        );

    setLocalStorageText(font, text1Stroke, text2Stroke);

    return {
        font, fontSize, lineHeight, topMargin, 
        textAlignTop, textAlignBottom, xStartTop, 
        xStartBotm, textArray1, textArray2, bOffset,
        text1Color, text1StrokeColor, text1Stroke,
        text2Color, text2StrokeColor, text2Stroke,
    };
}

function setLocalStorageText(font, text1Stroke, text2Stroke) {
    localStorage.setItem('font', font);
    localStorage.setItem('text1Stroke', text1Stroke);
    localStorage.setItem('text2Stroke', text2Stroke);
}

function getTextArrays() {
    let text1 = document.querySelector('#overlay-text-1').value;
    text1 = text1.split('\n');
    let text2 = document.querySelector('#overlay-text-2').value;
    text2 = text2.split('\n');
    return [text1, text2];  
}

function getXStart(textAlign, margin) {
    let xStart;
    if (textAlign=='right') xStart = canvas.width - margin - 10;
    else if (textAlign=='left') xStart = margin;
    else xStart = canvas.width/2;
    return xStart;
}

function setSessionStorageText(
    fontSize, lineHeightFactor, topMarginFactor, 
    bottomMarginFactor, textAlignTop, textAlignBottom, 
    text1Color, text1StrokeColor, text1Stroke,
    text2Color, text2StrokeColor, text2Stroke,) {

        let textData = {
            'fontSize': fontSize,
            'lineHeightFactor': lineHeightFactor,
            'topMarginFactor': topMarginFactor,
            'bottomMarginFactor': bottomMarginFactor,
            'textAlignTop': textAlignTop,
            'textAlignBottom': textAlignBottom,
            'text1Color': text1Color,
            'text1StrokeColor': text1StrokeColor.value,
            'text1Stroke': text1Stroke,
            'text2Color': text2Color,
            'text2StrokeColor': text2StrokeColor.value,
            'text2Stroke': text2Stroke,
        }
        textData = JSON.stringify(textData);
        sessionStorage.setItem('textData', textData);
}

// save current text style to html values for defaults for form reset
// current style is already in sessionStorage
function setTextStyle(e) {
    e.preventDefault();
    setFromSessionStorageTextStyles();
}

// load text style defaults from localStorage
// set html defaults
function setFromSessionStorageTextStyles(textData) {
    // if no textData has been passed in (for reseting form to original values)
    if (!textData) {
        // check for session textData
        if (sessionStorage.getItem('textData')) {
            textData = JSON.parse(sessionStorage.getItem('textData')); 
        }
    }
    if (textData) {
        document.getElementById('font-size').setAttribute(
            'value', textData['fontSize']
            );
        document.getElementById('line-height').setAttribute(
            'value', textData['lineHeightFactor']
            );
        document.getElementById('text1-margin').setAttribute(
            'value', textData['topMarginFactor']
            );
        document.getElementById('text2-margin').setAttribute(
            'value', textData['bottomMarginFactor']
            );

        document.getElementById('text-1-color').setAttribute(
            'value', textData['text1Color']
            );
        document.getElementById('text-1-stroke-color').setAttribute(
            'value', textData['text1StrokeColor']
            );
        document.getElementById('text-2-color').setAttribute(
            'value', textData['text2Color']
            );
        document.getElementById('text-2-stroke-color').setAttribute(
            'value', textData['text2StrokeColor']
            );
        
        setTextStroke(textData);


        // unselect all then select desired text alignment option
        document.querySelectorAll(`#text-form-1 option`).forEach(option => {
            option.removeAttribute('selected');
        });
        document.querySelector(
            `#text-form-1 option[value=${textData['textAlignTop']}]`
            ).setAttribute('selected', true);

        // unselect all then select desired text alignment option
        document.querySelectorAll(`#text-form-2 option`).forEach(option => {
            option.removeAttribute('selected');
        });
        document.querySelector(
            `#text-form-2 option[value=${textData['textAlignBottom']}]`
            ).setAttribute('selected', true);     
    }
}


// load text and border stroke defaults from localStorage
function loadFromLocalStorage() {
    if (localStorage.getItem('font')) {

        selectFontHtml();

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


function setTextStroke(textData) {

    if (textData['text1Stroke']) {
        document.getElementById('text-1-outline').setAttribute(
            'checked', true
            );
    }else document.getElementById('text-1-outline').removeAttribute('checked');

    if (textData['text2Stroke']) {
        document.getElementById('text-2-outline').setAttribute(
            'checked', true
            );
    }else document.getElementById('text-2-outline').removeAttribute('checked');
}


// deselect then select the proper font option by calling selectFontHtml
function setDefaultFont(e) {
    e.preventDefault();
    selectFontHtml();
}

// set html font option to selected to equal data in localStorage. 
// deselect all then select the desired font
function selectFontHtml() {
    const font = localStorage.getItem('font');

    document.querySelectorAll(`#font-select option`).forEach(option => {
        option.removeAttribute('selected');
    });
    document.querySelector(
        `#font-select option[value="${font}"]`
        ).setAttribute('selected', true);
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

function removeDefaultText() {
    document.getElementById('overlay-text-1').innerText = '';
    document.getElementById('overlay-text-2').innerText = '';
}

// reset html form values to original html coded values
function resetFormToDefault(e) {
    e.preventDefault();
    console.log(e)
    const textData = {
            'fontSize': '60',
            'lineHeightFactor': '100',
            'topMarginFactor': '30',
            'bottomMarginFactor': '30',
            'textAlignTop': 'center',
            'textAlignBottom': 'center',
            'text1Color': '#000000',
            'text1StrokeColor': '#FFFFFF',
            'text2Color': '#000000',
            'text2StrokeColor': '#FFFFFF',
            'text1Stroke': 'true',
            'text2Stroke': 'true',
    }
    setFromSessionStorageTextStyles(textData);
}


// animate canvas when meme is saved
function animateCanvasSave() {
    canvas.classList.toggle('fliped');
    setTimeout(() => {
        canvas.classList.toggle('skew');
        setTimeout(() => {
            canvas.classList.toggle('skew');
        }, 1300);
    }, 1500);
}


setFromSessionStorageTextStyles();
loadFromLocalStorage();