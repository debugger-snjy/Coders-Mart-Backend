// ====================================================================================================================================================
// MARK: Function to Check Valid Email
/**
* Function to Check for Email Validation
 *
 * @param {string} email String to be Checked for the Email
 * @returns {boolean} Returns True if a Valid Email, otherwise false
 */
const isEmailValid = (email) => {

    let emailRegexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    return emailRegexp.test(email);

}



// ====================================================================================================================================================
// MARK: Function to Check Value Length
/**
 * Function to Check whether the text have a Valid range
 *
 * @param {string} [text=""] String to be Check
 * @param {number} [minLen=3] Minimum Length of the String (default=3)
 * @param {number} [maxLen=100] Maximum Length of the String (default=100)
 * @returns {boolean} Returns True if a Value with Provided Lengths, Otherwise False
 */
const isMinMaxLengthValid = (text = "", minLen = 3, maxLen = 100) => {
    return (text.length >= minLen && text.length <= maxLen)
}



// ====================================================================================================================================================
// MARK: Function to Check Valid Password
/**
 * Function to Check Whether the Password is Valid or not
 *
 * @param {text} password Password String
 * @returns {boolean} Returns True if Valid Password as per provided values, otherwise false
 */
const isValidPassword = (password) => {

    let passwordRegexp = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
    console.log(passwordRegexp.source);

    return passwordRegexp.test(password)
}



// ====================================================================================================================================================
// MARK: Function to Check Valid Name
/**
 * Function to Check whether the given value is valid name or not (Alphabet and space allowed)
 *
 * @param {string} value String Value that we want to check
 * @returns {boolean} Returns true if the name is valid, else returns false
 */
const isValidName = (value) => {
    const nameRegexp = /^[a-zA-Z ]+$/;
    return nameRegexp.test(value);
}



// ====================================================================================================================================================
// MARK: Function to Check Empty Field
/**
 * Function that will check whether the value is Empty or not
 *
 * @param {string} value String that we want to check
 * @returns {boolean} Returns true if it is empty, else return false
 */
const isEmptyField = (value) => {
    return !(value?.trim() !== "" && value !== undefined)
}



// ====================================================================================================================================================
// MARK: Function to Check Valid Phone
/**
* Function to Check for Phone Validation
 *
 * @param {string} phone String to be checked for the Phone number
 * @returns {boolean} Returns True if a Valid Phone Number, otherwise false
 */
const isValidPhoneNumber = (phone) => {

    let phoneRegexp = /^[7-9]{1}[0-9]{9}$/;
    return phoneRegexp.test(phone);

}



/**
 * Function to Check For Validation for all Fields Empty or not
 *
 * @param {object} allFields Object that have key-value pair, key will be field name and the value will be the value of that field
 * @returns {object} Returns Object with isEmpty and message
 */
const isAnyFieldEmpty = (allFields) => {

    let emptyFields = [];
    let message = "";
    let isEmpty = false;

    Object.keys(allFields).forEach((field) => {

        if (allFields[field].trim() === "" || allFields[field] === "") {
            emptyFields.push(field[0].toUpperCase() + field.slice(1).toLowerCase());
            isEmpty = true;
        }
    })

    if (emptyFields.length === 1) {
        message = emptyFields[0] + " is Empty"
    }
    else if (emptyFields.length > 1) {
        message = emptyFields.join(", ") + " are Empty !!"
    }
    else if (emptyFields.length === 0) {
        message = "All Fields are Filled";
    }

    return { isEmpty, message };
}


// ====================================================================================================================================================
// MARK: Exporting all Functions
export {
    isEmailValid,
    isMinMaxLengthValid,
    isValidPassword,
    isValidName,
    isEmptyField,
    isValidPhoneNumber,
    isAnyFieldEmpty
}