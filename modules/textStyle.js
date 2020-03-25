'use strict'

/* text style DOM inputs*/
const FONT_SIZE = document.getElementById('font-size');
const LINE_HEIGHT = document.getElementById('line-height');
const TOP_MARGIN = document.getElementById('text1-margin');
const BOTTOM_MARGIN = document.getElementById('text2-margin');

/* event listeners for setting local/session
/* storage of text style and font choice*/
document.querySelector('#default-font').addEventListener('click', setDefaultFont);
document.querySelector('#set-style').addEventListener('click', setTextStyle);


/* select the proper font option in DOM*/
function setDefaultFont(e) {
    e.preventDefault();
    selectFontDom();
}

/* use sessionStorage to set 
/* text style input values in DOM*/
function setTextStyle(e) {
    e.preventDefault();
    setFromSessionStorageTextStyles();
}

/* get all text style varibles 
/* for canvas rendering */
function getTextVaribles() {  
    // get values from DOM
    // and calculate additional values as necessarry.
    const fontSize = FONT_SIZE.value;
    const lineHeightFactor = LINE_HEIGHT.value;
    const lineHeight = (lineHeightFactor / 100) * +fontSize;
  
    const topMarginFactor = TOP_MARGIN.value;
    const bottomMarginFactor = BOTTOM_MARGIN.value;
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

    // put text style data in sessionStorage
    setSessionStorageText(
        fontSize, lineHeightFactor, topMarginFactor, 
        bottomMarginFactor, textAlignTop, textAlignBottom, 
        text1Color, text1StrokeColor, text1Stroke,
        text2Color, text2StrokeColor, text2Stroke,
        );
    // put font, and textStroke prefrences in localStorage
    setLocalStorageText(font, text1Stroke, text2Stroke);

    return {
        font, fontSize, lineHeight, topMargin, 
        textAlignTop, textAlignBottom, xStartTop, 
        xStartBotm, textArray1, textArray2, bOffset,
        text1Color, text1StrokeColor, text1Stroke,
        text2Color, text2StrokeColor, text2Stroke,
    }
}

/* return array of text from textareas data. 
/* each array element is a line of text*/
function getTextArrays() {
    let text1 = document.querySelector('#overlay-text-1').value;
    text1 = text1.split('\n');
    let text2 = document.querySelector('#overlay-text-2').value;
    text2 = text2.split('\n');
    return [text1, text2];  
}

/* return value of x offset for 
/* different text alignments*/
function getXStart(textAlign, margin) {
    let xStart;
    if (textAlign=='right') xStart = CANVAS.width - margin - 10;
    else if (textAlign=='left') xStart = margin;
    else xStart = CANVAS.width/2;
    return xStart;
}

/* set text style slider values and color values
/* to match data from sessionStorage
*/
function setSliderColorValues(textData) {
    FONT_SIZE.setAttribute(
        'value', textData['fontSize']
        );
    LINE_HEIGHT.setAttribute(
        'value', textData['lineHeightFactor']
        );
    TOP_MARGIN.setAttribute(
        'value', textData['topMarginFactor']
        );
    BOTTOM_MARGIN.setAttribute(
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
}

/* set text stroke checkboxes 
/* to match text style data */
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

/* set text alignment options
/* to match data from sessionStorage */
function setTextAlignment(textData) {
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



/* set DOM font <option> to selected to equal data in localStorage. 
/* deselect all then select the desired font */
function selectFontDom() {
    const font = localStorage.getItem('font');

    document.querySelectorAll(`#font-select option`).forEach(option => {
        option.removeAttribute('selected');
    });
    document.querySelector(
        `#font-select option[value="${font}"]`
        ).setAttribute('selected', true);
}

/* HTML default text values*/
const TEXT_DEFAULTS = {
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