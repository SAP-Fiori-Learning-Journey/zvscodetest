sap.ui.controller("zvscodetest.ext.controller.ListReportExt", {

	onInitSmartFilterBarExtension: function (oEvent) {

		this._sFilterBarId = oEvent.getSource().getId();

		var oI18n = this.getView().getModel("i18n");
		var sBundleURL = this.getView().getModel("i18nCustom").getResourceBundle().oUrlInfo.url;
		oI18n.enhance({
			bundleUrl: sBundleURL
		});

		this._oResourceBundle = oI18n.getResourceBundle();

	},

	getCustomAppStateDataExtension: function (oEvent) {

		var oComboBox = this.byId("customFilter-boolean");
		if (!oComboBox.getSelectedKey()) {
			oComboBox.setSelectedKey("0");
		}

	},

	onBeforeRebindTableExtension: function (oEvent) {

		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};

		var oSmartTable = this._oSmartTable = oEvent.getSource();
		var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());

		const SmartFilterBar = sap.ui.require("sap/ui/comp/smartfilterbar/SmartFilterBar");
		if (oSmartFilterBar instanceof SmartFilterBar) {

			let oCustomBoolean = this.byId("customFilter-boolean");
			let sBool = oCustomBoolean.getSelectedKey();

			let oCustomSearch = this.byId("customFilter-search");
			let sValue = oCustomSearch.getValue();

			if (sValue) {
				this._addCustomFilter(sValue, sBool, oBindingParams);
			}

		}

	},

	onExportToExcelzcds_cons_view_soitems: function (oEvent) {

		sap.ui.require([
			"sap/ui/export/Spreadsheet",
			"zvscodetest/localService/mockserver",
			"sap/m/MessageBox"
		], (Spreadsheet, MockServer, MessageBox) => {

			var oTable = this._oSmartTable.getTable();
			var oRowBinding = oTable.getBinding("items");

			var oModel = oRowBinding.getModel();
			var aCols = this._createColumnConfig(oModel);

			var oMockServer = MockServer.getMockServer();
			var oResourceBundle = this._oResourceBundle;

			var oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'Level',
					context: {
						sheetName: oResourceBundle.getText("txtSheetName")
					}
				},
				dataSource: {
					type: 'odata',
					dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
					serviceUrl: oModel.sServiceUrl,
					headers: oModel.getHeaders ? oModel.getHeaders() : null,
					count: oRowBinding.getLength ? oRowBinding.getLength() : null,
					useBatch: true
				},
				fileName: oResourceBundle.getText("txtExportFile"),
				worker: !oMockServer ? true : false
			};

			var oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.catch(sMessage => {
					MessageBox.error(sMessage);
				})
				.finally(() => {
					oSheet.destroy();
				});

		});

	},

	onClearFilterszcds_cons_view_soitems: function (oEvent) {

		var oCustomBoolean = this.byId("customFilter-boolean");
		oCustomBoolean.setSelectedKey();

		var oCustomSearch = this.byId("customFilter-search");
		oCustomSearch.setValue();

		if (this._sFilterBarId) {
			let oSmartFilterBar = this.byId(this._sFilterBarId);
			oSmartFilterBar.fireClear();
		}

	},

	_addCustomFilter: function (sValue, sBool, oBindingParams) {

		const FilterOperator = sap.ui.require("sap/ui/model/FilterOperator");
		const Filter = sap.ui.require("sap/ui/model/Filter");

		var aFilters = [];
		var sKeywords = sValue.split(",");

		sKeywords.forEach(sKeyword => {

			let sTrim = sKeyword.toUpperCase().trim();
			let sOperator;

			if (sTrim.includes("*")) {

				if (!sTrim.startsWith("*") && sTrim.endsWith("*")) {
					sOperator = FilterOperator.StartsWith;
				} else if (sTrim.startsWith("*") && !sTrim.endsWith("*")) {
					sOperator = FilterOperator.EndsWith;
				} else {
					sOperator = FilterOperator.Contains;
				}

				sTrim = sTrim.split("*").join("");

			} else {

				sOperator = FilterOperator.EQ;

			}

			aFilters.push(new Filter({
				filters: [
					new Filter({
						path: 'company_name_upper',
						operator: sOperator,
						value1: sTrim
					}),
					new Filter({
						path: 'text_upper',
						operator: sOperator,
						value1: sTrim
					}),
				],
				and: false
			}));

		});

		oBindingParams.filters.push(new Filter({
			filters: aFilters,
			and: sBool === "0" ? true : false
		}));

	},

	_createColumnConfig: function (oModel) {

		var aConfig = this.getView().getModel("excelColumns").getData();
		var aColumns = [];

		aConfig.forEach(sColumn => {
			aColumns.push({
				label: oModel.getProperty(`/#zcds_cons_view_soitemsType/${sColumn}/@sap:label`),
				property: sColumn
			});
		});

		return aColumns;

	}

});