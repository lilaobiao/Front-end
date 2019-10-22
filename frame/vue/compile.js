function Compile(el, vm) {
  // 保存vm到compile对象
  this.$vm = vm;
  // 保存el元素到compile对象
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);
  // 如果el元素存在
  if (this.$el) {
    // 1. 取出el中所有子节点, 封装在一个framgment对象中
    this.$fragment = this.node2Fragment(this.$el);
    // 2. 编译fragment中所有层次子节点
    this.init();
    // 3. 将fragment添加到el中
    this.$el.appendChild(this.$fragment);
  }
}

Compile.prototype = {
  node2Fragment: function (el) {
  //创建空的fragment
    var fragment = document.createDocumentFragment(),
      child;

    // 将原生节点拷贝到fragment（将el中所有子节点转移到fragment）
    while (child = el.firstChild) {
      fragment.appendChild(child);
    }
	//返回fragment
    return fragment;
  },

  init: function () {
    // 编译fragment（编译所有层次的子节点）
    this.compileElement(this.$fragment);
  },

  compileElement: function (el) {
    // 得到所有子节点
    var childNodes = el.childNodes,
      // 保存compile对象
      me = this;
    // 遍历所有子节点（text/element）
    [].slice.call(childNodes).forEach(function (node) {
      // 得到节点的文本内容
      var text = node.textContent;
      // 正则对象(匹配大括号表达式)
      var reg = /\{\{(.*)\}\}/;  // {{name}}
      // 如果是元素节点
      if (me.isElementNode(node)) {
        // 编译元素节点的指令属性
        me.compile(node);
        // 如果是一个大括号表达式格式的文本节点
      } else if (me.isTextNode(node) && reg.test(text)) {
        // 编译大括号表达式格式的文本节点
        me.compileText(node, RegExp.$1); // RegExp.$1: 表达式   name
      }
      // 如果子节点还有子节点
      if (node.childNodes && node.childNodes.length) {
        // 递归调用实现所有层次节点的编译
        me.compileElement(node);
      }
    });
  },

  compile: function (node) {
    // 得到所有标签属性节点
    var nodeAttrs = node.attributes,
      me = this;
    // 遍历所有属性
    [].slice.call(nodeAttrs).forEach(function (attr) {
      // 得到属性名: v-on:click
      var attrName = attr.name;
      // 判断是否是指令属性
      if (me.isDirective(attrName)) {
        // 得到表达式(属性值): test
        var exp = attr.value;
        // 得到指令名: on:click
        var dir = attrName.substring(2);
        // 事件指令
        if (me.isEventDirective(dir)) {
          // 解析事件指令
          compileUtil.eventHandler(node, me.$vm, exp, dir);
        // 普通指令
        } else {
          // 解析普通指令
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
        }

        // 移除指令属性
        node.removeAttribute(attrName);
      }
    });
  },

  compileText: function (node, exp) {
    // 调用编译工具对象解析
    compileUtil.text(node, this.$vm, exp);
  },

  isDirective: function (attr) {
    return attr.indexOf('v-') == 0;
  },

  isEventDirective: function (dir) {
    return dir.indexOf('on') === 0;
  },

  isElementNode: function (node) {
    return node.nodeType == 1;
  },

  isTextNode: function (node) {
    return node.nodeType == 3;
  }
};

// 指令处理集合（包含多个解析指令的方法的工具对象）
var compileUtil = {
  // 解析: v-text/{{}}
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },
  // 解析: v-html
  html: function (node, vm, exp) {
    this.bind(node, vm, exp, 'html');
  },

  // 解析: v-model
  model: function (node, vm, exp) {
  		//实现数据的初始化显示和创建对应的watcher
    this.bind(node, vm, exp, 'model');

    var me = this,
    //得到表达式的值
      val = this._getVMVal(vm, exp);
      //给节点绑定input事件监听（输入改变时）
    node.addEventListener('input', function (e) {
    //得到输入的最新值
      var newValue = e.target.value;
      //如果没有变化，直接结束
      if (val === newValue) {
        return;
      }
	//将最新value保存给表达式所对应的属性
      me._setVMVal(vm, exp, newValue);
      val = newValue;
    });
  },

  // 解析: v-class
  class: function (node, vm, exp) {
    this.bind(node, vm, exp, 'class');
  },

  // 真正用于解析指令的方法
  bind: function (node, vm, exp, dir) {
    /*实现初始化显示*/
    // 根据指令名(text)得到对应的更新节点函数
    var updaterFn = updater[dir + 'Updater'];
    // 如果存在调用来更新节点
    updaterFn && updaterFn(node, this._getVMVal(vm, exp));

    // 创建表达式对应的watcher对象
    new Watcher(vm, exp, function (value, oldValue) {/*更新界面*/
      // 当对应的属性值发生了变化时, 自动调用, 更新对应的节点
      updaterFn && updaterFn(node, value, oldValue);
    });
  },

  // 事件处理
  eventHandler: function (node, vm, exp, dir) {
    // 得到事件名/类型: click
    var eventType = dir.split(':')[1],
      // 根据表达式得到事件处理函数(从methods中): test(){}
      fn = vm.$options.methods && vm.$options.methods[exp];
    // 如果都存在
    if (eventType && fn) {
      // 绑定指定事件名和回调函数的DOM事件监听, 将回调函数中的this强制绑定为vm
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },

  // 从vm得到表达式对应的value
  _getVMVal: function (vm, exp) {
    var val = vm._data;
    exp = exp.split('.');
    exp.forEach(function (k) {
      val = val[k];
    });
    return val;
  },

  _setVMVal: function (vm, exp, value) {
    var val = vm._data;
    exp = exp.split('.');
    exp.forEach(function (k, i) {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    });
  }
};

// 包含多个用于更新节点方法的工具对象
var updater = {
  // 更新节点的textContent
  textUpdater: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },

  // 更新节点的innerHTML
  htmlUpdater: function (node, value) {
    node.innerHTML = typeof value == 'undefined' ? '' : value;
  },

  // 更新节点的className
  classUpdater: function (node, value, oldValue) {
  //静态class属性的值
    var className = node.className;
    className = className.replace(oldValue, '').replace(/\s$/, '');

    var space = className && String(value) ? ' ' : '';
	//将静态class属性的值与动态class值进行合并后设置为新的className属性值
    node.className = className + space + value;
  },

  // 更新节点的value
  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value == 'undefined' ? '' : value;
  }
};
