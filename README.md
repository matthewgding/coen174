# SCU Schedule Maker

A website where SCU undergraduate students can input the classes they want to take for the upcoming quarter, and the website will display all possible schedules without time conflicts for the student to choose from.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

To install the project, navigate to the project's GitHub repository. At the top right, click on the "<> Code" button and select one of the download options. The project will then download to your local device.

## Usage

To use the website, simply open the index.html file in a web browser. This can be done by double clicking on the index.html file within the project folder, which will automatically open it in your default web browser. The project is also accessible at https://matthewgding.github.io/coen174/.

To run tests, first, ensure Node.js is installed on your computer. It's recommended to download the LTS version at https://nodejs.org/en. Next, open a new terminal and navigate to the project's directory, 'coen174'. In the terminal, run "npx jest --verbose", and the test files will automatically run and display a report containing the test results. If the command fails due to permission issues with "jest", use the command "chmod 755 node_modules/.bin/jest" from the main project directory.

## Features

- Search Courses: All available courses for the upcoming are displayed and the user can search for specific courses by name.
- Selected Courses List: The user can select the courses they want from the search list and add it to the selected courses list.
- Schedule: The website will generate all possible schedules without time conflicts from the courses in the selected courses list.

## Contact

Developers: 
- Matthew Ding (mgding@scu.edu)
- Xiomara Quinonez (xquinonez@scu.edu)
- Aaron Ancheta (anancheta@scu.edu)
- Chris Tamayo (ctamayo@scu.edu)
