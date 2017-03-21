/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0*/
jQuery.sap.declare("leverx.carCrud.Component");

sap.ui.core.UIComponent.extend("leverx.carCrud.Component", {
	init: function(){
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.m.MessageToast");		
		
		var oParams = {};
		oParams.json = true;
		oParams.defaultBindingMode = sap.ui.model.BindingMode.TwoWay;
		oParams.defaultUpdateMethod = "PUT";
		oParams.useBatch = false;
	    var oModel = new sap.ui.model.odata.v2.ODataModel("/xsodata/car.xsodata/", oParams);

	    sap.ui.getCore().setModel(oModel, "carModel");  
	          
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
	},
	
	createContent: function() {

		var settings = {
			ID: "carCrud",
			title: "LeverX Cars",
			description: "Service for Car OData CRUD"
		};
		
		var oView = sap.ui.view({
			id: "app",
			viewName: "leverx.carCrud.odataView.App",
			type: "XML",
			viewData: settings
		});
		
		 oView.setModel(sap.ui.getCore().getModel("carModel"), "carModel");   
		return oView;
	}
});
