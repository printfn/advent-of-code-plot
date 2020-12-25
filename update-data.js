const fs = require('fs');
const https = require('https');

if (process.argv.length < 3) {
    console.error('Please specify a session cookie.');
    process.exit(1);
}
let session = process.argv[2];

const req = https.request({
    hostname: 'adventofcode.com',
    port: 443,
    path: '/2020/leaderboard/private/view/225901.json',
    method: 'GET',
    headers: {
        Cookie: `session=${session}`
    }
}, res => {
    if (res.statusCode != 200) {
        console.error(`Invalid status code: ${res.statusCode}`);
        console.log(res.headers);
        process.exit(1);
    }

    res.on('data', data => {
        let content = `loadData(${JSON.stringify(JSON.parse(data))});`
        fs.writeFile('data.js', content, err => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            // file written successfully
        });
    });
});

req.on('error', error => {
    console.error(error);
});

req.end();
