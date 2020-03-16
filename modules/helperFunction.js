'use strict'


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
        bottomMarginFactor, textAlignTop, 
        textAlignBottom, text1Color, text1StrokeColor,
        text2Color, text2StrokeColor
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
    bottomMarginFactor, textAlignTop,
    textAlignBottom, text1Color, text1StrokeColor,
    text2Color, text2StrokeColor) {

        let data = {
            'fontSize': fontSize,
            'lineHeightFactor': lineHeightFactor,
            'topMarginFactor': topMarginFactor,
            'bottomMarginFactor': bottomMarginFactor,
            'textAlignTop': textAlignTop,
            'textAlignBottom': textAlignBottom,
            'text1Color': text1Color,
            'text1StrokeColor': text1StrokeColor.value,
            'text2Color': text2Color,
            'text2StrokeColor': text2StrokeColor.value,
        }
        data = JSON.stringify(data);
        sessionStorage.setItem('textData', data);
}

// load text defaults from localStorage
function checkSessionStorageText() {
    if (sessionStorage.getItem('textData')) {
        const textData = JSON.parse(sessionStorage.getItem('textData'));

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

        document.querySelector(
            `#text-form-1 option[value=${textData['textAlignTop']}]`
            ).setAttribute('selected', true);

        document.querySelector(
            `#text-form-2 option[value=${textData['textAlignBottom']}]`
            ).setAttribute('selected', true);     
    }
}

// load text and border stroke defaults from localStorage
function checkLocalStorage() {
    if (localStorage.getItem('font')) {
        document.querySelector(
            `#font-select option[value=${localStorage.getItem('font')}]`
            ).setAttribute('selected', true);

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

checkSessionStorageText();
checkLocalStorage();