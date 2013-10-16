// Module dependencies
var util = require('util'),
    mysql = require('mysql'),
    config = require('./config'),
    mailer = require('./mailer');

// Application initialization
var connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    multipleStatements: true
});

function executeQuery(start, end, cb) {
    // Database setup
    var query1 = 'SELECT SUM(total_amount) AS total_wallet_addition FROM wallet.system_txn_request WHERE update_timestamp BETWEEN \'%s\' AND \'%s\'';

    var query2 = 'SELECT SUM(total_amount) AS withdrawl_from_wallet FROM wallet.system_txn_request WHERE update_timestamp BETWEEN \'%s\' AND \'%s\'';

    var query3 = 'SELECT SUM(total_amount) AS refund_to_bank FROM wallet.system_txn_request WHERE update_timestamp BETWEEN \'%s\' AND \'%s\'';

    query1 = util.format(query1, start, end);
    query2 = util.format(query2, start, end);
    query3 = util.format(query3, start, end);
    var output = '<table border = \'1\'><tr><td>Transaction Type</td><td>Amount</td></tr>';
    connection.query('USE ' + config.db, function (err) {
        if (err) throw err;
        connection.query(query1 + '; ' + query2 + '; ' + query3,
            function (err, results, fields) {
                if (err) throw err;
                output += '<tr><td>' + fields[0][0].name + '</td>';
                output += '<td>' + (results[0].total_wallet_addition || 0) + '</td></tr>';

                output += '<tr><td>' + fields[1][0].name + '</td>';
                output += '<td>' + (results[1].withdrawl_from_wallet || 0) + '</td></tr>';

                output += '<tr><td>' + fields[2][0].name + '</td>';
                output += '<td>' + (results[2].refund_to_bank || 0) + '</td></tr>';

                output += '</table>';
                sendMail(end, start, output);

            });
    });
}

function sendMail(p, d, html_msg) {
    var message = {
        generateTextFromHTML: true,
        html: html_msg,
        from: config.email.from,
        to: config.email.to,
        cc: config.email.cc,
        subject: (config.email.subject || 'Report') + ' between ' + d + ' to ' + p
    };

    mailer.sendMail(message, function (err, response) {
        //console.log(err || response.message)
    });

}

function formatDate(date) {
    //Y-m-d H:i:s
    return util.format('%s-%s-%s %s:%s:%s', date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
}

function doTask() {
    var d = new Date();
    var p = new Date(d - ((config.reporting_interval || 1) * 60 * 1000));
    executeQuery(formatDate(p), formatDate(d));
    console.log('Report at ::: ' + d);
    setTimeout(doTask, ((config.reporting_interval || 1) * 60 * 1000));
}
console.log('reporting interval set to ' + (config.reporting_interval || 1) + ' Minute(s)');
// call task with 
doTask();
