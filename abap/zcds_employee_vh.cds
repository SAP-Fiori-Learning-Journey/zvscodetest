@AbapCatalog: {
    sqlViewName: 'ZCDS_EMP_VH',
    compiler.compareFilter: true,
    preserveKey: true
}
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Value Help for Employees'
@Search.searchable: true
@OData.publish: true
/*+[hideWarning] { "IDS" : [ "KEY_CHECK" ]  } */
define view zcds_employee_vh
  as select from snwd_employees
{
  key employee_id,
      first_name,
      
      @Search: {
        defaultSearchElement: true,
        fuzzinessThreshold: 0.8
      }
      last_name
}