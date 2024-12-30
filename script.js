document.getElementById('process').addEventListener('click', () => {
    const classFile = document.getElementById('classList').files[0];
    const submittedFile = document.getElementById('submittedList').files[0];

    if (!classFile || !submittedFile) {
        alert('Please upload both files!');
        return;
    }

    // Function to parse CSV file into a cleaned list of names
    const parseCSV = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const lines = reader.result
                    .split(/\r?\n/) // Split by line
                    .map(line => line.split(',')[0].trim()) // Extract first column and trim whitespace
                    .filter(line => line); // Remove empty lines
                resolve(lines);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    };

    Promise.all([parseCSV(classFile), parseCSV(submittedFile)])
        .then(([classList, submittedList]) => {
            // Log parsed lists for debugging
            console.log("Class List (Parsed):", classList);
            console.log("Submitted List (Parsed):", submittedList);

            // Convert both lists to lowercase for case-insensitive comparison
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
