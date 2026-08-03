const Jimp = require('jimp');

async function removeWhiteBg() {
  console.log('Loading image...');
  const image = await Jimp.read('public/logo-tmb.png');
  
  console.log('Processing pixels...');
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Simple tolerance for white
    if (r > 230 && g > 230 && b > 230) {
      this.bitmap.data[idx + 3] = 0;
    }
  });

  console.log('Saving image...');
  await image.writeAsync('public/logo-tmb-transparent.png');
  console.log('Done!');
}

removeWhiteBg().catch(console.error);
