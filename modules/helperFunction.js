'use strict'


function getTextVaribles() {  
    const fontSize = +document.getElementById('font-size').value;
    const lineHeightFactor = document.getElementById('line-height').value / 100;
    const lineHeight = lineHeightFactor * fontSize;
  
    const topMarginFactor = document.getElementById('text1-margin').value / 100;
    const bottomMarginFactor = document.getElementById('text2-margin').value / 100;;
    const topMargin = lineHeight * topMarginFactor;
    const bottomMargin = lineHeight * bottomMarginFactor;

    const font = document.getElementById('font-select').value;
    localStorage.setItem('font', font);
    const textAlignTop = document.getElementById('text1-align').value;
    const textAlignBottom = document.getElementById('text2-align').value;

    const xStartTop = getXStart(textAlignTop, topMargin);
    const xStartBotm = getXStart(textAlignBottom, bottomMargin);

    let [textArray1, textArray2] = getTextArrays();
    let bOffset = (textArray2.length - 1) * lineHeight + bottomMargin;

    return {
        font, fontSize, lineHeight, topMargin, 
        textAlignTop, textAlignBottom, xStartTop, 
        xStartBotm, textArray1, textArray2, bOffset,
    };
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

function checkLocalStorage() {
    if (localStorage.getItem('text1Stroke')==='false') {
        document.getElementById('text-1-outline').removeAttribute('checked');
    }
    if (localStorage.getItem('text2Stroke')==='false') {
        document.getElementById('text-2-outline').removeAttribute('checked');
    }
    if (localStorage.getItem('imageBorder')==='false') {
        document.getElementById('border').removeAttribute('checked');
    }
    if (localStorage.getItem('font')) {
        document.querySelector(
            `#font-select option[value=${localStorage.getItem('font')}`
            ).setAttribute('selected', true);
    }
}

checkLocalStorage();