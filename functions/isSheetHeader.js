async function isSheetHeader(input, sheet) {
    let rows = sheet.getRows();
    let headerRow = (await rows).shift();
    if (headerRow[input] || headerRow[input] == '') return true;
    return false;
}

module.exports.isSheetHeader = isSheetHeader;