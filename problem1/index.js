var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function(n) {
    if (n === 1) {
        return 1;
    }
    return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function(n) {
    return (n * (n + 1)) / 2;
};

const testCases = [5, 10, 100, 1000]; 

// Run tests
testCases.forEach((n) => {
    console.log(`Testing with n = ${n}:`);
    console.log(`sum_to_n_a(${n}) =`, sum_to_n_a(n));
    console.log(`sum_to_n_b(${n}) =`, sum_to_n_b(n));
    console.log(`sum_to_n_c(${n}) =`, sum_to_n_c(n));
    console.log("-----------------------------");
});