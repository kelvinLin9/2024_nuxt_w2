const weekdayArray= ["日","一","二","三","四","五","六"]

export const dateFormat = (value) => {
    const month = new Date(value).getMonth();
    const date = new Date(value).getDate();
    const day = new Date(value).getDay();
    let weekday = weekdayArray[day];
  
    const string = month + 1 + " 月 " + date + " 日" + " 星期" + weekday;
    return string;
};

export const priceformat = (value) => {
    const price = parseInt(value)
    if(isNaN(price)) return
  return'NT$ '+price.toLocaleString()
}