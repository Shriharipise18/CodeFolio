const fs = require('fs');
const path = require('path');

async function testUpload() {
    const filePath = path.join(__dirname, 'dummy_resume.pdf');

    // Create dummy PDF if it doesn't exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '%PDF-1.4\n%EOF');
        console.log('Created dummy PDF');
    }

    const formData = new FormData();
    const blob = new Blob([fs.readFileSync(filePath)], { type: 'application/pdf' });
    formData.append('file', blob, 'resume.pdf');

    try {
        const response = await fetch('http://localhost:8081/api/ai/parse-resume', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testUpload();
