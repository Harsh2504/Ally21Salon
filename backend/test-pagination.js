const { z } = require('zod');

// Test the pagination schema that accepts both strings and numbers
const paginationSchema = z.object({
  page: z.union([
    z.string().regex(/^\d+$/, 'Page must be a number').transform(Number),
    z.number().int().min(1)
  ]).optional().default(1),
  limit: z.union([
    z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number),
    z.number().int().min(1).max(100)
  ]).optional().default(10)
});

// Test data - various combinations
const testCases = [
  // String inputs (should work)
  { page: '1', limit: '10' },
  { page: '2', limit: '20' },
  
  // Number inputs (should work)
  { page: 1, limit: 10 },
  { page: 2, limit: 20 },
  
  // Mixed inputs (should work)
  { page: '1', limit: 10 },
  { page: 1, limit: '10' },
  
  // Empty object (should use defaults)
  {},
  
  // Only one parameter
  { page: 2 },
  { limit: 15 },
  
  // Invalid inputs (should fail)
  { page: 'invalid', limit: 10 },
  { page: 1, limit: 'invalid' },
  { page: -1, limit: 10 },
  { page: 1, limit: 101 }
];

console.log('Testing Pagination Schema...\n');

testCases.forEach((testCase, index) => {
  try {
    const result = paginationSchema.parse(testCase);
    console.log(`✅ Test ${index + 1}:`, JSON.stringify(testCase), '→', JSON.stringify(result));
  } catch (error) {
    console.log(`❌ Test ${index + 1}:`, JSON.stringify(testCase), '→', error.errors?.[0]?.message || error.message);
  }
});

console.log('\n🎉 Pagination validation tests completed!');