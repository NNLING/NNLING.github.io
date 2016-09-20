(function (){
	
	// 让内容区高度自适应
	var header = tools.$('.header')[0];
	var weiyunContent = tools.$('.weiyun-content')[0];
	var headH = header.offsetHeight;
	onResize();
	function onResize(){
		var iH = document.documentElement.clientHeight;
		weiyunContent.style.height = iH - headH + 'px';
	}
	window.onresize = onResize;
	//要准备的数据
	var datas = data.files;
	
	//渲染文件区域
	var renderId = 0;
	
	//文件区域的容器
	var fileList = tools.$('.file-list')[0];
	
	var getPidInput = tools.$("#getPidInput");
	
	//渲染指定id下所有的子数据构成的html结构
	fileList.innerHTML = createFileHtml(datas,0);
	
	//利用事件委托，点击每一个文件夹
	tools.addEvent(fileList,"click",function (ev){
		var target = ev.target;
		if (tools.parents(target,".item")){
			target = tools.parents(target,".item");
			
			//找到文件的id
			var fileId = target.getAttribute('data-id');
			
			renderNavFilesTree(fileId);
		};
	});
	
	//渲染菜单区域
	var treeMenu = tools.$('.tree-menu')[0];
	
	//文件导航的容器
	var pathNav = tools.$('.path-nav')[0]; 
	
	//文件导航区域点击
	tools.addEvent(pathNav,"click",function (ev){
		var target = ev.target;
		if (tools.parents(target,"a")){
			var fileId = target.getAttribute('data-id');
			renderNavFilesTree(fileId)
		};
	})
	
	//没有文件提醒的结构
	var empty = tools.$('.g-empty')[0]; 
	treeMenu.innerHTML = treeHtml(datas,-1)
	
	positionById(0);
	
	
	//渲染文件导航区域
	pathNav.innerHTML = createPathNavHtml(datas,0);
	
	tools.addEvent(treeMenu,"click",function (ev){
		var target = ev.target;
		if (tools.parents(target,".tree-title")){
			target = tools.parents(target,".tree-title");
			
			//找到div身上的id
			var fileId = target.getAttribute('data-id');
			
			renderNavFilesTree(fileId);
		};
	});
	
	//通过制定的id渲染文件区域，文件导航区域，树形菜单
	function renderNavFilesTree(fileId){
		//渲染文件导航
		pathNav.innerHTML = createPathNavHtml(datas,fileId);
		
		//如果指定的id没有子数据，需要提醒
		var hasChilds = dataControl.hasChilds(datas,fileId);
		if (hasChilds){  //如果有子数据，就渲染子数据的结构
			empty.style.display = 'none';
			fileList.innerHTML = createFileHtml(datas,fileId);	
		}else {
			empty.style.display = 'block';
			//清空掉fileList里面的内容
			fileList.innerHTML = "";
		};
		
		//需要给点击的div添加上样式，其余的div没有样式
		var treeNav = tools.$('.tree-nav',treeMenu)[0];
		
		tools.removeClass(treeNav,'tree-nav');
		positionById(fileId); 
		
		//通过隐藏域记录一下当前操作的父id
		getPidInput.value = fileId;
	};
	
	//找到文件区域下所有的文件
	var fileItem = tools.$(".file-item",fileList);
	var checkboxs = tools.$(".checkbox",fileList);
	tools.each(fileItem,function (item,index){
		fileHandle(item);
	});
	
	//给单独一个文件添加事件处理
	function fileHandle(item){
		//给每个文件夹绑定移入移出事件
		
		var checkBox = tools.$(".checkbox",item)[0];
		
		tools.addEvent(item,"mouseenter",function (){
			tools.addClass(this,"file-checked");
		});
		
		tools.addEvent(item,"mouseleave",function (){
			if (!tools.hasClass(checkBox,"checked")){
				tools.removeClass(this,"file-checked");
			}
		});
		
		//给checkbox添加点击处理
		tools.addEvent(checkBox,"click",function (ev){
			var isAddClass = tools.toggleClass(this,"checked")
			if (isAddClass){
				//判断一下是否所有的checkbox是否都被勾选了
				if(whoSelect().length == checkboxs.length){
					tools.addClass(checkedAll,"checked") 
				}
			}else {
				//只要当前这个checkbox没有被勾选，那么肯定全选按钮就没有class为checked 
				tools.removeClass(checkedAll,"checked")
			}
			//阻止冒泡
			ev.stopPropagation();
		});
	}
	
	var checkedAll = tools.$(".checked-all")[0];
	tools.addEvent(checkedAll,"click",function (){
		var isAddClass = tools.toggleClass(this,"checked");
		
		//判断是否有class
		if (isAddClass){
			tools.each(fileItem,function (item,index){
				tools.addClass(item,"file-checked");
				tools.addClass(checkboxs[index],"checked");
			});
		}else {
			tools.each(fileItem,function (item,index){
				tools.removeClass(item,"file-checked");
				tools.removeClass(checkboxs[index],"checked")
			});
		};
	});
	 
	//作用：找到所有的checkbox勾选的文件
	function whoSelect(){
		var arr = [];
		//找一下checkbox如果有class为checked，那么就存到数组中
		tools.each(checkboxs,function (checkBox,index){
			if (tools.hasClass(checkBox,"checked")){
				arr.push(fileItem[index]);
			};
		});
		return arr;
	};
	
	//新建文件功能
	var create = tools.$('.create')[0];
	tools.addEvent(create,"mouseup",function (){
		
		//需要把为空的提示隐藏起来
		empty.style.display = "none";
		
		var newElement = createFileElement({
			title:"",
			id:new Date().getTime()
		});
		fileList.insertBefore(newElement,fileList.firstElementChild);
		
		//获取标题
		var fileTitle = tools.$(".file-title",newElement)[0];
		var fileEdtor = tools.$(".file-edtor",newElement)[0];
		
		var edtor = tools.$(".edtor",newElement)[0];
		
		fileTitle.style.display = "none";
		fileEdtor.style.display = "block";
		
		edtor.select();  //自动获取光标
		
		create.isCreateFile = true;
	});
	
	//给document绑定一个mousedown时间，创建文件夹
	tools.addEvent(document,"mousedown",function (){
		//判断一下新创建的元素中的输入框是否有内容，如果有就创建
		if (create.isCreateFile){
			var fileElement = fileList.firstElementChild;
			var edtor = tools.$(".edtor",fileElement)[0];
			var val = edtor.value.trim();
			
			if (val === ""){
				fileList.removeChild(fileElement);
				
				//要看一下fileList里面有没有内容
				if (fileList.innerHTML === ""){
					empty.style.display = "block";
				}
				
			}else {
				var fileTitle = tools.$(".file-title",fileElement)[0];
				var fileEdtor = tools.$(".file-edtor",fileElement)[0];
				fileTitle.style.display = "block";
				fileEdtor.style.display = "none";
				
				fileTitle.innerHTML = val;
				
				//给新创建的问价添加事件处理
				fileHandle(fileElement);
				
				//在哪创建的，需要知道父id
				var pid = getPidInput.value;
				
				//当前这个元素的id
				var fileId = tools.$(".item",fileElement)[0].getAttribute('data-id');
				
				//把新创建的元素的结构，放在数据中
				var newFilsData = {
					id:fileId,
					pid:pid,
					title:val,
					type:"file"
				};
				
				//放在数据中
				datas.unshift(newFilsData);
			
				//通过pid，找到树形菜单中的div元素
				var elemen = document.querySelector('.tree-title[data-id="'+pid+'"]');
				var nextElement = elemen.nextElementSibling;
				
				//只需要找到指定的ul，append一个li元素
				
				var level = dataControl.getLevelById(datas,fileId)
				nextElement.appendChild(createTreeHtml({
					title:val,
					id:fileId,
					level:level
				}));
				
				if (nextElement.innerHTML !== ""){
					tools.addClass(elemen,"tree-contro");
					tools.removeClass(elemen,"tree-contro-none");
				};
				
				//创建成功提醒
				tipsFn("ok","新建文件成功");
				
			};
			
			create.isCreateFile = false;
		};
	});
	
	//封装小提醒
	var fullTipBox = tools.$(".full-tip-box")[0];
	var tipText = tools.$(".text",fullTipBox)[0];
	
	function tipsFn(cls,title){
		
		fullTipBox.style.top = "-32px"; 
		fullTipBox.style.transition = "none";
		
		setTimeout(function (){
			tipText.innerHTML = title;
			fullTipBox.className = "full-tip-box";
			fullTipBox.style.top = 0;
			fullTipBox.style.transition = "0.3s";
			tools.addClass(fullTipBox,cls);
		},0)
		
		clearInterval(fullTipBox.timer)
		fullTipBox.timer = setTimeout(function (){
			fullTipBox.style.top = "-32px";
		},2000);
	};
	
	
	//框选功能
	/*
		1.生成一个框选的div
		2.碰撞检测
	*/
	var newDiv = null;
	var disX = 0,disY = 0;
	tools.addEvent(document,"mousedown",function (ev){

		//如果事件元素是在.nav-a这些元素身上，就没有框选效果
		var target = ev.target;
		if( tools.parents(target,".nav-a") ){
			return;
		}

		disX = ev.clientX;
		disY = ev.clientY;

		

		//鼠标移动过程中
		tools.addEvent(document,"mousemove",moveFn);

		tools.addEvent(document,"mouseup",upFn);

		//去掉默认行为
		ev.preventDefault();

	})
	//移动的时候触发的函数
	function moveFn(ev){

		//在移动的过程中的位置-鼠标点击的位置 > 5 

		if( Math.abs(ev.clientX - disX) > 10 || Math.abs(ev.clientY - disY) > 10 ){

			if( !newDiv ){
				newDiv = document.createElement("div");
				newDiv.className = "selectTab";
				document.body.appendChild(newDiv);
			}
			newDiv.style.width = 0;
			newDiv.style.height = 0;
			newDiv.style.display = "block";
			newDiv.style.left = disX + "px";
			newDiv.style.top = disY + "px";

			var w = ev.clientX - disX;
			var h = ev.clientY - disY;

			newDiv.style.width = Math.abs(w) + "px";
			newDiv.style.height = Math.abs(h) + "px";

			//鼠标移动的过程中的clientX和在鼠标摁下的disX，哪一个小就把这个值赋给newDiv

			newDiv.style.left = Math.min(ev.clientX,disX) + "px";
			newDiv.style.top = Math.min(ev.clientY,disY) + "px";

			//做一个碰撞检测
			//拖拽的newDiv和那些文件碰上了，如果碰上的话就给碰上的文件添加样式，没碰上取消掉样式

			tools.each(fileItem,function (item,index){
				if( tools.collisionRect(newDiv,item) )	{ //碰上了
					tools.addClass(item,"file-checked");
					tools.addClass(checkboxs[index],"checked");
				}else{
					tools.removeClass(item,"file-checked");
					tools.removeClass(checkboxs[index],"checked");
				}
			});

			if( whoSelect().length === checkboxs.length ){
				tools.addClass(checkedAll,"checked");
			}else{
				tools.removeClass(checkedAll,"checked");
			}

		}



	}
	function upFn(){
		tools.removeEvent(document,"mousemove",moveFn);	
		tools.removeEvent(document,"mouseup",upFn);	
		if(newDiv) newDiv.style.display = "none";
	};
	
	
}());
