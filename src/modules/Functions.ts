export const checkDarkMode = (styles: {
    readonly [key: string]: string;
} ) => {
    const isDark = localStorage.getItem("isDarkMode");
    const bodyClass = document.body.classList;
    if (isDark == "light" || isDark == null) {
        bodyClass.remove(styles.darkTheme);
    } else {
        bodyClass.add(styles.darkTheme);
    }
};