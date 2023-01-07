export async function isValidIPAddress(ipAddress) {
    return isValidIPv4Address(ipAddress) || isValidIPv6Address(ipAddress);
}

export async function isValidIPv4Address(ipAddress) {

    return true;
}

export async function isValidIPv6Address(ipAddress) {

    return true;
}