const autocannon = require('autocannon');

// Heavy Stress Test Configuration
const heavyStressTest = autocannon({
    url: 'http://localhost:3000/api/reports',
    connections: 1000, // 1000 concurrent connections
    duration: 30, // 30 seconds
    pipelining: 1,
    title: 'Backend API - Heavy Stress Test (1000 connections)'
}, (err, result) => {
    if (err) {
        console.error('Error:', err);
        return;
    }

    console.log('\n=== HEAVY STRESS TEST RESULTS (1000 Connections) ===\n');
    console.log(`Total Requests: ${result.requests.total}`);
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency (avg): ${result.latency.mean}ms`);
    console.log(`Latency (p95): ${result.latency.p95}ms`);
    console.log(`Latency (p99): ${result.latency.p99}ms`);
    console.log(`Throughput: ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
    console.log(`Errors: ${result.errors}`);
    console.log(`Timeouts: ${result.timeouts}`);

    // Analysis
    console.log('\n=== ANALYSIS ===');
    if (result.errors > 0 || result.timeouts > 0) {
        console.log('⚠️ System is struggling under 1000 connections');
        console.log(`Error Rate: ${((result.errors / result.requests.total) * 100).toFixed(2)}%`);
    } else {
        console.log('✅ System handled 1000 connections without errors!');
    }
});

autocannon.track(heavyStressTest);
