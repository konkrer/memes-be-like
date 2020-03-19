'use strict'



// opening animation
window.addEventListener('load', () => {
    // Fade in
    setTimeout(() => {
        const header = document.querySelector('header');
        header.classList.remove('hidden');
        header.style.transform = 'none';
        insertDefaultImage();
    }, 200);

})

// put each letter of header h1 
// in own div with class grow
function animateHeaderPutLettersInDivs() {
    const headerH1 = document.querySelector('header h1');
    const innerText = headerH1.innerText;
    headerH1.innerText = '';
    innerText.split('').forEach(lett => {
        const lettDiv = document.createElement('div');
        lettDiv.classList.add('grow');
        if (lett===' ') {
            lett = '_';
            lettDiv.classList.add('hidden');
        }
        lettDiv.innerText = lett;

        headerH1.append(lettDiv);
    })
}

// put each letter of header h1 
// in own div with class grow
function animateHeaderPutWordssInDivs() {
    const headerH1 = document.querySelector('header h1');
    const innerText = headerH1.innerText.split(' ');
    headerH1.innerText = '';
    innerText.forEach((word, i) => {

        const wordDiv = document.createElement('div');
        wordDiv.classList.add('grow');
        wordDiv.innerText = word;
        headerH1.append(wordDiv);

        if (i < innerText.length-1) {
            const spaceDiv = document.createElement('div');
            spaceDiv.innerText = '_';
            spaceDiv.classList.add('hidden');
            headerH1.append(spaceDiv);
        }
    })
}

// animate canvas when meme is saved
function animateCanvasSave() {
    CANVAS.classList.toggle('fliped');
    setTimeout(() => {
        CANVAS.classList.toggle('skew');
        setTimeout(() => {
            CANVAS.classList.toggle('skew');
        }, 1300);
    }, 1500);
}

/*
/* flipping img instead of canvas for firefox didn't work
*/
// function animateCanvasSave() {
//     const img = CANVAS_WRAPPER.firstElementChild;
//     img.classList.toggle('fliped');
//     setTimeout(() => {
//         img.classList.toggle('transit-400');
//         img.classList.toggle('skew');
//         setTimeout(() => {
//             img.classList.toggle('transit-400');
//             img.classList.toggle('skew');
//         }, 1300);      
//     }, 1510);
// }

// insert default image for user to interact with right away
function insertDefaultImage() {
    const URL = 
    "https://3.bp.blogspot.com/_57XeKo2AVGk/TNfvV8CmamI/AAAAAAAADds/zG9SGr3Dv9s/s1600/The_Riddler_3%5B1%5D.png";
    const dummyEventObject = {preventDefault: () => {}};
    webUpload(dummyEventObject, URL);   
}

/*remove default text when user image is loaded*/
function removeDefaultText() {
    document.getElementById('overlay-text-1').innerText = '';
    document.getElementById('overlay-text-2').innerText = '';
}


/*  
/*  
/*  
/*  
*/  
animateHeaderPutWordssInDivs();


/*  check for local data.
/*  as this is the last script to run,
/*  and this can run before window fully loads,
/*  this is being put here.
*/  
setFromSessionStorageTextStyles();
loadFromLocalStorage();