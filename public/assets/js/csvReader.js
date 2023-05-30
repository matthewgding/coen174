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
            obj[headers[j].trim()] = currentline[j].trim();
        }
        result.push(obj);
    }
    return result;
}

module.exports = {
    csvFileToJSON
}