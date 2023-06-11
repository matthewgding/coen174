// Implementation of schedule.html
async function main() {
    try {
        await connectToDatabase();
        const selectedCoursesSections = await getSelectedCoursesSections();
        console.log("selected course sections", selectedCoursesSections);
    
        const scheduleCombinations = getAllCombinations(selectedCoursesSections);
        console.log("all schedule combinations", scheduleCombinations);
    
        const possibleSchedules = getPossibleSchedules(scheduleCombinations);
        console.log("possible schedules", possibleSchedules);
    
        populateSchedules(possibleSchedules);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
  
main();