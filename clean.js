const folderPath = path.join(__dirname, 'artifact');
const extensions = ['.ts', '.js', '.map'];

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

function removeFiles(folderPath) {
  const files = fs.readdirSync(folderPath);

  files
    .filter((file) => {
      const filePath = `${folderPath}/${file}`;

      if (fs.lstatSync(filePath).isDirectory()) {
        removeFiles(filePath);
        rimraf.sync(filePath);

        return false;
      }

      return extensions.includes(path.extname(file).toLowerCase());
    })
    .forEach((file) => {
      fs.unlinkSync(`${folderPath}/${file}`);
    });
}

removeFiles(folderPath);
