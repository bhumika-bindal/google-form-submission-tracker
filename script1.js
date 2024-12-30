document.getElementById('process').addEventListener('click', () => {
    const classFile = document.getElementById('classList').files[0];
    const submittedFile = document.getElementById('submittedList').files[0];

    if (!classFile || !submittedFile) {
        alert('Please upload both files!');
        return;
    }

    // Function to parse class list CSV
    const parseClassList = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const lines = reader.result
                    .split(/\r?\n/) // Split by line
                    .map(line => line.trim()) // Trim whitespace
                    .filter(line => line); // Remove empty lines
                resolve(lines);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    };

    // Function to parse submitted list CSV
    const parseSubmittedList = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const rows = reader.result.split(/\r?\n/).map(row => row.split(',')); // Split by lines and commas
                const headers = rows.shift(); // Extract header row
                console.log("Headers in Submitted List:", headers);

                // Find the index of the "Name" column
                const nameIndex = headers.findIndex(header => header.toLowerCase().includes("name"));
                if (nameIndex === -1) {
                    reject("No 'Name' column found in the submitted CSV file.");
                    return;
                }

                // Extract names from the corresponding column
                const names = rows.map(row => row[nameIndex]?.trim()).filter(name => name); // Trim and filter empty names
                resolve(names);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    };

    Promise.all([parseClassList(classFile), parseSubmittedList(submittedFile)])
        .then(([classList, submittedList]) => {
            console.log("Class List (Parsed):", classList);
            console.log("Submitted List (Extracted Names):", submittedList);

            // Normalize names for case-insensitive comparison
            const submittedSet = new Set(submittedList.map(name => name.toLowerCase()));
            const missingStudents = classList.filter(
                name => !submittedSet.has(name.toLowerCase())
            );

            console.log("Missing Students:", missingStudents);

            // Display the missing students
            const missingListElement = document.getElementById('missingStudents');
            missingListElement.innerHTML = ''; // Clear previous results
            if (missingStudents.length === 0) {
                missingListElement.innerHTML = '<li>All students have submitted the form!</li>';
            } else {
                missingStudents.forEach(student => {
                    const li = document.createElement('li');
                    li.textContent = student;
                    missingListElement.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error processing files:', error);
            alert('An error occurred. Please check the console for details.');
        });
});
