const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw err;
    } else {
      var filePath = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
  // items[id] = text;
  // callback(null, { id, text });

};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw err;
    } else {
      callback(null,
        files.map((file) => {
          var id = file.slice(0, 5);
          var text = file.slice(0, 5);
          return { id, text };
        })
      );
    }
  });
};


exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id: id, text: fileData.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(`No item with id: ${id}`);
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
