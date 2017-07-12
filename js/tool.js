/**
 * 用来获取选择的元素
 */

var Fq = {};

// 元素选择器
Fq.$ = function (selector, context){
  var context = context || document;
  var first = selector.substr(0, 1);
  var len = selector.split(/\s+/).length; // join
  var eles;
  // 如果是id选择器
  if(first === '#' && len === 1){
    console.log(selector.substr(1));
    return document.getElementById(selector.substr(1));
  }
  // 如果是CSS选择器
  eles = context.querySelectorAll(selector);
  return eles.length === 1 ? eles[0] : Array.from(eles);
}

/**
 * 获取或者设置一个DOM元素的innerHTML
 */
Fq.html = function html(ele, val){
  if(typeof val === 'undefined'){
    return ele.innerHTML;
  }
  ele.innerHTML = val;
}

/**
 * 获取或者设置一个元素的value
 */
Fq.val = function val(ele, value){
  if(typeof value === 'undefined'){
    return ele.value;
  }
  ele.value = value;
}

// 判断某个元素是否有某个class
Fq.hasClass = function (ele, cls){
  return ele.classList.contains(cls);
};

// 给某个元素添加一个class
Fq.addClass = function (ele, cls){
  ele.classList.add(cls);
};

// 给某个元素删除某个class
Fq.rmClass = function (ele, cls){
  ele.classList.remove(cls);
};

// 给某个元素toggle某个class
Fq.toggle = function (ele, cls){
  ele.classList.toggle(cls);
};

/**
 * 用来获取和设置元素的css样式
 */
Fq.css = function css(){
  var args = arguments, ele = args[0], type = args[1], value = args[2], len = args.length, ret, _this = this;

  if(len === 2){
    if(type === ''){
      ele.style.cssText = '';
      return true;
    }

    if(typeof type === 'string'){
      if(getTransform(type)){
        return this.cssTransform(ele, type);
      }

      ret = getComputedStyle(ele)[type];
      if(getStyle(type)){
        return parseFloat(ret);
      };
      return ret * 1 ? ret * 1 : ret;
    }

    if(typeof type === 'object'){
      for(var key in type){
        setStyle(key, type[key]);
      }
      return true;
    }
  }

  if(len === 3){
    setStyle(type, value);
  }

  function setStyle(attr, value){
    if(getStyle(attr)){
      ele.style[attr] = value.toString().trim() === '' ? '' : value.toString().indexOf('%') === -1 ? parseFloat(value) + 'px' : value;
    }else if(getTransform(attr)){
      _this.cssTransform(ele, attr, value);
    }else{
      ele.style[attr] = value;
    }
  }

  function getStyle(type){
    return type === 'width' ||  type === 'height'|| type === 'left' || type === 'top' || type === 'right' || type === 'bottom';
  }
  function getTransform(type){
    return type === 'translateX' ||  type === 'translateY'|| type === 'rotate' || type === 'rotateX' || type === 'rotateY' || type === 'scale' || type === 'scaleX' || type === 'scaleY' || type === 'skewX' || type === 'skewY' || type === 'translate' || type === 'skew';
  }
}

// 必须通过这个函数设置的才能通过这个函数获取
Fq.cssTransform = function cssTransform(ele, type, value){
  var attrs = ele.__transform = ele.__transform || {}, str = '';
  if(typeof value === 'undefined'){
    return attrs[type];
  }
  attrs[type] = value;
  for(var key in attrs){
    switch(key){
      case 'translateX':
      case 'translateY':
        str += ` ${key}(${parseFloat(attrs[key])}px)`;
      break;
      case 'rotate':
      case 'rotateX':
      case 'rotateY':
      case 'skewX':
      case 'skewY':
        str += ` ${key}(${parseFloat(attrs[key])}deg)`;
      break;
      default:
        str += ` ${key}(${attrs[key]})`;
    }
  }
  ele.style.transform = str.trim();
}

