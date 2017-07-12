var search = document.querySelector('.search');
var text = document.querySelector('.text');
var searchBtn = document.querySelector('.searchbtn');
var filePath = document.querySelector('.left-dis');
var fileNum = document.querySelector('.file-num');
var value;
var str = '',strPath='',arr;
searchBtn.onclick = function () {
  arr = [];
  value = text.value.toLowerCase();
  if(value === ''){
    popTips(false,'关键字不能为空！');
    return;
  };
 container.innerHTML = createHtml(datauser.files);
 filePath.innerHTML = `<a href="javascript:;" class="prev">返回上一级</a> | <a href="javascript:;" class="back-origin">全部文件</a> > <span>搜索 : ${text.value}</span>`;
 str = '';
data = arr;
para.search = true;
}
//生成索引的所有文件的结构

function deleteSearchFile(data,arrId) {
  // debugger;
  var i;
  for (i = 0; i < data.length; i++) {

     if(arrId.indexOf(data[i].id+'')!= -1){
       data.splice(i,1);
       i--;
     }else{
       if (data[i].children.length > 0) {
        deleteSearchFile(data[i].children,arrId);
       }
     }
  }
};


function createHtml(data) {
  var len = data.length,i;
  for (i = 0; i < len; i++) {
    var targetName = data[i].name.toLowerCase();
     if(targetName.indexOf(value)!= -1){
       arr.push(getItemDataById(datauser.files,data[i].id));
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
     }
     if (data[i].children.length > 0) {
      createHtml(data[i].children);
     }
  }
  return str;
}
