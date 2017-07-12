// 1 写一个方法，方法接收两个参数，一个是所有文件的数据(例如下面的 user_data.files),另外一个参数是某个文件的id，之后这个方法的名字可以随意起例如：getItemDataById，这个方法的作用是：根据指定的id，拿到数据中对应id的那个文件的数据。

// var data = user_data.files;
// getItemDataById(data, 1)  === > 框架的数据

// 2 写一个方法，getAllParentById(data, id),这个方法的作用是根据指定的id找到这个数据它自己以及它所有的祖先数据

var user_data = {
  "maxId": 10,
  "files": [
    {
      "name": "JS",
      "id": 0,
      "type": "root",
      "children": [
        {
          "name": "框架",
          "id": 1,
          "pId": 0,
          "children": [
            {
              "name": "React",
              "id": 3,
              "pId": 1,
              "children": []
            },
            {
              "name": "Vue",
              "id": 4,
              "pId": 1,
              "children": [
                {
                  "name": "vue-cli",
                  "id": 5,
                  "pId": 4,
                  "children": []
                }
              ]
            },
            {
              "name": "Node",
              "id": 6,
              "pId": 1,
              "children": [
                {
                  "name": "npm",
                  "id": 7,
                  "pId": 6,
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "name": "Html5",
          "id": 2,
          "pId": 0,
          "children": []
        }
      ]
    }
  ]
};
//获取指定id及它所有祖先数据
function getAllParentById(data, id){
  var parentParent = [];
  var p1=getItemDataById(data,id);
(function getAllParent(p){
 parentParent.unshift(p);
 if(p.pId === undefined) return;
 getAllParent(getItemDataById(data,p.pId));
})(p1);
return parentParent;
}
//获取指定id的数据
function getItemDataById(datas,num){
   var obj=null;
 datas = datas.files?datas.files:datas;
 (function fn(Children){
   var len = Children.length;
    for(var i= 0;i<len;i++){
      if(Children[i].id == num){
        obj = Children[i];
      }else{
      fn(Children[i].children);
      };
      if(obj) return;
    };
 })(datas);
 return obj;
};


// var container = document.querySelector('.body');
// var createFile = document.querySelector('.newfile');
// var offLinedownload = document.querySelector('.download');
// var myDevice = document.querySelector('.mydevice');
// var fileOperate = document.querySelector('.file-operate');
//
// createFile.onclick = function () {
//   var fileBox = document.createElement('div');
//       fileBox.className = 'file-box';
//   var circle = document.createElement('div');
//       circle.className = 'circle';
//       circle.innerHTML = '√';
//       fileBox.appendChild(circle);
//   var file = document.createElement('div');
//        file.className = 'file';
//        fileBox.appendChild(file);
//   var fileName = document.createElement('p');
//       fileName.className = 'file-name';
//       fileBox.appendChild(fileName);
//   var textFile = document.createElement('div');
//       textFile.className = 'text-file';
//       fileBox.appendChild(textFile);
//   var renameText = document.createElement('input');
//       renameText.type = 'text';
//       renameText.className = 'rename-text';
//       renameText.value = '新建文件夹';
//       textFile.appendChild(renameText);
//   var sure = document.createElement('a');
//       sure.href = 'javascript:;';
//       sure.innerHTML = '√';
//       textFile.appendChild(sure);
//   var cancel = document.createElement('a');
//       cancel.href = 'javascript:;';
//       cancel.innerHTML = '×';
//       textFile.appendChild(cancel);
//   container.appendChild(fileBox);
//   fileName.style.display = 'none';
//   textFile.style.display = 'flex';
//   renameText.select();
//       sure.onclick = function(){
//         fileName.style.display = 'block'
//         textFile.style.display = 'none';
//         fileName.innerHTML = renameText.value;
//       }
//       cancel.onclick = function () {
//         fileName.style.display = 'block'
//         textFile.style.display = 'none';
//         fileName.innerHTML = fileName.innerHTML || '新建文件夹';
//       }
//       circle.onclick = function(){
//         circle.classList.toggle('active');
//         fileBox.classList.toggle('active');
//         offLinedownload.classList.toggle('active');
//         myDevice.classList.toggle('active');
//         fileOperate.classList.toggle('active');
//       }
// }
