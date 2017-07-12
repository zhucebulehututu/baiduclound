///---------------------------------------------------------------------
//动态生成页面
function createFilesHtml(pageNum) {
  var str = '',
    strPath = '';
  var filePath = document.querySelector('.left-dis');
  var fileNum = document.querySelector('.file-num');
  var len = data.length;
  var dataPath = pageNum == 'root' ? [] : getAllParentById(datauser.files, pageNum);
  var lenPath = dataPath.length;
  for (var i = 0; i < len; i++) {
    str +=
      `<div class="file-box" data-select=false data-id=${data[i].id}>
            <div class="circle">√</div>
            <div class="file"></div>
            <p class="file-name">${data[i].name}</p>
            <div class="text-file">
              <input type="text" class="rename-text" value="新建文件夹">
              <a href="javascript:;" class="sure">√</a>
              <a href="javascript:;" class="cancel">×</a>
            </div>
          </div>`;
  };
  if (lenPath === 0) {
    strPath = '<span>全部文件</span>';
  } else {
    strPath += `<a href="javascript:;" class="prev">返回上一级</a> | <a href="javascript:;" class="back-origin">全部文件</a> > `;
    for (var i = 0; i < lenPath; i++) {

      if (i == lenPath - 1) {
        strPath += `<span data-id=${dataPath[i].id}>${dataPath[i].name}</span>`;
      } else {
        strPath += `<a class="returnPath" href="javascript:;" data-id=${dataPath[i].id}>${dataPath[i].name}</a> > `;
      }
    }
  }
  container.innerHTML = str;
  filePath.innerHTML = strPath;
  fileNum.innerHTML = len;
};
//是否显示菜单栏//-----------------------------------------------
function isDisplay(refer) {
  var offLinedownload = document.querySelector('.download');
  var myDevice = document.querySelector('.mydevice');
  var fileOperate = document.querySelector('.file-operate');
  if (refer) {
    offLinedownload.classList.add('active');
    myDevice.classList.add('active');
    fileOperate.classList.remove('active');
  } else {
    offLinedownload.classList.remove('active');
    myDevice.classList.remove('active');
    fileOperate.classList.add('active');
  }
};

//检测页面选中的文件夹//----------------------------------------------------
function checkSelectfiles() {
  var fileBox = document.querySelectorAll('.file-box');
  var renameFile = document.querySelector('.rename-file');
  var checkBox = document.querySelector('.select-all .checkbox');
  var selectWord = document.querySelector('.select-all .word');

  var select = [],
    n = 0,
    selectObj = [];
  Array.from(fileBox).forEach(function(item, i) {
    if (item.dataset.select === "true") {
      select.push(item.dataset.id);
      selectObj.push(item);
      n++;
    };
  });
  if (n === 0) {
    isDisplay(false);
  } else {
    isDisplay(true);
  }
  if (n === data.length && data.length) {
    checkBox.classList.add('active');
  } else {
    checkBox.classList.remove('active');
  }
  if (n > 1) {
    renameFile.classList.add('active');
    contxtMenu.children[6].classList.add('active');
    contxtMenu.children[0].classList.add('active');
  }
  if (n === 1) {
    renameFile.classList.remove('active');
    contxtMenu.children[6].classList.remove('active');
    contxtMenu.children[0].classList.remove('active');
  };
  selectWord.innerHTML = n === 0 ? '全部' : `已选中${n}个文件/文件夹`;
  return {
    select,
    selectObj,
    n
  };
};

//---------------------------------------------------------------------------------
//文件夹重命名函数
function reName() {
  if (data[0].name) {
    selected = checkSelectfiles().select;
    if (selected.length > 1) {
      popTips(false, '只能重命名一个文件！');
      return;
    }
    var selectObj = checkSelectfiles().selectObj[0];
    var thisFileData = getItemDataById(datauser.files, selected[0]);
  } else {
    var selectObj = container.children[0];
    var thisFileData = data[0];
  }
  var textFile = selectObj.querySelector('.text-file');
  var fileName = selectObj.querySelector('.file-name');
  var renameText = textFile.querySelector('.rename-text');
  para.renameMark = true;
  textFile.classList.add('active');
  fileName.classList.add('active');
  renameText.value = fileName.innerHTML === '' ? '新建文件夹' : fileName.innerHTML;
  renameText.select();
  textFile.addEventListener('click', function(e) {
    var target = e.target,
      targetCls = target.classList;
    if (targetCls.contains('sure')) {
      var onOff = true;
      if (renameText.value === '') {
        popTips(false, '文件名不能为空！');
        return;
      }
      Array.from(data).forEach(function(item, i) {
        if (item.name === renameText.value && item !== thisFileData) {
          popTips(false, '文件名已存在！');
          onOff = false;
          return;
        }
      });
      if (onOff) {
        if (thisFileData.name === undefined) {
          popTips(true, '文件新建成功！');
        } else {
          popTips(true, '文件重命名成功！');
        };
        fileName.innerHTML = renameText.value;
        thisFileData.name = renameText.value;
        textFile.classList.remove('active');
        fileName.classList.remove('active');
        turnPage(pageNum);
        para.renameMark = false;
      }
    };
    if (targetCls.contains('cancel')) {
      if (thisFileData.name) {
        popTips(false, '文件重命名失败！');
      } else {
        popTips(false, '文件新建失败！');
      };
      textFile.classList.remove('active');
      fileName.classList.remove('active');
      if (!data[0].name) {
        data.shift();
      }
      para.renameMark = false;
      turnPage(pageNum);
    }

  });
};

