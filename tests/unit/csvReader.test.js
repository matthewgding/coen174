const {
    csvFileToJSON
 } = require('../../public/assets/js/csvReader');

describe('csvFileToJSON', () => {
    // Mock the global fetch function
    global.fetch = jest.fn();

    it('returns an empty array when the CSV file is empty', async () => {
        const csvFile = 'empty.csv';
        global.fetch.mockResolvedValue({ text: jest.fn().mockResolvedValue('') });

        const result = await csvFileToJSON(csvFile);
        expect(result).toEqual([]);
    });

    it('returns the JSON representation of the CSV data', async () => {
        const csvFile = 'data.csv';
        const csvData = `Name,Age,City
John,25,New York
Jane,30,San Francisco`;

        global.fetch.mockResolvedValue({ text: jest.fn().mockResolvedValue(csvData) });

        const result = await csvFileToJSON(csvFile);
        expect(result).toEqual([
        { Name: 'John', Age: '25', City: 'New York' },
        { Name: 'Jane', Age: '30', City: 'San Francisco' },
        ]);
    });

    it('handles leading/trailing spaces in CSV headers and values', async () => {
        const csvFile = 'data.csv';
        const csvData = ` Name,Age,City
John,25,New York
Jane,30,San Francisco`;

        global.fetch.mockResolvedValue({ text: jest.fn().mockResolvedValue(csvData) });

        const result = await csvFileToJSON(csvFile);
        expect(result).toEqual([
        { Name: 'John', Age: '25', City: 'New York' },
        { Name: 'Jane', Age: '30', City: 'San Francisco' },
        ]);
    });
});
