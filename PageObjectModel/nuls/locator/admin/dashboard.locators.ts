export const DashboardLocators = {
  USER_PROFILE_HEADER: '//div[contains(@class,"user-profile")]',
  OK_BUTTON_MODAL: '//button[.//span[text()="OK"]]',
  CLOSE_BUTTON_MODAL: 'button.close-btn.close-top-right',
  CALENDAR_TAB: '//div[@role="tab" and contains(text(),"Calendar")]',
  CALENDAR_DATE: '//div[contains(@class,"ant-picker-calendar-date-content")]',
  CRITICAL_STOCKS_BUTTON: '//div[contains(@class,"card-content-layout")][.//p[contains(text(),"Critical Stocks")]]',
  INVENTORY_MENU: '//li[@role="menuitem"]//span[text()="Inventory"]',
  INVENTORY_MENU_BY_ID: '//li[@data-menu-id="/main/inventory"] | //li[contains(@data-menu-id,"/main/inventory")]',
  ADMIN_PANEL: '//div[contains(@class,"ant-menu-submenu-title")][.//span[text()="Admin Panel"]]',
  REQUISITION_MENU: '//li[@role="menuitem"]//span[text()="Requisition"]',
  REQUISITION_MENU_BY_ID:
    '//li[@data-menu-id="/main/requisition"] | //li[contains(@data-menu-id,"/main/requisition")]',
};