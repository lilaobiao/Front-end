
/**
 * 判断是否为闰年
 * param
 * */
function isLeapYear(year){
  return (year%4==0&&year%100!=0)||year%400==0;
}
// 某年某月多少天
function getMonthDays(year,month){
  var arr = [31,28,31,30,31,30,31,30,31,31,30,31];
  var days = arr[month];
  if((year%4==0&&year%100!=0)||year%400==0){
      days = 29;
  }
  return days;
}
function dateFormat(date,fmt){
  var date = new Date(date);
  var o = {
    "M+" : date.getMonth() + 1,
    // 月份
    "d+" : date.getDate(),
    // 日
    "h+" : date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
    // 小时
    "H+" : date.getHours(),
    // 小时
    "m+" : date.getMinutes(),
    // 分
    "s+" : date.getSeconds(),
    // 秒
    "q+" : Math.floor((date.getMonth() + 3) / 3),
    // 季度
    "S" : date.getMilliseconds()
    // 毫秒
  };
  var week = {
    "0" : "/u65e5",
    "1" : "/u4e00",
    "2" : "/u4e8c",
    "3" : "/u4e09",
    "4" : "/u56db",
    "5" : "/u4e94",
    "6" : "/u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
            RegExp.$1,
            ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f"
                : "/u5468")
                : "")
            + week[date.getDay() + ""]);
  }
  for ( var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
// 获取最近几天的日期
function getTheLatestDays(num,str){
  let arr = [];
  let split = str || '-';
  let seconds = (new Date()).getTime();
  function fill(num){
    return num<10?'0'+num:num;
  }
  for(let i = 0; i < num; i ++){
    let day = new Date(seconds - 86400000 * i);
    arr.push(day.getFullYear()+split+fill(day.getMonth()+1)+split+day.getDate());
  }
  return arr.reverse();
}
// 获取距离某个月最近的几个月
function getTheLatestMonth(num,opt){
  let option  = opt || {};
  let arr = [];
  let split = option.split || '-';
  let day = option.startMonth ? new Date(option.startMonth) : new Date();
  let cm = day.getMonth()+1;
  let cy = day.getFullYear();
  let startY = cy;
  let startM = cm;
  function fill(num){
    return num<10?'0'+num:num;
  }
  if(option.after){ // 往后推
    if(option.notIncludeNow){
      startM += 1;
    }
    for(let  i = 0; i < num; i ++){
      if(startM > 12){
        startM = 1;
        startY += 1;
      }
      arr.push(startY+split+fill(startM));
      startM += 1;
    }
  }else{ // 默认往前
    if(option.notIncludeNow){
      cm -= 1;
    }
    let rest = cm - num;
    if( rest >= 0 ){
      startM = rest;
    }else{ // 只要月份不够，起始年就要减一
      startY -= 1;
      rest = rest*-1; // 差多少个月
      let ys = Math.floor(rest / 12); // 循环几年
      let rm = rest - ys * 12 // 剩下的月份
      startY = startY - ys;
      startM = 12 - rm;
    }
    for(let  i = 0; i < num; i ++){
      startM += 1;
      if(startM > 12){
        startM = 1;
        startY += 1;
      }
      arr.push(startY+split+fill(startM));
    }
  }
  return arr;
}
// 获取三个月前的今天
function getThreeMonthAgoDay(startDate){
  // 计算三个月前
  var d = new Date();
  if(startDate && startDate instanceof Date){
    d = startDate;
  }
  let y = d.getFullYear(), m = d.getMonth()+1, date = d.getDate();
  if(m-3<0){
    y = y -1;m = 12 + (m - 3)
  }else{
    m = m - 3;
  }
  if(m == 2 && date >= 29){
    date = ((year%4==0&&year%100!=0)||year%400==0)?29:28;
  }
  return new Date(y+'/'+m+'/'+date);
}
