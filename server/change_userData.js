const fs = require('fs');
const path = require('path');
const usersDataFile = path.join(__dirname, 'data', 'users.json');

module.exports = async function change_userData(new_userData, userIndex = null, jsonData = null) {
    try {
        let parsedData;
        if (!jsonData) {
            const data = fs.readFileSync(usersDataFile, 'utf8');
            parsedData = JSON.parse(data);
        } else {
            parsedData = jsonData;
        }

        let indexToModify = userIndex;
        if (!indexToModify) {
            indexToModify = parsedData.user.findIndex(user => user.id === new_userData.id);
            if (indexToModify === -1) {
                return "Can not find user";
            }
        }

        // Modify user data
        parsedData.user[indexToModify] = new_userData;

        // Write the modified data back to the JSON file
        fs.writeFileSync(usersDataFile, JSON.stringify(parsedData, null, 2));

        console.log('JSON file has been updated.');
        return "Profile updated successfully";
    } catch (error) {
        console.error('Error modifying user data:', error.message);
        throw new Error('An error occurred while modifying user data.');
    }
}
