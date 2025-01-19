const fs = require('fs');
const csv = require('csv-parser');

// Delete existing files if they exist
try {
    fs.unlinkSync('canada.txt');
    console.log('canada.txt file deleted');
} catch (err) {
    console.log('canada.txt file does not exist');
}

try {
    fs.unlinkSync('usa.txt');
    console.log('usa.txt file deleted');
} catch (err) {
    console.log('usa.txt file does not exist');
}

// Create write streams for output files
const canadaStream = fs.createWriteStream('canada.txt');
const usaStream = fs.createWriteStream('usa.txt');

// Write headers to both files
canadaStream.write('country,year,population\n');
usaStream.write('country,year,population\n');

// Read and filter the CSV data
fs.createReadStream('input_countries.csv')
    .pipe(csv())
    .on('data', (row) => {
        // Create the output line
        const line = `${row.country},${row.year},${row.population}\n`;
        
        // Write to appropriate file based on country
        if (row.country === 'Canada') {
            canadaStream.write(line);
        } else if (row.country === 'United States') {
            usaStream.write(line);
        }
    })
    .on('end', () => {
        // Close the write streams
        canadaStream.end();
        usaStream.end();
        console.log('CSV file processing completed');
    })
    .on('error', (error) => {
        console.error('Error reading CSV file:', error);
    });