

/**
 * Formats spacing in the CC Number field depending on Card Option and current length
 * @param {*} cardText - Current entered Card Number as a string of digits
 * @returns the CC Number with the correct spacing format applied
 */
function formatCCNumSpacing(cardText) {
    cardText = cardText.replace(/\s/g, ""); // Condense CC letter/remove white space from String
    // Format Amex spacing
    if (cardText.length < 15 || cardText.length >= 16) {
        cardNumberField.setCustomValidity("Incorrect number of digits");
    }
    else {
        cardNumberField.setCustomValidity("");
    }
    if (ccAmexOpt.checked == true) {
        if (cardText.length < 5) {
            cardText = cardText.substring(0, 4) + " " + cardText.substring(4);
        }
        else {
            cardText = cardText.substring(0, 4) + " " + cardText.substring(4, 10) + " " + cardText.substring(10);
        }
    return cardText;
    }
    // Format every other card spacing
    else {
        cardText = cardText.replace(/\s/g, "");
        if (cardText.length < 16) {
            cardNumberField.setCustomValidity("Incorrect number of digits");
        }
        else {
            cardNumberField.setCustomValidity("");
        }
        if (cardText.length > 5) {
            cardText = cardText.replace(/.{4}/g, "$& "); // Add a space every 4 characters
        }
    }
    return cardText.trim();
}

let selectYear = document.getElementById("expiry-year");
let selectMonth = document.getElementById("expiry-month");
let cardNumberField = document.getElementById("card-number");
let ccvField = document.getElementById("ccv");
let ccVisaOpt = document.getElementById("visa");
let ccMastercardOpt = document.getElementById("mastercard");
let ccAmexOpt = document.getElementById("amex");
let ccOtherOpt = document.getElementById("other");

// HTML Body load handling
document.body.onload = () => {
    ccOtherOpt.checked = true; // Other option checked by default
    // Add next 10 years for year selections
    for (let i = 2022; i <= 2031; i++) {
        let yearOption = document.createElement("option");
        yearOption.innerText = i;
        selectYear.appendChild(yearOption);
    }
    // Validation message for default month selection - "Month"
    if (selectMonth.options[selectMonth.selectedIndex].text === "Month") {
        selectMonth.setCustomValidity("Select an expiry month");
    }
    // Validation message for default year selection - "Year"
    if (selectYear.options[selectYear.selectedIndex].text === "Year") { 
        selectYear.setCustomValidity("Select an expiry year");
    }
}

// Expiry-Month Validation
selectMonth.onchange = () => {
    if (selectMonth.options[selectMonth.selectedIndex].text !== "Month") {
        selectMonth.setCustomValidity("");
    }
    else {
        selectMonth.setCustomValidity("Select an expiry month");
    }
}
// Expiry-Year Validation
selectYear.onchange = () => {
    if (selectYear.options[selectYear.selectedIndex].text !== "Year") {
        selectYear.setCustomValidity("");
    }
    else {
        selectYear.setCustomValidity("Select an expiry year");
    }
}

// Credit Card Number - Change selected CC option depending on field values
cardNumberField.oninput = () => {
    cardNumberField.value = cardNumberField.value.replace(/[^0-9]/g, ""); // Get rid of any characters that aren't numerical 0-9
    // Determine Visa
    if (cardNumberField.value[0] == "4") {
        cardNumberField.setCustomValidity("");
        ccVisaOpt.checked = true;
    }
    else {
        cardNumberField.setCustomValidity("Card number does not match card type");
    }
    // Determine Mastercard
    if (cardNumberField.value.substring(0, 2) == "50" || cardNumberField.value.substring(0, 2) == "55") {
        cardNumberField.setCustomValidity("");
        ccMastercardOpt.checked = true;
    }
    else {
        cardNumberField.setCustomValidity("Card number does not match card type");
    }
    // Determine Amex
    if (cardNumberField.value.substring(0, 2) == "34" || cardNumberField.value.substring(0, 2) == "37") {
        cardNumberField.setCustomValidity("");
        ccAmexOpt.checked = true;
    }
    else {
        cardNumberField.setCustomValidity("Card number does not match card type");
    }
    if (!ccVisaOpt.checked && !ccMastercardOpt.checked && !ccAmexOpt.checked) { // Other
        cardNumberField.setCustomValidity("");
        ccOtherOpt.checked = true;
    }

    // Format length of card number depending on card type
    if (ccAmexOpt.checked == true && cardNumberField.value.replace(/\s/g, "").length > 16) { // Cut off card number at 15 digits if Amex
        cardNumberField.value = cardNumberField.value.substring(0, 15);
    }
    else { // Any other card cut off at 16 digits
        cardNumberField.value = cardNumberField.value.substring(0, 16);
    }

    // Format card number spacing depending on card type selected
    if (ccVisaOpt.checked) { // Visa
        cardNumberField.value = formatCCNumSpacing(cardNumberField.value);
    }
    else if (ccMastercardOpt.checked) { // Mastercard
        cardNumberField.value = formatCCNumSpacing(cardNumberField.value);
    }
    else if (ccAmexOpt.checked) { // Amex
        cardNumberField.value = formatCCNumSpacing(cardNumberField.value);
    }
    else { // Other
        cardNumberField.value = formatCCNumSpacing(cardNumberField.value);
    }

    // Determine validity for card number length

}

// CCV Validation
ccvField.oninput = () => {
    ccvField.value = ccvField.value.replace(/[^0-9]/g, "");
    if (ccvField.value.length < 3) {
        ccvField.setCustomValidity("Invalid CCV");
    }
    else if (ccvField.value.length == 3) {
        ccvField.setCustomValidity("");
    }
    else if (ccvField.value.length > 3) {
        ccvField.value = ccvField.value.substring(0, 3);
    }
}

// Visa: check card number validity, update format if correct
ccVisaOpt.onchange = () => {
    if (ccVisaOpt.checked) {
        if (cardNumberField.value[0] !== "4") {
            cardNumberField.setCustomValidity("Card number does not match type");
        }
        else {
            cardNumberField.setCustomValidity("");
        }
        cardNumberField.value = formatCCNumSpacing(cardNumberField.value);
    }
}
// Master card: check card number validity, update format if correct
ccMastercardOpt.onchange = () => {
    if (ccMastercardOpt.checked) {
        if (cardNumberField.value.substring(0, 2) !== "50" || cardNumberField.value.substring(0, 2) !== "55") {
            cardNumberField.setCustomValidity("Card number does not match card type");
        }
        else {
            cardNumberField.setCustomValidity("");
        }
        cardNumberField.value = formatCCNumSpacing(cardNumberField.value);
    }
}
// American Express: check card number validity, update format if correct
ccAmexOpt.onchange = () => {
    if (ccAmexOpt.checked) {
        if (cardNumberField.value.substring(0, 2) !== "34" || cardNumberField.value.substring(0, 2) !== "37") {
            cardNumberField.setCustomValidity("Card number does not match card type");
        }
        else {
            cardNumberField.setCustomValidity("");
        }
        cardNumberField.value = formatCCNumSpacing(cardNumberField.value);
    }
}
// Other: check card number validity, update format if correct
ccOtherOpt.onchange = () => {
    if (ccOtherOpt.checked) {
        cardNumberField.setCustomValidity("");
        cardNumberField.value = formatCCNumSpacing(cardNumberField.value);
    }
}