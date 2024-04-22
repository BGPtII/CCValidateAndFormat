// Visa - starts with 4, 16 total digits - NNNN NNNN NNNN NNNN
// Master card - starts with 50-55 inclusive, 16 digits - NNNN NNNN NNNN NNNN
// American express - starts with 34 or 37, 15 digits - NNNN NNNNNN NNNNN
// Other - 16 digits - NNNN NNNN NNNN NNNN

// Formats spacing in the CC Number field depending on Card Option and current length
function formatCCNumSpacing(cardText, cardNumberField, ccAmexOpt) {
    cardText = cardText.replace(/\s/g, "");

    let maxLength = ccAmexOpt.checked ? 15 : 16;
    let format = ccAmexOpt.checked ? /^(\d{4})(\d{6})(\d{5})$/ : /^(\d{4})(\d{4})(\d{4})(\d{4})$/;

    cardText = cardText.substring(0, maxLength);

    if (cardText.length !== maxLength) {
        cardNumberField.setCustomValidity(ccAmexOpt.checked ? "American Express card number must be 15 digits long" : "Card number must be 16 digits long");
    } 
    else {
        cardNumberField.setCustomValidity("");
    }

    cardText = cardText.replace(format, ccAmexOpt.checked ? "$1 $2 $3" : "$1 $2 $3 $4");

    return cardText.trim();
}

// Validate and format card number
function validateAndFormatCardNumber() {
    let cardNumberField = document.getElementById("card-number");
    let ccAmexOpt = document.getElementById("amex");
    let cardNumber = cardNumberField.value.replace(/[^0-9]/g, "");
    let cardType = "other";

    if (cardNumber.startsWith("4")) {
        cardType = "visa";
    } 
    else if (cardNumber.startsWith("50") || cardNumber.startsWith("55")) {
        cardType = "mastercard";
    } 
    else if (cardNumber.startsWith("34") || cardNumber.startsWith("37")) {
        cardType = "amex";
    }
    document.getElementById(cardType).checked = true;

    cardNumberField.value = formatCCNumSpacing(cardNumber, cardNumberField, ccAmexOpt);
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
    let selectYear = document.getElementById("expiry-year");
    let selectMonth = document.getElementById("expiry-month");
    let ccOtherOpt = document.getElementById("other");

    ccOtherOpt.checked = true;

    for (let i = new Date().getFullYear(); i <= new Date().getFullYear() + 10; i++) {
        selectYear.insertAdjacentHTML("beforeend", `<option value="${i}">${i}</option>`);
    }
    selectMonth.setCustomValidity("Select an expiry month");
    selectYear.setCustomValidity("Select an expiry year");

    selectMonth.addEventListener("change", function () {
        selectMonth.setCustomValidity(selectMonth.value ? "" : "Select an expiry month");
    });
    selectYear.addEventListener("change", function () {
        selectYear.setCustomValidity(selectYear.value ? "" : "Select an expiry year");
    });

    document.getElementById("card-number").addEventListener("input", validateAndFormatCardNumber);
    document.getElementById("ccv").addEventListener("input", function () {
        let ccvField = document.getElementById("ccv");
        ccvField.value = ccvField.value.replace(/[^0-9]/g, "");

        ccvField.setCustomValidity(ccvField.value.length < 3 ? "Invalid CCV" : "");
        ccvField.value = ccvField.value.substring(0, 3);
    });

    let cardTypeElements = document.querySelectorAll('[name="card-type"]');
    cardTypeElements.forEach(function (element) {
        element.addEventListener("change", validateAndFormatCardNumber);
    });
});
