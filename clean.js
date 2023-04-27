const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'artifact');

const extensions = ['.ts', '.js', '.map'];

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files
    .filter((file) => extensions.includes(path.extname(file).toLowerCase()))
    .forEach((file) => {
      fs.unlinkSync(`${directoryPath}/${file}`);
    });
});
