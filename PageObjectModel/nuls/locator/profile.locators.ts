export const ProfileLocators = {
    PROFILE_MENU: '//li[@role="menuitem"]//span[text()="Profile"]',
    PROFILE_MENU_BY_ID: '//li[@data-menu-id="/main/profile"] | //li[contains(@data-menu-id,"/main/profile")]',
    PROFILE_PAGE_HEADER: '//h1[contains(text(),"Profile")]',
    PROFILE_PAGE_SUBHEADER: '//h2[contains(text(),"Profile Information")]',
    PROFILE_PAGE_SUBHEADER2: '//h2[contains(text(),"Change Password")]',
    PROFILE_PAGE_SUBHEADER3: '//h2[contains(text(),"Two-Factor Authentication")]',
}