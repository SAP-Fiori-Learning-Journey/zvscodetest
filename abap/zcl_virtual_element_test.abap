CLASS zcl_virtual_element_test DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.

    INTERFACES if_sadl_exit .
    INTERFACES if_sadl_exit_calc_element_read .

    TYPES: tt_zcds_cons_view_soitems TYPE STANDARD TABLE OF zcds_cons_view_soitems WITH DEFAULT KEY.

ENDCLASS.


CLASS zcl_virtual_element_test IMPLEMENTATION.

  METHOD if_sadl_exit_calc_element_read~calculate.

    DATA(lt_data) = CONV tt_zcds_cons_view_soitems( it_original_data ).
    LOOP AT lt_data ASSIGNING FIELD-SYMBOL(<ls_data>).
      <ls_data>-virtual = |Virtual Element { sy-tabix ALIGN = LEFT }|.
    ENDLOOP.

    ct_calculated_data = CORRESPONDING #( lt_data ).

  ENDMETHOD.

  METHOD if_sadl_exit_calc_element_read~get_calculation_info.

  ENDMETHOD.

ENDCLASS.