sap.ui.controller("zvscodetest.ext.controller.ListReportExt", {
	
	onInitSmartFilterBarExtension: function (oEvent) {

		this._sFilterBarId = oEvent.getSource().getId();

		if (!this._bI18nEnhanced) {

			let oI18n = this.getView().getModel("i18n");
			let sBundleURL = this.getView().getModel("i18nCustom").getResourceBundle().oUrlInfo.url;
			oI18n.enhance({
				bundleUrl: sBundleURL
			});
			this._bI18nEnhanced = true;
			this._oResourceBundle = oI18n.getResourceBundle();

		}

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

		if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {

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
			"sap/ui/export/library",
			"zvscodetest/localService/mockserver"
		], function (Spreadsheet, ExportLibrary, MockServer) {

			var oTable = this._oSmartTable.getTable();
			var oRowBinding = oTable.getBinding("items");

			var oModel = oRowBinding.getModel();
			var aCols = this._createColumnConfig(oModel);

			var oMockServer = MockServer.getMockServer();

			var oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'Level'
				},
				dataSource: {
					type: 'odata',
					dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
					serviceUrl: oModel.sServiceUrl,
					headers: oModel.getHeaders ? oModel.getHeaders() : null,
					count: oRowBinding.getLength ? oRowBinding.getLength() : null,
					useBatch: true
				},
				fileName: this._oResourceBundle.getText("txtExportFile"),
				worker: oMockServer === undefined ? true : false
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function () {
				oSheet.destroy();
			});

		}.bind(this));

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

		var aFilters = [];
		var sKeywords = sValue.split(",");

		sKeywords.forEach(sKeyword => {

			let sTrim = sKeyword.toUpperCase().trim();
			let sOperator;

			if (sTrim.includes("*")) {

				if (!sTrim.startsWith("*") && sTrim.endsWith("*")) {
					sOperator = sap.ui.model.FilterOperator.StartsWith;
				} else if (sTrim.startsWith("*") && !sTrim.endsWith("*")) {
					sOperator = sap.ui.model.FilterOperator.EndsWith;
				} else {
					sOperator = sap.ui.model.FilterOperator.Contains;
				}

				sTrim = sTrim.split("*").join("");

			} else {

				sOperator = sap.ui.model.FilterOperator.EQ;

			}

			aFilters.push(new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter({
						path: 'company_name_upper',
						operator: sOperator,
						value1: sTrim
					}),
					new sap.ui.model.Filter({
						path: 'text_upper',
						operator: sOperator,
						value1: sTrim
					}),
				],
				and: false
			}));

		});
		oBindingParams.filters.push(new sap.ui.model.Filter({
			filters: aFilters,
			and: sBool === "0" ? true : false
		}));

	},

	_createColumnConfig: function (oModel) {

		var aCols = [];

		aCols.push({
			label: oModel.getProperty("/#zcds_cons_view_soitemsType/so_id/@sap:label"),
			property: "so_id"
		});

		aCols.push({
			label: oModel.getProperty("/#zcds_cons_view_soitemsType/so_item_pos/@sap:label"),
			property: "so_item_pos"
		});

		aCols.push({
			label: oModel.getProperty("/#zcds_cons_view_soitemsType/net_amount/@sap:label"),
			property: "net_amount"
		});

		aCols.push({
			label: oModel.getProperty("/#zcds_cons_view_soitemsType/currency_code/@sap:label"),
			property: "currency_code"
		});

		return aCols;
	}

});