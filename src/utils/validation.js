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
 * @param {number} [minLen=8] Minimum Length of the Password String (default=8)
 * @param {number} [maxLen=25] Maximum Length of the Password String (default=25)
 * @param {boolean} [specialAllowed=true] Whether Special Characters are Allowed (default=true)
 * @param {boolean} [numberAllowed=true] Whether Numbers are Allowed (default=true)
 * @param {boolean} [lowercase=true] Whether lowercase is Allowed (default=true)
 * @param {boolean} [uppercase=true] Whether uppercase is Allowed (default=true)
 * @returns {boolean} Returns True if Valid Password as per provided values, otherwise false
 */
const isValidPassword = (password, minLen = 8, maxLen = 25, specialAllowed = true, numberAllowed = true, lowercase = true, uppercase = true) => {

    let passwordRegexp;
    let allowedChars = "";

    if (lowercase) {
        allowedChars += `a-z`
    }

    if (uppercase) {
        allowedChars += `A-Z`
    }

    if (numberAllowed) {
        allowedChars += `0-9`
    }

    if (specialAllowed) {
        allowedChars += ` !"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`
    }

    passwordRegexp = RegExp(`^[${allowedChars}]{${minLen},${maxLen}}$`)
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
// MARK: Exporting all Functions
export {
    isEmailValid,
    isMinMaxLengthValid,
    isValidPassword,
    isValidName,
    isEmptyField,
}