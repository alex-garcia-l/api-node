const path = require('path');
const { v4: uuidv4 } = require('uuid');

const extensions = ['png', 'jpg', 'jpeg', 'gif'];
const size = 5; // 5mb

/**
 * 
 * @param {file} File 
 * @param {validExtensions} Array default: ['png', 'jpg', 'jpeg', 'gif'] 
 * @param {folder} String default: '' 
 * @param {maxSize} Number default: 5 in MB 
 * @returns Promise
 */
const uploadOneFile = ({ file, validExtensions = extensions, folder = '', maxSize = size }) => {
  return new Promise((resolve, reject) => {
    let extension = file.name.split('.');
    extension = extension[extension.length - 1];

    if (!validExtensions.includes(extension)) {
      const msg = `The extension ${extension} is not valid (${validExtensions}).`;
      reject({ msg, statusCode: 400 })
    }

    if (file.size > (maxSize * 1024 * 1024)) {
      const msg = `The maximum size should be ${maxSize}mb.`;
      reject({ msg, statusCode: 400 })
    }

    const name = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', folder, name);

    file.mv(uploadPath, (error) => {
      if (error) {
        reject({ msg: error, statusCode: 500 })
      }

      resolve({
        name,
        relativePath: 'uploads/' + folder,
        fullRelativePath: 'uploads/' + folder + name
      })
    });
  })
}

module.exports = {
  uploadOneFile
}
