export interface PageHeaderType {
    title?: string;
    datetime?: Date;
    topic?: string[];
    tags?: string[];
    filepath?: string;
}

export function getPageHeaderString(page: string): string {
    // regex matching /* ... */        

    try {
        return page.match(/\/\*([\s\S]*)\*\//)[0];
    } catch { return ''; }
}

export function getPageHeader(page: string): PageHeaderType {
    // get page header in strings including /*, */
    var str = getPageHeaderString(page);
    // remove /* and */
    var tmp;
    try {
        tmp = JSON.parse(str.substring(2, str.length - 2));
    } catch {
        tmp = {}
    }

    // reformat 
    return {
        title: tmp.title,
        datetime: new Date(tmp.date),
        topic: tmp.topic,
        tags: tmp.tags
    };
}

export function getPageContent(page: string): string {
    return page.replace(getPageHeaderString(page), '');
}

export function getDateString(d: Date, formatstr: string) {
    if (!d.valueOf()) return " ";

    const weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
    const weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return formatstr.replace(
        /(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|KA\/P|EA\/P)/gi,
        (formatchar: string): string => {
            switch (formatchar) {
                case "yyyy": return d.getFullYear().toString(); // 년 (4자리)
                case "yy": return (d.getFullYear() % 1000).toString().padStart(2, "0"); // 년 (2자리)
                case "MM": return (d.getMonth() + 1).toString().padStart(2, "0"); // 월 (2자리)
                case "dd": return d.getDate().toString().padStart(2, "0"); // 일 (2자리)
                case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
                case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
                case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
                case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
                case "HH": return d.getHours().toString().padStart(2, "0"); // 시간 (24시간 기준, 2자리)
                case "hh": return ((d.getHours() % 12) ? d.getHours() % 12 : 12).toString().padStart(2, "0"); // 시간 (12시간 기준, 2자리)
                case "mm": return d.getMinutes().toString().padStart(2, "0"); // 분 (2자리)
                case "ss": return d.getSeconds().toString().padStart(2, "0"); // 초 (2자리)
                case "KA/P": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
                case "EA/P": return d.getHours() < 12 ? "AM" : "PM"; // 오전/오후 구분
                default: return formatchar;
            }
        });
}