// 动画函数
Fq.animation = function animation(ele, attrs, duration, fx, fn){
  if(ele.animation) return;

  if(typeof duration === 'undefined'){
    duration = 500;
    fx = 'linear';
  }

  if(typeof duration === 'number'){
    if(typeof fx === 'function'){
      fn = fx;
      fx = 'linear';
    }
    if(typeof fx === 'undefined'){
      fx = 'linear';
    }
  }

  if(typeof duration === 'function'){
    fn = duration;
    fx = 'linear';
    duration = 500;
  }

  if(typeof duration === 'string'){
    if(typeof fx === 'undefined'){
      fx = duration;
      duration = 500;
    }else{
      fn = fx;
      fx = duration;
      duration = 500;
    }
  }

  var beginValue = {}, changeValue = {};

  for(var key in attrs){
    beginValue[key] = this.css(ele, key) || 0;

    // 待修改
    if(typeof attrs[key] === 'string' && attrs[key].indexOf('%') !== -1){
      var targetParent = this.css(ele.parentNode, key) * parseFloat(attrs[key]) / 100;
      changeValue[key] = targetParent - beginValue[key];
      continue;
    }

    changeValue[key] = attrs[key] - beginValue[key];
  }

  var d = duration;
  var startTime = Date.now();
  var current, c, b, t, _this = this;

  (function animation(){
    ele.animation = window.requestAnimationFrame(animation, ele);

    t = Date.now() - startTime;

    if(t >= d){
      t = d;
      window.cancelAnimationFrame(ele.animation);
      ele.animation = null;
    }

    for(key in changeValue){
      c = changeValue[key];
      b = beginValue[key];
      current = Tween[fx](t, b, c, d);
      _this.css(ele, key, current);
    }

    if(!ele.animation && typeof fn === 'function'){
      fn.call(ele);
    }
  })();
};
//抖函数
Fq.shake = function shake(ele, attr, nums, fn){
  if(ele.shake) return;

  var arr = [], index = 0, _this = this;

  for(var i=nums < 30 ? 30 : nums; i>=0; i--){
    if(i == 0){
      arr.push(i);
      break;
    }
    arr.push(-i, i);
  }

  (function shake(){
    ele.shake = window.requestAnimationFrame(shake, ele);
    _this.css(ele, attr, arr[index++]);
    if(index === arr.length) {
      window.cancelAnimationFrame(ele.shake);
      ele.shake = null;
      if(typeof fn === 'function'){
        fn.call(ele);
      }
    }
  })();
}
//拖拽函数
Fq.drag = function drag(objMove,target) {
        var positionParent = objMove.offsetParent;
        var target = target ? target : objMove;
        var parentHeight = positionParent.clientHeight ? positionParent.clientHeight : window.innerHeight;
        var disX,disY;
        function getRect(ele,type) {
            return ele.getBoundingClientRect()[type];
        };

        target.addEventListener('mousedown',function (e) {
            e.preventDefault();
            disX = e.pageX - getRect(objMove,'left');
            disY = e.pageY - getRect(objMove,'top');
            document.addEventListener('mousemove',boxmove);
            document.addEventListener('mouseup',boxup);
        });

        function boxmove(e) {
            var x = e.pageX,y = e.pageY;
            var L = x - disX - getRect(positionParent,'left'),
                T = y - disY - getRect(positionParent,'top');


            if (L <= 0) {
                L = 0;
            };
            if (T <= 0) {
                T = 0;
            };
            if (L >= positionParent.clientWidth - objMove.offsetWidth) {
                L = positionParent.clientWidth - objMove.offsetWidth;
            };
            if(T >= parentHeight - objMove.offsetHeight){
                T = parentHeight - objMove.offsetHeight;
            };

            objMove.style.left = L + 'px';
            objMove.style.top = T + 'px';
        };
        function boxup() {
            document.removeEventListener('mousemove',boxmove);
            document.removeEventListener('mouseup',boxup);
        };
        };
//获取绝对位置
Fq.getRect = function getRect(ele,type) {
    return ele.getBoundingClientRect()[type];
};

//检测是否与目标碰撞
Fq.duang = function duang(current, target){
  var currentRect = current.getBoundingClientRect(),
      targetRect = target.getBoundingClientRect();

  // 拿到当前画的框四个边距离文档左侧和上侧的绝对距离
  var currentL = currentRect.left,
      currentT = currentRect.top,
      currentR = currentRect.right,
      currentB = currentRect.bottom;

  var targetL = targetRect.left,
      targetT = targetRect.top,
      targetR = targetRect.right,
      targetB = targetRect.bottom;

  return currentR >= targetL && currentB >= targetT && currentL <= targetR && currentT <= targetB;
}



var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //*正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c;
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) *
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) *
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158;
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},
	bounceOut: function(t, b, c, d){//*
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}
