const autocannon = require('autocannon');

// Load Test Configuration
const loadTest = autocannon({
    url: 'http://localhost:3000/api/reports',
    connections: 10, // 10 concurrent connections
    duration: 30, // 30 seconds
    pipelining: 1,
    title: 'Backend API - Load Test'
}, (err, result) => {
    if (err) {
        console.error('Error:', err);
        return;
    }

    console.log('\n=== LOAD TEST RESULTS ===\n');
    console.log(`Total Requests: ${result.requests.total}`);
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency (avg): ${result.latency.mean}ms`);
    console.log(`Latency (p95): ${result.latency.p95}ms`);
    console.log(`Latency (p99): ${result.latency.p99}ms`);
    console.log(`Throughput: ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
    console.log(`Errors: ${result.errors}`);
    console.log(`Timeouts: ${result.timeouts}`);
});

autocannon.track(loadTest);
