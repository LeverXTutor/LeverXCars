function createCar(data){
	var output = '';
	try { 
		var conn = $.db.getConnection();
		var query = 'CALL "LeverXCars.procedures::createCar"(?, ?, ?, ?, ?, ?)';
		var cst = conn.prepareCall(query);
		cst.setString(1, data.CUSTID);
		cst.setString(2, data.MODEL);
		cst.setString(3, data.DESCR);
		cst.setString(4, data.VIN);
		cst.setString(5, data.LICPLATE);
		var info = {};
		info.text = "";
		cst.execute();
		info.text =  cst.getString(6);
		output += info.text;
	}catch(e){
		output += "jddk" + ":\n" + e.toString() + "\n--------\n\n";  
	} 
	conn.commit();
	conn.close();
	$.response.contentType = "text/html";
	$.response.status = $.net.http.OK;
	$.response.setBody(output);
}

var acmd = $.request.parameters.get("cmd");
switch (acmd) {
case "createCar":
  var data = {};
  data.CUSTID = $.request.parameters.get("CUSTID");
  data.MODEL = $.request.parameters.get("MODEL");
  data.DESCR = $.request.parameters.get("DESCR");
  data.VIN = $.request.parameters.get("VIN");
  data.LICPLATE = $.request.parameters.get("LICPLATE");
  createCar(data);
  break;
default:
  $.response.status = $.net.http.OK;
  $.response.setBody("Invalid command: " + acmd);
}