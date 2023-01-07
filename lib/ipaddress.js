const IPv4regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    IPv6regex = /^.+$/;

export async function isValidIPAddress(ipAddress) {
    return isValidIPv4Address(ipAddress) || isValidIPv6Address(ipAddress);
}

export async function isValidIPv4Address(ipAddress) {
    if (typeof ipAddress !== 'string') {
        throw new Error('IPv4 address is not a string')
    }

    return ipAddress.match(IPv4regex);
}

export async function isValidIPv6Address(ipAddress) {
    if (typeof ipAddress !== 'string') {
        throw new Error('IPv6 address is not a string')
    }

    return ipAddress.match(IPv6regex);
}