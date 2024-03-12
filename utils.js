/**
 * Solves the knapsack problem, selecting items to maximize the total weight without exceeding capacity.
 * @param {Array} items - An array of items, each with a name and weight property.
 * @param {number} capacity - The maximum weight the knapsack can carry.
 * @returns {Array} selectedItems - An array of items that optimizes the total weight within the given capacity.
 */
function knapsack(items, capacity) {
    // Initialize the number of items.
    const n = items.length;

    // Create a 2D array (dp table) to store the maximum value at each n (items) and w (weight/capacity) pair.
    const dp = Array.from({ length: n + 1 }, () => Array.from({ length: capacity + 1 }, () => 0));

    // Populate the dp table.
    for (let i = 1; i <= n; i++) {
        const { weight } = items[i - 1];
        for (let w = 1; w <= capacity; w++) {
            // If the current item's weight is less than or equal to the current "capacity" (w),
            // decide whether to include the current item based on the maximum value.
            if (weight <= w) {
                dp[i][w] = Math.max(parseInt(weight) + dp[i - 1][w - parseInt(weight)], dp[i - 1][w]);
            } else {
                // If the current item's weight is greater than the current "capacity" (w),
                // skip the current item.
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Backtrack to find the selected items.
    let selectedItems = [];
    let w = capacity;
    for (let i = n; i > 0 && w > 0; i--) {
        // If the value comes from including the current item, add it to the selected items list.
        if (dp[i][w] !== dp[i - 1][w]) {
            const { name, weight } = items[i - 1];
            selectedItems.push({ name, weight });
            w -= parseInt(weight);
        }
    }

    return selectedItems;
}

module.exports = { knapsack };