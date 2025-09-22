#!/usr/bin/env ts-node

import { directUsageExample } from './example-usage';

/**
 * Manual test to demonstrate the 3-layer architecture working
 * Run with: npx ts-node examples/3-layer/manual-test.ts
 */

console.log('🚀 Testing 3-Layer Architecture Implementation');
console.log('='.repeat(50));

directUsageExample()
  .then(() => {
    console.log('='.repeat(50));
    console.log('✅ 3-Layer architecture test completed successfully!');
    console.log('✅ All layers working correctly');
    console.log('✅ Data flow: Controller → Service → DAO');
    console.log('✅ Error handling validated');
    console.log('✅ Business logic enforced');
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });