const { spawn } = require('child_process');
const path = require('path');

console.log('Starting server regression test...');

// Start the server process
const serverProcess = spawn('node', ['src/index.js'], {
  cwd: path.join(__dirname),
  stdio: 'pipe'
});

let output = '';
let errorOutput = '';
let started = false;

serverProcess.stdout.on('data', (data) => {
  const str = data.toString();
  output += str;
  console.log('STDOUT:', str.trim());

  // Check if server started successfully
  if (str.includes('Server running on port') && !started) {
    started = true;
    console.log('✅ Server started successfully!');
  }
});

serverProcess.stderr.on('data', (data) => {
  const str = data.toString();
  errorOutput += str;
  console.error('STDERR:', str.trim());
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);

  if (code === 0 && started) {
    console.log('✅ Regression test passed: Server starts without crashing.');
  } else {
    console.log('❌ Regression test failed: Server crashed or failed to start.');
    if (errorOutput) {
      console.log('Error details:', errorOutput);
    }
  }

  // Exit the test script
  process.exit(code);
});

// Timeout after 10 seconds if server doesn't start
setTimeout(() => {
  if (!started) {
    console.log('❌ Timeout: Server did not start within 10 seconds.');
    serverProcess.kill();
    process.exit(1);
  }
}, 10000);
