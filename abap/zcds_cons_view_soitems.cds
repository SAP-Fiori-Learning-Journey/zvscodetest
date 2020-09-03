@AbapCatalog: {
    sqlViewName: 'ZCDS_SOITEMS',
    compiler.compareFilter: true,
    preserveKey: true
}
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Sales Order Consumption View'
@VDM.viewType: #CONSUMPTION
@OData.publish: true
@UI.headerInfo: {
    typeName: 'Sales Order List Report',
    typeNamePlural: 'Sales Order List Report'
}
@Search.searchable: true
/*+[hideWarning] { "IDS" : [ "KEY_CHECK" ]  } */
define view zcds_cons_view_soitems
  as select distinct from epm_v_sales_data
  association [0..1] to zcds_employee_vh as _Employees on $projection.created_by = _Employees.employee_id
{
      @UI: {
        selectionField.position: 10,
        lineItem.position: 10
      }
  key so_id,

      @UI.lineItem.position: 20
  key so_item_pos,

      @UI: {
        selectionField.position: 20,
        lineItem.position: 30
      }
      @Consumption.valueHelp: '_Employees'
      created_by,

      @UI: {
        selectionField.position: 30,
        lineItem.position: 40
      }
      created_at,

      @UI.lineItem.position: 50
      @Search: {
        defaultSearchElement: true,
        fuzzinessThreshold: 0.8,
        ranking: #HIGH
      }
      company_name,

      @UI.hidden: true
      upper(company_name)         as company_name_upper,

      @UI: {
        lineItem.position: 60,
        selectionField.position: 40
      }
      country,

      @UI.lineItem.position: 70
      net_amount,

      @UI.hidden: true
      currency_code,

      @UI.lineItem.position: 80
      quantity,

      @UI.hidden: true
      quantity_unit,

      @UI: {
        selectionField.position: 50,
        lineItem.position: 90
      }
      product_id,

      @UI.lineItem.position: 100
      @Search: {
        defaultSearchElement: true,
        fuzzinessThreshold: 0.8,
        ranking: #HIGH
      }
      text,

      @UI.hidden: true
      upper(text)                 as text_upper,

      @EndUserText.label: 'Virtual Element'
      @UI.lineItem.position: 110
      @ObjectModel: {
          readOnly: true,
          virtualElement: true,
          virtualElementCalculatedBy: 'ABAP:ZCL_VIRTUAL_ELEMENT_TEST'
      }
      cast('' as abap.char(50))   as virtual,

      _Employees
}
where
  language = $session.system_language
