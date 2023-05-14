async function csvFileToJSON(csv) {
    const response = await fetch(csv);
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

function convertStandardTimeToMilitaryTime(standardTime) {
    const time = standardTime.split(" ")[0];
    let hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const meridiem = standardTime.split(" ")[1];    

    if (meridiem === "PM" && hour < 12) {
        hour = parseInt(hour) + 12;
    }
    if (meridiem == "AM" && hour == 12) {
        hour = 0;
    }

    return (parseInt(hour) * 100) + parseInt(minute);
}   

console.log(convertStandardTimeToMilitaryTime("10:20 AM"));
console.log(convertStandardTimeToMilitaryTime("12:20 PM"));
console.log(convertStandardTimeToMilitaryTime("1:49 PM"));
console.log(convertStandardTimeToMilitaryTime("11:05 PM"));
console.log(convertStandardTimeToMilitaryTime("12:20 AM"));

// Implementation
async function main() {
    const data = await csvFileToJSON("SCU_Find_Course_Sections_Fall_2023.csv");
}

main();