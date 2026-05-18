const fs = require('fs');
const path = require('path');
const apiDir = path.join(__dirname, 'app', 'api');
const targetDir = path.join(__dirname, 'app', '_api');

if (fs.existsSync(apiDir)) {
    if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.renameSync(apiDir, targetDir);
    console.log('Successfully renamed app/api to app/_api');
} else {
    console.log('app/api does not exist');
}
