export const RequisitionLocators = {
  REQUISITION_MENU: '//li[@role="menuitem"]//span[text()="Requisition"]',
  REQUISITION_MENU_BY_ID:
    '//li[@data-menu-id="/main/requisition"] | //li[contains(@data-menu-id,"/main/requisition")]',
  ITEM_SELECT: 'table tbody tr .ant-select',
  DATE_NEEDED_INPUT: 'input[placeholder="Select date"]',
  PROGRAM_SELECT:
    '.ant-select:has(.ant-select-selection-placeholder:text-is("Select or type a program"))',
  TIME_FROM_INPUT: 'input[placeholder="From"]',
  TIME_TO_INPUT: 'input[placeholder="To"]',
  ROOM_INPUT: 'input[placeholder="Enter room number"]',
  COURSE_CODE_SELECT:
    '.ant-select:has(.ant-select-selection-placeholder:text-is("Select or type a Course Code"))',
  USAGE_TYPE_SELECT: 'select:has(option[value="Laboratory Experiment"])',
  FINALIZE_BUTTON: 'button.finalize-btn',
  CONFIRM_SUBMIT_BUTTON: '//button[.//span[text()="Confirm and Submit"]]',
  ANT_SELECT_OPTION: '.ant-select-item-option, [role="option"]',
  PICKER_DROPDOWN: '.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)',
  SELECT_DROPDOWN: '.ant-select-dropdown:not(.ant-select-dropdown-hidden)',
  RESPONSIBILITY_CHECKBOX: 'input.ant-checkbox-input[type="checkbox"]',
};
