const fs = require('fs');
const path = require('path');

// Ruta a la carpeta que quieres leer
const folderPath = path.join(__dirname+'/..', 'public', 'images');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error leyendo la carpeta:', err);
    return;
  }

  let arrayImages = `export const ArrayImages = [`;
    for(let file of files){
      arrayImages += `'${file}',`;
    }
  arrayImages += `];`;
  
  fs.writeFile('src/data/ImagesData.ts', arrayImages, (err) => {
    if (err) throw err;
  });

});