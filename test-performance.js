// Simple performance test for the /api/markets endpoint
const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testPerformance() {
  console.log('🚀 Testing /api/markets endpoint performance...\n');
  
  const results = [];
  const iterations = 5;
  
  for (let i = 1; i <= iterations; i++) {
    const start = Date.now();
    
    try {
      const response = await fetch(`${API_URL}/api/markets`);
      const data = await response.json();
      const duration = Date.now() - start;
      
      const size = JSON.stringify(data).length;
      const sizeKB = (size / 1024).toFixed(2);
      
      results.push(duration);
      
      console.log(`Request ${i}:`);
      console.log(`  ⏱️  Time: ${duration}ms`);
      console.log(`  📦 Size: ${sizeKB}KB`);
      console.log(`  📊 Markets: ${data.length}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Request ${i} failed:`, error.message);
    }
  }
  
  if (results.length > 0) {
    const avg = (results.reduce((a, b) => a + b, 0) / results.length).toFixed(2);
    const min = Math.min(...results);
    const max = Math.max(...results);
    
    console.log('📈 Summary:');
    console.log(`  Average: ${avg}ms`);
    console.log(`  Fastest: ${min}ms`);
    console.log(`  Slowest: ${max}ms`);
    console.log('');
    
    if (avg < 200) {
      console.log('✅ Excellent performance! (<200ms)');
    } else if (avg < 500) {
      console.log('⚠️  Good performance, but could be better (200-500ms)');
    } else {
      console.log('❌ Slow performance, needs optimization (>500ms)');
    }
  }
}

testPerformance().catch(console.error);
