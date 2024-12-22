export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('dateFormat', (value) => {
        const month = new Date(value).getMonth();
        const date = new Date(value).getDate();
        const day = new Date(value).getDay();
        let weekday = "";

        if (day === 0) weekday = "日";
        if (day === 1) weekday = "一";
        if (day === 2) weekday = "二";
        if (day === 3) weekday = "三";
        if (day === 4) weekday = "四";
        if (day === 5) weekday = "五";
        if (day === 6) weekday = "六";
        const string = month + 1 + " 月 " + date + " 日" + " 星期" + weekday;
        return string;
    });
});