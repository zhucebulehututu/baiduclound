//弹出提示窗//-------------------------------------------------------------
function popTips(refer, description) {
  var tips = document.querySelector('.tips');
  tips.style.top = '20px';
  tips.classList.remove(refer ? 'error' : 'correct');
  tips.classList.add(refer ? 'correct' : 'error');
  tips.innerHTML = description;
  setTimeout(function() {
    tips.style.top = '';
  }, 1000);
}

function tipboxDisplay(type) {
  var tipWindow = document.querySelector('.tip-window');
  var tipShadow = document.querySelector('.tip-shadow');
  var tipBox = document.querySelector('.tip-box');
  var tipInfo = document.querySelector('.tip-info');
  var tipText = document.querySelector('.tip-text');
  var tipSure = document.querySelector('.tip-sure');
  var tipCancel = document.querySelector('.tip-cancel');
  tipWindow.style.display = 'block';
  Fq.animation(tipShadow, {
    opacity: 0.6
  }, 400);
  Fq.animation(tipBox, {
    top: 210
  }, 400, 'backBoth');
  //复制或移动重名时选择操作（未完成）
  if (type === 'copy') {
    tipInfo.innerHTML = '复制文件';
    tipText.innerHTML = '目标文件夹存在同名文件，请选择你的操作：';
    tipSure.innerHTML = '保留两个文件';
    tipCancel.innerHTML = '跳过';
  } else {
    tipInfo.innerHTML = '确认删除';
    tipText.innerHTML = '删除后将无法恢复';
    tipSure.innerHTML = '确定';
    tipCancel.innerHTML = '取消';
  }
  selected = checkSelectfiles().select;
}

//全选的点击//------------------------------------------------------------
(function () {
var checkBox = document.querySelector('.select-all .checkbox');
  checkBox.addEventListener('click', function() {
    console.log(222222);
    var fileBox = document.querySelectorAll('.file-box');
    if (!checkBox.classList.toggle('active')) {
      Array.from(fileBox).forEach(function(item, i) {
        item.dataset.select = "false";
        item.classList.remove('active');
        item.children[0].classList.remove('active');
      })
    } else {
      Array.from(fileBox).forEach(function(item, i) {
        item.dataset.select = "true";
        item.classList.add('active');
        item.children[0].classList.add('active');
      })
    }
    checkSelectfiles();
  })
})();

//点击导航路径进入对应的文件夹//--------------------------------------------
(function () {
  var filePath = document.querySelector('.left-dis');
  filePath.addEventListener('click', function(e) {
    var target = e.target,
      targetCls = target.classList;
    if (targetCls.contains('returnPath')) {
      pageNum = target.dataset.id;
      turnPage(pageNum);
    }
    if (targetCls.contains('prev')) {
      pageNum = para.search || getItemDataById(datauser, pageNum).pId === undefined? 'root' : getItemDataById(datauser, pageNum).pId;
      turnPage(pageNum);
    }
    if (targetCls.contains('back-origin')) {
      pageNum = 'root';
      turnPage(pageNum);
    }
    para.search = false;
  });
})();

//选中文件夹之后头部菜单对文件的操作//-----------------------------------------------------
(function() {
  var topLeft = document.querySelector('.topleft');
  topLeft.addEventListener('click', function(e) {
    var target = e.target,
      targetCls = target.classList;
    if (targetCls.contains('delete-file')) {
      if(para.renameMark) return;
      tipboxDisplay('delete');
    }
    if (targetCls.contains('rename-file')) {
      reName();
    };
    if (targetCls.contains('copy-file')) {
      copyMoveTo();
    }
    if (targetCls.contains('move-file')) {
      copyMoveTo('move');
    }
    if(targetCls.contains('newfile')){
      creatNewFiles();
    }
  });
})();

//弹出的提示框操作
(function tipbox() {
  var tipWindow = document.querySelector('.tip-window');
  var tipShadow = document.querySelector('.tip-shadow');
  var tipBox = document.querySelector('.tip-box');
  var tipSure = tipBox.querySelector('.tip-sure');
  var tipCancel = tipBox.querySelector('.tip-cancel');
  var tipClose = tipBox.querySelector('.tip-close');
  tipBox.addEventListener('click', function(e) {
    var target = e.target,
      targetCls = target.classList;
    if (targetCls.contains('tip-sure')) {
      if (para.smname === undefined) {
        deleteSearchFile(datauser.files,selected);
      //   for (var i = 0; i < data.length; i++) {
      //     if (selected.indexOf(data[i].id + '') != -1) {
      //       data.splice(i, 1);
      //       i--;
      //     }
      //   }
        setTimeout(function() {
          popTips(true, '文件夹删除成功！');
          tipBox.style.top = '1000px';
          tipWindow.style.display = '';
        }, 500);
      } else {

      }
    }
    if (targetCls.contains('tip-cancel') || targetCls.contains('tip-close')) {
      setTimeout(function() {
        popTips(false, '文件夹删除失败！');
        tipBox.style.top = '1000px';
        tipWindow.style.display = '';
      }, 500);
    }
    Fq.animation(tipShadow, {
      opacity: 0
    }, 400);
    Fq.animation(tipBox, {
      top: -400
    }, 400, 'backBoth');
    if(para.search) {
      searchBtn.onclick();
      checkSelectfiles();
      return;
    }
    turnPage(pageNum);
  })
})();


