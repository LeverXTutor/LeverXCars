/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0*/
"use strict";

var conn = $.hdb.getConnection();
var query = "SELECT FROM LeverXCars.data::core_model.Car { " +
			" CARID as \"CarId\", " +
	        " CUSTID as \"CustomerId\", " +
            " MODEL as \"Model\", " +
            " DESCR as \"CarDescription\", " +
            " VIN as \"VehicleNumber\", " +
            " LICPLATE as \"LicensePlate\" " +
            " } ";
var rs = conn.executeQuery(query);

var body = "";

for(var i = 0; i < rs.length; i++){
	body += rs[i]["CarId"] + "\t" + rs[i]["CustomerId"] + "\t" + 
			rs[i]["Model"] + "\t" + rs[i]["CarDescription"] + "\t" +
			rs[i]["VehicleNumber"] + "\t" + rs[i]["LicensePlate"] + "\n";
}


$.response.setBody(body);
$.response.contentType = "application/vnd.ms-excel; charset=utf-16le";
$.response.headers.set("Content-Disposition",
		"attachment; filename=Excel.xls");
$.response.status = $.net.http.OK;