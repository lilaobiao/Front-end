1. 格式化对象，用于将以 "." 连接的属性进行拆分
```
function parseFormDataM(obj) {
  function extendObj(src, target) {
    for (var key in target) {
      src[key] = target[key]
    }
  }
  for (var key in obj) {
    if (key.indexOf('.') > 0) {
      var len = key.split('.').length;
      if (len <= 2) {
        var keys = key.split('.');
        key0 = keys[0], key1 = keys[1];
        if (!obj[key0]) {
          obj[key0] = {};
        };
        if (obj[key0][key1]) {
          extendObj(obj[key0][key1], obj[key])
        } else {
          obj[key0][key1] = obj[key];
        }
        delete obj[key];
      } else {
        var index = key.indexOf('.');
        var key0 = key.slice(0, index), key1 = key.slice(index + 1);
        if (!obj[key0]) {
          obj[key0] = {}
        }
        if (obj[key0][key1]) {
          extendObj(obj[key0][key1], obj[key])
        } else {
          obj[key0][key1] = obj[key];
        }
        delete obj[key];
        if (key1.indexOf('.') > 0) {
          parseFormDataM(obj[key0]);
        }
      }
    }
  }
  return obj;
}
```
使用举例
```
var data2 = {
    'aa.bb.cc':111,
    'aa.bb':{
        dd:222,
        ee:{
            ff:333,
            gg:444
        }
    },
    'aa.bb.ff':555
}
console.log(parseFormDataM(data2))
// {
//     aa:{
//         bb:{
//             cc:111,
//             dd:222,
//             ee:{
//                 ff:333,
//                 gg:444
//             },
//             ff:555
//         }
//     }
// }
```

2. 深拷贝对象
```
function find (list, f) {
  return list.filter(f)[0]
}

function deepCopy(obj, cache) {
  if ( cache === void 0 ) cache = [];

  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  var hit = find(cache, function (c) { return c.original === obj; });
  if (hit) {
    return hit.copy
  }

  var copy = Array.isArray(obj) ? [] : {};
  cache.push({
    original: obj,
    copy: copy
  });

  Object.keys(obj).forEach(function (key) {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy
}
```