//复制或移动文件夹
function copyMoveTo(style) {
  if(para.renameMark) return;
  var shelter = document.querySelector('.shelter');
  var popBox = document.querySelector('.pop-box');
  var popSure = document.querySelector('.pop-sure');
  var popCancel = document.querySelector('.pop-cancel');
  var popClose = document.querySelector('.pop-close');
  var popCreateFile = document.querySelector('.pop-createfile');
  var selectedObj = checkSelectfiles().selectObj;
  selected = checkSelectfiles().select;
  //移动和复制分两种情况
  if (style === 'move') {
    popTree(datauser.files, selected);
  } else {
    popTree(datauser.files);
  };
  shelter.style.display = 'block';
  Fq.drag(popBox, popBox.firstElementChild);
  //----------------------------------------------------------
  //存储一份选中文件夹及其子数据，以防在树形结构中生成新文件夹后将新生成的文件夹也复制一份
  var save = [];
  for (var i = 0; i < selected.length; i++) {
    save.push(getItemDataById(datauser, selected[i]));
  }
  selected.children = JSON.stringify(save);

  //---------------------------------------------------------------------------

  // 树形结构中新建文件夹
  popCreateFile.onclick = function() {
    //如果之前没有选中某个文件夹
    if (!selected.targetFileId) {
      popTips(false, '请选择一个文件夹！');
      return;
    }
    var targetChildren = getItemDataById(datauser, selected.targetFileId).children;
    //新生成一个对象，存放新文件的数据
    var newFileData = {};
    var timeId = ++maxId;
    newFileData.id = timeId;
    newFileData.pId = selected.targetFileId;
    newFileData.children = [];
    targetChildren.push(newFileData);
    selected.targetFile.firstElementChild.classList.add('line');
    //生成新文件夹的DOM节点
    var ul = document.createElement('ul');
    ul.style.display = 'block';
    var li = document.createElement('li');
    var p = document.createElement('p');
    p.dataset.id = timeId;
    p.style.paddingLeft = parseFloat(selected.targetFile.style.paddingLeft) + 15 + 'px';

    p.onclick = function() {
      var allP = document.querySelectorAll('.tree p');
      Array.from(allP).forEach(function(item, i) {
        item.classList.remove('active');
      });
      this.classList.add('active');
      selected.targetFileId = this.dataset.id;
      selected.targetFile = this;
    }
    var i = document.createElement('i');
    i.className = 'close';
    var a = document.createElement('a');
    a.href = 'javascript:;';
    var clude = document.createElement('p');
    clude.className = 'clude';
    var input = document.createElement('input');
    input.type = 'text';
    input.value = '新建文件夹';
    var sure = document.createElement('em');
    sure.innerHTML = '√';
    var cancel = document.createElement('em');
    cancel.innerHTML = '×';
    var span = document.createElement('span');
    span.style.display = 'none';

    sure.onclick = function() {
      sure.onOff = true;
      Array.from(targetChildren).forEach(function(item, index) {
        if (item.name === input.value) {
          popTips(false, '文件夹下存在同名文件！');
          sure.onOff = false;
        }
      });
      if (input.value === '') {
        popTips(false, '名字不能为空！');
      } else {
        if (sure.onOff) {
          clude.style.display = 'none';
          span.style.display = 'block';
          span.innerHTML = input.value;
          targetChildren[targetChildren.length - 1].name = input.value;
        }
      }
    };

    cancel.onclick = function() {
      targetChildren.pop();
      selected.targetFile.parentNode.removeChild(ul);
      selected.targetFile.firstElementChild.classList.remove('line');
    };

    clude.appendChild(input);
    clude.appendChild(sure);
    clude.appendChild(cancel);
    p.appendChild(a);
    p.appendChild(i);
    p.appendChild(span);
    p.appendChild(clude);
    li.appendChild(p);
    ul.appendChild(li);
    selected.targetFile.parentNode.appendChild(ul);
    input.select();
  }
  popSure.onclick = function() {
    //如果没有选中某个文件夹
    if (!selected.targetFileId) {
      popTips(false, '请选择一个文件夹！');
      return;
    }
    var targetChildren = getItemDataById(datauser, selected.targetFileId).children;
    popSure.onOff = true;
    popSure.selectArr = [];
    for (var i = 0; i < selected.length; i++) {
      var checkObj = {};
      var currentId = ++maxId;
      checkObj.name = JSON.parse(selected.children)[i].name;
      if (style === 'move') {
        checkObj.id = JSON.parse(selected.children)[i].id;
      } else {
        checkObj.id = currentId;
      }
      checkObj.pId = selected.targetFileId;
      if (style === 'move') {
        checkObj.children = JSON.parse(selected.children)[i].children;
      } else {
        checkObj.children = copyData(JSON.parse(selected.children)[i], currentId);
      }
      popSure.selectArr.push(checkObj);
      Array.from(targetChildren).forEach(function(item, index) {
        if (item.name == JSON.parse(selected.children)[i].name) {
          popSure.onOff = false;
        }
      });
    };

    if (popSure.onOff) {
      targetChildren.unshift(...popSure.selectArr);
      if (style === 'move') {
        for (var i = 0; i < data.length; i++) {
          if (selected.indexOf(data[i].id + '') != -1) {
            data.splice(i, 1);
            i--;
          }
        };
      }
      for(var i=0;i<selectedObj.length;i++){
        console.log(selectedObj[0].parentNode,selectedObj[i]);
        container.removeChild(selectedObj[i]);
      }
      popTips(true, `文件夹${style === 'move' ?`移动`:`复制`}成功！`);
    } else {
      popTips(false, '目标文件夹已存在同名文件！');
    }
    shelter.style.display = '';
    selected.targetFileId = false;
  };

  popCancel.onclick = popClose.onclick = function() {
    shelter.style.display = '';
    popTips(false, `${style === 'move' ? `移动`:`复制`}文件失败！`);
    selected.targetFileId = false;
  }
};

