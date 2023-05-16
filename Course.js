class Course {
    constructor(id, title, teacher, units, days, startTime, endTime, room) {
        this.id = id;
        this.title = title;
        this.teacher = teacher;
        this.units = units;
        this.days = days;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
    }
}

const fs = require('fs');

function loadCoursesFromCSV(filePath) {
    const csvData = fs.readFileSync(filePath, 'utf-8');
    const lines = csvData.split('\n');
    const courses = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line !== '') {
            const values = line.split(',');

            if (values.length === 8) {
                const id = parseInt(values[0]);
                const title = values[1];
                const teacher = values[2];
                const units = parseInt(values[3]);
                const days = values[4].split(';');
                const startTime = values[5];
                const endTime = values[6];
                const room = values[7];

                const course = new Course(id, title, teacher, units, days, startTime, endTime, room);
                courses.push(course);
            }
        }
    }
    return courses;
}