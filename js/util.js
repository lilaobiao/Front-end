export default {
  trim:function(str){
    return (str+'').replace(/(^\s*)|(\s*$)/g, "");
　},
  /*去除字符串左边空格*/
　ltrim:function(str){
    return str.replace(/(^\s*)/g,"");
  },
  /*去除字符串右边空格*/
  rtrim:function(str){
    return str.replace(/(\s*$)/g,"");
　},
  isPhone:function(str){
    return /^1[345789]\d{9}$/.test(str);
  },
  isTelPhone:function(str){
    return /^(0\d{3}\-?\d{7})|(0\d{2}\-?\d{8})|(1[345789]\d{9})$/.test(str);
  },
  isCnIdCard:function(str){
    return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(str);
  },
  isCnName:function(str){
    //return /^([\u4e00-\u9fa5]+(·{0,1})){0,4}[\u4e00-\u9fa5]$/.test(str);
    return /^[\u4E00-\u9FA5\u9FA6-\u9FBB]{2,6}$/.test(str);
  },
  isEmail:function(str){
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
  },
  isIp:function(str){
    return /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/.test(str)
  },
  isPostCode:function(str){
    return /^[1-9][0-9]{5}$/.test(str);
  },
  isAccount:function(str){
    return /^[a-zA-Z][a-zA-Z0-9_\-]{2,}$/.test(str);
  },
  isPassword:function(str){
    return /^[a-zA-Z0-9_,;'"~#@&%\!\^\$\.\*\+\?\-\=\|\\\/\:\<\>]{6,30}$/.test(str)
  },
  /**用于判断字符串是否包含大写字母，小写字母以及数字中的至少两种 */
  isIncludeTwoType:function(str){
    return /^[a-zA-Z0-9]*(([A-Z][a-z])|([A-Z][0-9])|([a-z][0-9])|([a-z][A-Z])|([0-9][A-Z])|([0-9][a-z]))+[a-zA-Z0-9]*$/.test(str)
  },
  /*判断值是否为空*/
  isEmpty:function(val){
    if ((val === null || typeof val === "undefined") || (typeof val === "string" && val.trim() === "") || val === undefined ){
      return true;
    }else{
      return false;
    }
  },
  /*判断一个object对象是否为空*/
  isEmptyObj:function(obj){
    for(var key in obj){
      return false;
    };
    return true;
  },
  computedFileSize:function (number) {
    if(number < 1024) {
      return number + 'bytes';
    } else if(number >= 1024 && number < 1048576) {
      return (number/1024).toFixed(1) + 'KB';
    } else if(number >= 1048576) {
      return (number/1048576).toFixed(1) + 'MB';
    }
  },
  bytesToSize:function (bytes){
    if (bytes === 0) return '0 B';
    let k = 1024, // or 1000
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  },
  typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
      '[object Boolean]'  : 'boolean',
      '[object Number]'   : 'number',
      '[object String]'   : 'string',
      '[object Function]' : 'function',
      '[object Array]'    : 'array',
      '[object Date]'     : 'date',
      '[object RegExp]'   : 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]'     : 'null',
      '[object Object]'   : 'object'
    };
    return map[toString.call(obj)];
  }
}
