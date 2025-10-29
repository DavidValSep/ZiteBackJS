/**
 * Simple validation test for ZiteBackCore module
 * Tests module instantiation and basic functionality without Puppeteer
 */

const ZiteBackCore = require('../src/core/ZiteBackCore');

console.log('Testing ZiteBackCore module...\n');

// Test 1: Module can be instantiated
console.log('Test 1: Module instantiation');
try {
  const core = new ZiteBackCore();
  console.log('✓ Core module instantiated successfully');
  console.log('✓ Initial state - isRunning:', core.isRunning);
} catch (error) {
  console.error('✗ Failed to instantiate core module:', error.message);
  process.exit(1);
}

// Test 2: Event emitter works
console.log('\nTest 2: Event emitter functionality');
try {
  const core = new ZiteBackCore();
  let logReceived = false;
  
  core.on('log', (logEntry) => {
    logReceived = true;
    console.log('✓ Log event received:', logEntry.message);
  });
  
  core.log('Test message', 'info');
  
  if (!logReceived) {
    throw new Error('Log event not received');
  }
  
  console.log('✓ Event emitter working correctly');
} catch (error) {
  console.error('✗ Event emitter test failed:', error.message);
  process.exit(1);
}

// Test 3: Module structure
console.log('\nTest 3: Module structure validation');
try {
  const core = new ZiteBackCore();
  const requiredMethods = ['clone', 'backup', 'analyze', 'clean', 'stop', 'log'];
  
  for (const method of requiredMethods) {
    if (typeof core[method] !== 'function') {
      throw new Error(`Missing required method: ${method}`);
    }
  }
  
  console.log('✓ All required methods present:', requiredMethods.join(', '));
} catch (error) {
  console.error('✗ Module structure validation failed:', error.message);
  process.exit(1);
}

console.log('\n✓ All tests passed! Core module is valid.');
console.log('\nNote: Full Puppeteer integration tests require browser installation.');
console.log('      Run these tests in a full environment with: PUPPETEER_SKIP_DOWNLOAD=false npm install\n');
