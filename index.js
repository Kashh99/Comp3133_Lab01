const fs = require('fs');
const csv = require('csv-parser');

// Utility function to delete a specified file if it exists on the filesystem
const deleteFile = (fileName) => {
  try {
    fs.unlinkSync(fileName);
    console.log(`Successfully deleted existing file: ${fileName}`);
  } catch (err) {
    console.log(`File does not exist: ${fileName}. No action taken.`);
  }
};

// Ensure the output files are removed before processing to avoid appending to old data
deleteFile('canada.txt');
deleteFile('usa.txt');

// Create writable streams to generate output files for filtered data
const canadaStream = fs.createWriteStream('canada.txt');
const usaStream = fs.createWriteStream('usa.txt');

// Add headers to the output files to match the input file structure
canadaStream.write('country,year,population\n');
usaStream.write('country,year,population\n');

// Read data from the input CSV file, process it, and filter based on country
fs.createReadStream('input_countries.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Normalize the country name to lowercase for consistent comparison
    const country = row.country.toLowerCase();
    const line = `${country},${row.year},${row.population}\n`;

    // Route the data to the appropriate file based on the country
    if (country === 'canada') {
      canadaStream.write(line);
    } else if (country === 'united states') {
      usaStream.write(line);
    }
  })
  .on('end', () => {
    // Safely close the write streams after processing all data
    canadaStream.end();
    usaStream.end();
    console.log('Data filtering and file creation completed successfully.');
  })
  .on('error', (error) => {
    // Log any errors encountered while reading the input file
    console.error('An error occurred while processing the CSV file:', error.message);
  });
