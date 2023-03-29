import { toast } from "react-toastify";

export const checkDarkMode = (styles: {
    readonly [key: string]: string;
} ) => {
    const isDark = localStorage.getItem("isDarkMode");
    const bodyClass = document.body.classList;
    if (isDark == "light" || isDark == null) {
        bodyClass.remove(styles.darkTheme);
        localStorage.setItem("isDarkMode", "light");
    } else {
        bodyClass.add(styles.darkTheme);
        localStorage.setItem("isDarkMode", "dark");
    }
};

export const toggleDarkMode = (styles: {
    readonly [key: string]: string;
} ) => {
    const isDark = localStorage.getItem("isDarkMode");
    const bodyClass = document.body.classList;
    if (isDark == "light" || isDark == null) {
        bodyClass.add(styles.darkTheme);
        localStorage.setItem("isDarkMode", "dark");
    } else {
        bodyClass.remove(styles.darkTheme);
        localStorage.setItem("isDarkMode", "light");
    }
};

export const toastError = (msg: string) => {
    if (localStorage.getItem("isDarkMode") == "dark") {
        toast.error(msg, {
            theme: "dark"
        });
    } else {
        toast.error(msg, {
            theme: "light"
        });
    }
}