//生成某个id的所有子文件的数据
function copyData(data,newId) {
  var arr=[];
      (function fn(data,idd) {
        var selectArr = [];
        //  debugger;
        if (data.children.length < 1) return;
        var ids = [];
        for (var i = 0; i < data.children.length; i++) {
          ids.push(data.children[i].id);
        }
        targetFileId = idd;
        for (var i = 0; i < data.children.length; i++) {
          var checkObj = {};
          checkObj.name = getItemDataById(data.children, ids[i]).name;
          checkObj.id = ++maxId;
          checkObj.pId = targetFileId;
          checkObj.children = [];
          selectArr.push(checkObj);
        };
        if(getId(arr,targetFileId)){
          if(selectArr.length===1){
            getId(arr,targetFileId).children.push(checkObj)
          }else{
            getId(arr,targetFileId).children.push(...selectArr);
          }
          // arr.push(...selectArr);
        }else{
          arr.push(...selectArr);
        }
        for(var i = 0; i < data.children.length; i++){
        fn(data.children[i],selectArr[i].id);
      };
    })(data,newId);

    return arr;
}
function getId(array,ib) {
var len = array.length;
if(len < 1) return;
for (var i = 0; i < len; i++) {
if (array[i].id == ib) {
  obj = array[i];
} else {
  getId(array[i].children,ib);
};
}
return obj;
};

//新建文件夹操作//-------------------------------------------------------------
function creatNewFiles() {
  if (data[0] && data[0].name === undefined) {
    popTips(false, '正在新建文件夹！');
    return;
  }
  turnPage(pageNum);
  var newFileData = {};
  var timeId = ++maxId;
  var str =
    `<div class="file-box" data-select=true data-id=${timeId}>
            <div class="circle">√</div>
            <div class="file"></div>
            <p class="file-name" style="display:none"></p>
            <div class="text-file" style="display:flex">
              <input type="text" class="rename-text" value="新建文件夹">
              <a href="javascript:;" class="sure">√</a>
              <a href="javascript:;" class="cancel">×</a>
            </div>
          </div>`;
  newFileData.id = timeId;
  newFileData.pId = pageNum == 'root' ? undefined : pageNum;
  newFileData.children = [];
  data.unshift(newFileData);

  container.innerHTML = str + container.innerHTML;
  reName();
}
