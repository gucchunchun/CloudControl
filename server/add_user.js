const fs = require('fs');
const path = require('path');
const usersDataFile = path.join(__dirname, 'data', 'users.json');

module.exports = async function add_user(id, pwd, jsonData = null) {
    try {
        let parsedData;
        if (!jsonData) {
            const data = fs.readFileSync(usersDataFile, 'utf8');
            parsedData = JSON.parse(data);
        } else {
            parsedData = jsonData;
        }

        parsedData.user.push({
            id: id,
            pwd: pwd,
            data: {
                name: {
                    first: null,
                    middle: null,
                    last: null,
                },
                email: null,
                phone: null,
                birthday: {
                    year: null,
                    month: null,
                    day: null,
                },
                country: null,
                address: null,
                gender: null,
                updatedFiles: [],
            },
        });

        fs.writeFileSync(usersDataFile, JSON.stringify(parsedData, null, 2));

        console.log('JSON file has been updated.');
        return "Sign up complete. Welcome " + id;
    } catch (error) {
        console.error('Error adding user:', error.message);
        throw new Error('An error occurred while adding the user.');
    }
    //sssss
}
