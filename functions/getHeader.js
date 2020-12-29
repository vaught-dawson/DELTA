async function getHeader(headers, input) {
    let header = await headers.filter((header) => header.toLowerCase() == input.toLowerCase());
    if (header.length > 0) {
        return header[0];
    } else {
        return undefined;
    }
}

module.exports.getHeader = getHeader;