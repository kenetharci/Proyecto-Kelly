const autocannon = require('autocannon');

// Stress Test Configuration
const stressTest = autocannon({
    url: 'http://localhost:3000/api/reports',
    connections: 100, // 100 concurrent connections
    duration: 30, // 30 seconds
    pipelining: 1,
    title: 'Backend API - Stress Test'
}, (err, result) => {
    if (err) {
        console.error('Error:', err);
        return;
    }

    console.log('\n=== STRESS TEST RESULTS ===\n');
    console.log(`Total Requests: ${result.requests.total}`);
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency (avg): ${result.latency.mean}ms`);
    console.log(`Latency (p95): ${result.latency.p95}ms`);
    console.log(`Latency (p99): ${result.latency.p99}ms`);
    console.log(`Throughput: ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
    console.log(`Errors: ${result.errors}`);
    console.log(`Timeouts: ${result.timeouts}`);

    // Check if performance is acceptable
    const avgLatency = result.latency.mean;
    const errorRate = (result.errors / result.requests.total) * 100;

    console.log('\n=== PERFORMANCE ANALYSIS ===');
    console.log(`Average Latency: ${avgLatency < 500 ? '✓ PASS' : '✗ FAIL'} (${avgLatency}ms < 500ms)`);
    console.log(`Error Rate: ${errorRate < 5 ? '✓ PASS' : '✗ FAIL'} (${errorRate.toFixed(2)}% < 5%)`);
});

autocannon.track(stressTest);
