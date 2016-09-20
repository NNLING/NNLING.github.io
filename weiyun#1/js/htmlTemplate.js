function fileContent(fileData){
	var str =  '<div class="item" data-id="'+fileData.id+'">'+
                        '<lable class="checkbox"></lable>'+
                        '<div class="file-img">'+
                            '<i></i>'+
                        '</div>'+
                        '<p class="file-title-box">'+
                            '<span class="file-title">'+fileData.title+'</span>'+
                            '<span class="file-edtor">'+
                                '<input class="edtor" value="'+fileData.title+'" type="text"/>'+
                            '</span>'+
                        '</p>'+
                    '</div>';
    return str;
}

// 渲染页面内容
function fileHtml(fileData){
	var fHtml = '<div class="file-item">'+fileContent(fileData)+'</div>';
    return fHtml;
};

//点击新建文件，返回一个div的元素对象
function createFileElement(fileData){
	var newDiv = document.createElement("div");
	newDiv.className = "file-item";
	newDiv.innerHTML = fileContent(fileData);
	return newDiv;
}

// 渲染树形菜单内容

function treeHtml (data,num){
	
	var childs = dataControl.getChildById(data,num);
	var html = '<ul>';
	childs.forEach(function (item){
		
		var level = dataControl.getLevelById(data,item.id);
		var hasChild = dataControl.hasChilds(data,item.id);
		var classNames = hasChild ? " tree-contro" : " tree-contro-none";
		//  tree-nav tree-contro
		html += '<li>'+
                 '<div class="tree-title'+classNames+'" data-id="'+item.id+'" style="padding-left:'+level*14+'px;">'+
                   '<span>'+
                        '<strong class="ellipsis">'+item.title+'</strong>'+
                        '<i class="ico"></i>'+
                    '</span>'+
                '</div>'+treeHtml(data,item.id)+
                '</li>';
	});
	
	html += '</ul>';
	return html;
};

function createFileHtml(datas,renderId){
	var childs = dataControl.getChildById(datas,renderId);
	var html = "";
	childs.forEach(function (item){
		html += fileHtml(item);
	});
	return html;
};

//创建文件的时候，创建一个树形菜单的li
function createTreeHtml(options){
	var newLi = document.createElement("li");
	newLi.innerHTML = '<div class="tree-title tree-contro-none" data-id="'+options.id+'" style="padding-left:'+options.level*14+'px;">'+
                   		'<span>'+
                        '<strong class="ellipsis">'+options.title+'</strong>'+
                        '<i class="ico"></i>'+
                    	'</span>'+
                		'</div><ul></ul>';
    return newLi;
}


//通过ID定位到树形菜单，添加class
function positionById(positionId){
	var ele = document.querySelector('.tree-title[data-id="'+positionId+'"]');
	tools.addClass(ele,"tree-nav");
};

//通过ID得到当前这个ID所有的父数据，得到一个结构

function createPathNavHtml(datas,fileId){
	//找到指定id所有的父数据
	var parents = dataControl.getParents(datas,fileId).reverse();
	var len = parents.length;
	var pathNavHtml = '';
	parents.forEach(function (item,index){
		if ( index === parents.length-1 ) return;
		pathNavHtml += '<a href="javascript:;" style="z-index:'+len--+'" data-id="'+item.id+'">'+item.title+'</a>'
	});
	
	//是当前这个一层的导航内容
	pathNavHtml += '<span class="current-path" style="z-index:'+len--+'" data-id="0">'+parents[parents.length-1].title+'</span>';
	
	return pathNavHtml;
}
