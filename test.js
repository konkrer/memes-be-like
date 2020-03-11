const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const image = document.getElementById('source');

image.addEventListener('load', e => {
    var img = new Image();
    img.src = image.getAttribute('src');
    canvas.width = img.width;
    console.log(image.height)
    canvas.height = img.height;
    img.onload = function() {
        ctx.drawImage(image, 0, 0);
      };
    
});