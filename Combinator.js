// Javascript program to find combinations from n
// arrays such that one element from each
// array is present
// arrays such that one element from each
// array is present

// Function to generate array of combinations that
// contain indices representing one element from
// each of the given arrays of objects

// Array of resulting combinations
let combinations = new Array();

function print(courses) {

    // Number of arrays
    let n = courses.length;

    // Create array parralel to courses with data
    // entries being indices
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
        arr[i] = new Array(courses[i].length);
        for (let j = 0; j < courses[i].length; j++) {
            courses[i][j] = j;
        }
    }

    // To keep track of next element in
    // each of the n arrays
    let indices = new Array(n);

    // Initialize with first element's index
    for(let i = 0; i < n; i++)
        indices[i] = 0;

    let comboIndex = 0;
    while (true)
    {
        combinations.push(new Array());

        // Add current combination
        for(let i = 0; i < n; i++)
            combinations[comboIndex].push(arr[i][indices[i]]);

        comboIndex++;

        // Find the rightmost array that has more
        // elements left after the current element
        // in that array
        let next = n - 1;
        while (next >= 0 && (indices[next] + 1 >=
            arr[next].length))
            next--;

        // No such array is found so no more
        // combinations left
        if (next < 0)
            return;

        // If found move to next element in that
        // array
        indices[next]++;

        // For all arrays to the right of this
        // array current index again points to
        // first element
        for(let i = next + 1; i < n; i++)
            indices[i] = 0;
    }
}