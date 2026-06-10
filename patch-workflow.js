const fs=require('fs');
let c=fs.readFileSync('dist/workflow.js','utf8');
c=c.replace('return puppeteer_1.default.launch(browserOptions);','const opts=browserOptions;return opts.browserWSEndpoint?puppeteer_1.default.connect(opts):puppeteer_1.default.launch(opts);');
fs.writeFileSync('dist/workflow.js',c);
console.log('patched');
