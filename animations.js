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

/*  check for local data.
/*  as this is the last script to run,
/*  and this can run before window fully loads,
/*  this is being put here.
*/  
setFromSessionStorageTextStyles();
loadFromLocalStorage();