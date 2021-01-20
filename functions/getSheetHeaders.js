async function getSheetHeaders(sheet) {
	const rows = await sheet.getRows();

	return await rows[0]['_sheet']['headerValues'];
}

module.exports.getSheetHeaders = getSheetHeaders;
