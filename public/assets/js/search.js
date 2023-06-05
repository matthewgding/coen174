// Implementation
async function main() {
    await connectToDatabase();
    if (!(await isCoursesDataUploaded())) {
        console.log("populating courses");
        const csvFile = "misc/SCU_Find_Course_Sections_Fall_2023.csv"
        const coursesJSON = await csvFileToJSON(csvFile);
        await uploadCoursesData(coursesJSON);
    }
    implementSearchBar();
    const objectStoreCourses = await getAllObjectStoreData('courses');
    await populateSearchCourseList(objectStoreCourses);
    initializeSelectedCoursesList();
    console.log("closed");
}
main();