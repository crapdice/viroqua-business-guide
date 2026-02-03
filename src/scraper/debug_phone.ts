
import { parsePhoneNumber } from 'libphonenumber-js';

const phone = "608-637-6800";
console.log(`Testing phone: "${phone}"`);

try {
    const phoneNumber = parsePhoneNumber(phone, 'US');
    if (phoneNumber) {
        console.log("Parsed:", phoneNumber);
        console.log("Valid:", phoneNumber.isValid());
        console.log("Formatted:", phoneNumber.formatNational());
    } else {
        console.log("Parsed is undefined");
    }
} catch (e) {
    console.error("Error:", e);
}
