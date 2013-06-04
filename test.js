var net = require('net'),
  fs = require('fs'),
  process = require('process'),
  dataDir = './data/',
  runAs = 'michiel';

var server = net.createServer(function(c) { //'connection' listener
  console.log('server connected');
  c.on('end', function() {
    console.log('server disconnected');
  });
  var buff = '';
  c.on('data', function(chunk) {
    var query, lines;
    buff += chunk.toString();
    lines = buff.split('\r\n');
    if(lines.length>1) {//current chunk contains a newline
      buff = lines[lines.length-1];
      var query = dataDir+lines[lines.length-2].replace(/[^a-z0-9\-\.]/gi,'');
      console.log(query, query.length);
      fs.readFile(query, function(err, data) {
        console.log(err);
        console.log(data);
        if(err) {
          c.write('404');
        } else {
          c.write(data);
          c.end();
        }
      });
    }
  });
});
server.listen(43, function() { //'listening' listener
  console.log('server bound');
});
process.setuid(runAs);
