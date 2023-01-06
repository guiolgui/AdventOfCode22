const fs = require('fs');
// tools.js
// ========
module.exports = {
    readFileSync: function(sFilename){
        return new Promise(function (ok, notOk) {
            fs.readFile(sFilename,'utf8', function (err, data) {
                if (err) {
                    notOk(err)
                } else {
                    ok(data)
                }
            })
        })
    },
    writeFileSync: function (sFilename,data) {
        return new Promise(function (ok, notOk) {
            fs.writeFile(sFilename,data,'utf8', function (err) {
                if (err) {
                    notOk(err)
                } else {
                    ok(data)
                }
            })
        })

    }
};