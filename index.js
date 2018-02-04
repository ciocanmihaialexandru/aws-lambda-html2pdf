var wkhtmltopdf = require('wkhtmltopdf');
var MemoryStream = require('memorystream');
var AWS = require('aws-sdk');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = function(event, context) {
  var memStream = new MemoryStream();

  wkhtmltopdf('https://ciocanmihaialexandru.com/', { pageSize: 'A3', enableSmartShrinking: true }, function(code, signal) {
    var pdf = memStream.read();
    var s3 = new AWS.S3();

    var params = {
      Bucket : "ciocanmihaialexandru.com",
      Key : "my-resume.pdf",
      Body : pdf
    }

    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err)
      } else {
        context.done(null, { });
      }
    });
  }).pipe(memStream);
};