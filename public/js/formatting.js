export const formatCardNumber = (cardNumber) => {
    return cardNumber.replace(/(\d{4})(?=\d)/g, "$1-");
};

export const formatCardStatus = (status) => {
    switch (status) {
        case 0:
            return "Inactive";
        case 1:
            return "Active";
        case 2:
            return "Blocked";
        default:
            return "Unknown";
    }
};

export const formatAuthorityLabel = (authority) => {
    switch (authority) {
        case 0:
            return 'Blocked/Deleted';
        case 1:
            return 'User';
        case 2:
            return 'Admin';
        default:
            return 'Unknown';
    }
};

