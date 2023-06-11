/**
 * Converts a CSV file into an array of JSON objects.
 *
 * @param {string} csvFile - The URL or path of the CSV file to be converted.
 * @returns {Promise<Array<Object>>} A Promise that resolves to an array of JSON objects representing the CSV data.
 * @throws {Error} If there is an error fetching the CSV file or converting it to JSON.
 */
async function csvFileToJSON(csvFile) {
    const response = await fetch(csvFile);
    const data = await response.text();
    const lines = data.split("\n");
    const headers = lines[0].split(",");
    const result = [];
    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

module.exports = {
    csvFileToJSON
}