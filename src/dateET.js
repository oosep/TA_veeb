//function dateNowFormattedET(){
exports.dateNowFormattedET = fuction(){
	let timeNow = new Date ();
	const monthNamesET= ["jaanuar, veebruar, marts, aprill, mai, juuni, juuli, august, september, oktoober, november, detsember"];
	return timeNow.getDate () + "." 
	
const formatDateFromDB = function(dateFromDb) {
    const givenDate = new Date(dateFromDb);
    const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", 
                         "juuli", "august", "september", "oktoober", "november", "detsember"];
    return givenDate.getDate() + ". " + monthNamesET[givenDate.getMonth()] + " " + givenDate.getFullYear();
};

module.exports = {
    fullDate: dateNowFormattedET, 
    fullTime: timeNowFormattedET, 
    weekDay: weekDayNowET, 
    partOfDay: partOfDay,
    formatDateFromDB: formatDateFromDB
};