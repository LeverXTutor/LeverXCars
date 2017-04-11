/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.controller("controller.App2", {
	onInit: function() {
		var model = new sap.ui.model.json.JSONModel({});
		this.getView().setModel(model);
	},

	callCarService: function() {
		var oModel = sap.ui.getCore().getModel("carModel");
		var result = this.getView().getModel().getData();
		var oEntry = {};
		oEntry.CARID = "00000000";
		oEntry.CUSTID = result.CustId;
		oEntry.MODEL = result.Model;
		oEntry.DESCR = result.Descr;
		oEntry.VIN = result.Vin;
		oEntry.LICPLATE = result.LicPlate;
		
		oModel.setHeaders({
			"content-type": "application/json;charset=utf-8"
		});
		
		jQuery.ajax({
			url: "/xsjs/createCar.xsjs?cmd=createCar",
			method: 'POST',
			data: oEntry,
			success: function(sentimentData, textStatus, jqXHR) { // callback called when data is received
		        sap.m.MessageToast.show(jqXHR.responseText);
		    },
			error:  function(jqXHR, textStatus, errorThrown){
				sap.m.MessageToast.show(jqXHR.responseText);
			}
		});
		
		oModel.refresh();
	},

	callDeleteSelected: function() {
		var oTable = this.getView().byId("TableCar");
		var oModel = sap.ui.getCore().getModel("carModel");

		if (oTable !== null) {
			for (var path in oTable.getSelectedContextPaths()) {
				oModel.remove(oTable.getSelectedContextPaths()[path], {
					success: function(oData, oResponse) {
						sap.m.MessageToast.show("Deleted successfully");
						oModel.refresh(true);
					},
					error: function(oError) {
						sap.m.MessageToast.show("Failure during delete");
						oModel.refresh(true);
					}
				});
			}
			oTable.removeSelections();
		}
	},

	callCarUpdate: function() {
		var oModel = sap.ui.getCore().getModel("carModel");
		oModel.setHeaders({
			"content-type": "application/json;charset=utf-8"
		});

		var oEntry = {};
		var oTable = sap.ui.getCore().byId("TableCar");

		for (var property in oModel.mChangedEntities) {
			oEntry = oModel.oData[property];

			for (var changedField in oModel.mChangedEntities[property]) {
				if (changedField.toString() !== "__metadata") {
					oEntry[changedField] = oModel.mChangedEntities[property][changedField];
				}
			}
			delete oEntry.__metadata;
			delete oEntry.CarService;
			delete oEntry.CarCustomer;

			oModel.update("/" + property.toString(), oEntry, {
				success: function(oData, oResponse) {
					sap.m.MessageToast.show("updated Successfully");

				},
				error: function(oError) {
					sap.m.MessageToast.show("failure");
				}
			});
		}

		//var mParams = {};
		//mParams.error = function() {
		//	sap.m.MessageToast.show("Update failed");
		//};
		//mParams.success = function() {
		//	sap.m.MessageToast.show("Update successful");
		//};
		//
		//oModel.submitChanges(mParams);
	},

	onErrorCall: function(oError) {
		if (oError.statusCode === 500 || oError.statusCode === 400) {
			var errorRes = JSON.parse(oError.responseText);
			if (!errorRes.error.innererror) {
				sap.m.MessageBox.alert(errorRes.error.message.value);
			} else {
				if (!errorRes.error.innererror.message) {
					sap.m.MessageBox.alert(errorRes.error.innererror.toString());
				} else {
					sap.m.MessageBox.alert(errorRes.error.innererror.message);
				}
			}
			return;
		} else {
			sap.m.MessageBox.alert(oError.response.statusText);
			return;
		}
	},

	onBatchDialogPress: function() {
		var view = this.getView();
		view._bDialog = sap.ui.xmlfragment(
			"odataView.batchDialog", this // associate controller with the fragment
		);
		view._bDialog.addStyleClass("sapUiSizeCompact");
		view.addDependent(this._bDialog);
		view._bDialog.addContent(view.getController().getItem(true));
		view._bDialog.open();
	},

	onDialogCloseButton: function() {
		this.getView()._bDialog.close();
	},

	getItem: function(isFirstRow) {
		var view = this.getView();
		var addIcon = new sap.ui.core.Icon({
			src: "sap-icon://add",
			color: "#006400",
			size: "1.5rem",
			press: function() {
				view._bDialog.addContent(view.getController().getItem(false));
			}
		});

		var deleteIcon = new sap.ui.core.Icon({
			src: "sap-icon://delete",
			color: "#49311c",
			size: "1.5rem",
			press: function(oEvent) {
				view._bDialog.removeContent(oEvent.oSource.oParent.sId);
			}
		});

		var icon;
		if (isFirstRow) {
			icon = addIcon;
		} else {
			icon = deleteIcon;
		}
		icon.addStyleClass("iconPadding");

		var carIdTxt = new sap.m.Label({
			text: "Car Id"
		});
		carIdTxt.addStyleClass("alignText");
		var carIdInput = new sap.m.Input({});

		var custIdTxt = new sap.m.Label({
			text: "Customer Id"
		});
		custIdTxt.addStyleClass("alignText");
		var custIdInput = new sap.m.Input({});

		var modelTxt = new sap.m.Label({
			text: "Model"
		});
		modelTxt.addStyleClass("alignText");
		var modelInput = new sap.m.Input({});

		var descrTxt = new sap.m.Label({
			text: "Description"
		});
		descrTxt.addStyleClass("alignText");
		var descrInput = new sap.m.Input({});

		var vinTxt = new sap.m.Label({
			text: "Vin"
		});
		vinTxt.addStyleClass("alignText");
		var vinInput = new sap.m.Input({});

		var licPlateTxt = new sap.m.Label({
			text: "License Plate"
		});
		licPlateTxt.addStyleClass("alignText");
		var licPlateInput = new sap.m.Input({});

		return new sap.m.FlexBox({
			// enableFlexBox: true,
			//    fitContainer: true,
			//  justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			items: [carIdTxt,
				carIdInput,
				custIdTxt,
				custIdInput,
				modelTxt,
				modelInput,
				descrTxt,
				descrInput,
				vinTxt,
				vinInput,
				licPlateTxt,
				licPlateInput,
				icon
			]
		});
	},

	onSubmitBatch: function() {
		var view = this.getView();
		var content = view._bDialog.getContent();
		var newCarList = [];
		for (var i = 0; i < content.length; i++) {
			var car = {};
			car.CARID = content[i].getItems()[1].getValue();
			car.CUSTID = content[i].getItems()[3].getValue();
			car.MODEL = content[i].getItems()[5].getValue();
			car.DESCR = content[i].getItems()[7].getValue();
			car.VIN = content[i].getItems()[9].getValue();
			car.LICPLATE = content[i].getItems()[11].getValue();
			newCarList.push(car);
		}

		//create an array of batch changes and save        
		var batchModel = new sap.ui.model.odata.ODataModel("/xsodata/car.xsodata/", true);
		var batchChanges = [];
		for (var k = 0; k < newCarList.length; k++) {
			batchChanges.push(batchModel.createBatchOperation("/Car", "POST", newCarList[k]));
		}
		batchModel.addBatchChangeOperations(batchChanges);
		//submit changes and refresh the table and display message  
		batchModel.submitBatch(function() {

				var oModel = sap.ui.getCore().getModel("carModel");
				oModel.refresh();
				view._bDialog.close();
				sap.m.MessageToast.show(k + " cars created");
			},
			view.getController().onErrorCall
		);

	}

});