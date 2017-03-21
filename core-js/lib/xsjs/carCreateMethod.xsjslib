/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

$.import("xsjs", "session");
var SESSIONINFO = $.xsjs.session;

/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
*/
function carCreate(param){
	var after = param.afterTableName;    
	
	//Get Input New Record Values
	var	pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");	 
	var Car = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
	pStmt.close();

	//Get Next Car Number
	pStmt = param.connection.prepareStatement("select \"LeverXCars.sequences::carId\".NEXTVAL from dummy"); 
	var rs = pStmt.executeQuery();
	var CarId = "";
	while (rs.next()) {
		CarId = rs.getString(1);
	}
	pStmt.close();
	//Insert Record into DB Table and Temp Output Table
	for( var i = 0; i<2; i++){
		var pStmt;
		if(i<1){
			pStmt = param.connection.prepareStatement("insert into \"LeverXCars.data::core_model.Car\" values(?,?,?,?,?,?)" );			
		}else{
			pStmt = param.connection.prepareStatement("TRUNCATE TABLE \"" + after + "\"" );
			pStmt.executeUpdate();
			pStmt.close();
			pStmt = param.connection.prepareStatement("insert into \"" + after + "\" values(?,?,?,?,?,?)" );		
		}
		pStmt.setString(1, CarId.toString());
		pStmt.setString(2, Car.Details[0].CUSTID.toString());
		pStmt.setString(3, Car.Details[0].MODEL.toString());	
		pStmt.setString(4, Car.Details[0].DESCR.toString());	
		pStmt.setString(5, Car.Details[0].VIN.toString());
		pStmt.setString(6, Car.Details[0].LICPLATE.toString());	
		pStmt.executeUpdate();
		pStmt.close();
	}
}