//树形结构弹窗//------------------------------------------
function popTree(data, id) {
  var n = 0,
    count = [];
  var listTreeWrapper = document.querySelector('.tree');
  listTreeWrapper.innerHTML = createListHtml(data);

  function createListHtml(data) {
    var str = '',
      len = data.length,
      i;
    for (i = 0; i < len; i++) {
      if (id && id.indexOf(data[i].id + '') != -1) continue;
      str += `<li><p data-id=${data[i].id} style="padding-left:${n*15}px"><a class="${data[i].children.length > 0 ? 'add' : ''}"; href="javascript:;"></a><i class="close"></i><span>${data[i].name}</span></p>`;

      if (data[i].children.length > 0) {
        count.push(n);
        str += `<ul data-count =${n++}>${createListHtml(data[i].children)}</ul>`;
        n = count.pop();
      }

      str += `</li>`;
    }
    return str;
  }

  (function tabListTree(parent) {
    // 获取到当前ul下面的所有的li
    var childLi = parent.children;
    //  var allP = document.querySelectorAll('.tree p');
    // var firstCaption = childLi[0].firstElementChild;
    // 为了防止重复添加事件
    // if (firstCaption.onclick) return;
    //  console.log(childLi);
    for (var i = 0; i < childLi.length; i++) {
      // 获取到每个li里面的span标题
      // var caption = childLi[i].firstElementChild;
      childLi[i].children[0].onclick = function() {
        var allP = document.querySelectorAll('.tree p');
        Array.from(allP).forEach(function(item, i) {
          item.classList.remove('active');
        });
        this.classList.add('active');
        // 保存一下下一个兄弟节点，没有就是一个null
        var next = this.nextElementSibling;
        selected.targetFileId = this.dataset.id;
        selected.targetFile = this;
        // 获取到当前点击的这个span的父级的父级
        var parentParent = this.parentNode.parentNode;
        // 获取到当前点击这个父级父级下面的所有的ul
        var childrenUl = parentParent.querySelectorAll('ul');
        if (next) { // 如果next存在
          // 根据切换className中的 line  来判断是否显示和隐藏
          this.children[1].classList.toggle('open');
          next.style.display = this.children[0].classList.toggle('line') ? 'block' : '';
          // 为每个展开的ul添加同样的事件
          tabListTree(next);
        }
      };
    }
  })(listTreeWrapper);
}

//鼠标画框与碰撞检测//-----------------------------------------------------
document.onmousedown = function(e) {
  if(e.target.parentNode.classList.contains('context-list')||e.target.parentNode.classList.contains('context-menu')) return;
  contextList.style.display = 'none';
  contxtMenu.style.display = 'none';
  if (e.target.classList.contains('body')) {
    if (para.renameMark) return;
    e.preventDefault();
    if (!e.target.parentNode.classList.contains('context-menu') && !e.target.parentNode.classList.contains('context-list')) {
      contextList.style.display = 'none';
      contxtMenu.style.display = 'none';
    }
    var x = e.pageX,
      y = e.pageY;
    var div = document.createElement('div');
    document.body.appendChild(div);

    window.onmousemove = function(e) {
      var x1 = e.pageX,
        y1 = e.pageY;
      if (x1 <= Fq.getRect(container, 'left')) x1 = Fq.getRect(container, 'left');
      if (y1 <= Fq.getRect(container, 'top')) y1 = Fq.getRect(container, 'top');
      var dx = x1 - x,
        dy = y1 - y;
      div.style.position = 'absolute';
      div.style.left = Math.min(x1, x) + 'px';
      div.style.top = Math.min(y1, y) + 'px';
      div.style.width = Math.abs(dx) + 'px';
      div.style.height = Math.abs(dy) + 'px';
      div.style.border = '0.5px dotted rgba(167, 204, 231,.3)';
      div.style.backgroundColor = 'rgba(167, 204, 231,.3)';

      //碰撞检测-----------------------------------------------
      for (var i = 0; i < container.children.length; i++) {
        if (Fq.duang(div, container.children[i])) {
          container.children[i].children[0].classList.add('active');
          container.children[i].classList.add('active');
          container.children[i].dataset.select = "true";
        } else {
          container.children[i].children[0].classList.remove('active');
          container.children[i].classList.remove('active');
          container.children[i].dataset.select = "false";
        }
      }
      checkSelectfiles();
    };

    window.onmouseup = function() {
      document.body.removeChild(div);
      this.onmousemove = this.onmouseup = null;
    };
  };
};
