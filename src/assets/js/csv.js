const fs = require('../../../node_modules/fs')

function readCsv(){
    fs.createReadStream('../port.csv')
    .pipe(csv())
    .on('data', (row) => {
      console.log(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}


function myTest(){
    alert('this is a test');
    console.log('hola');
}

$(function(){
    alert('hello, external js');
});