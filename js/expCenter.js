$(function() {
	//		var baseUrl = 'http://gomoredev.natapp4.cc';//开发地址
	//	var baseUrl = 'http://dg-dev.opple.com'; //测试地址
	var baseUrl = 'http://dg.opple.com'; //正式环境
	var productsDatas = {}; //存储所有商品
	var sceneDatas = {}; //存储所有场景信息
	var categoriesArr = []; //存储所有类型参数
	var isCategory = false; //标记类型索引
	var ishide = true; //控制列表缩回
	var type = 'styles'; //类型识别
	var searchTXT = ''; //搜索框内容
	var queryIndex = 0; //全局索引
	var totalNum = 0; //获取到的所有的商品数据
	var totalpages = 0; //获取到的所有的页数
	var totalPictures = []; //所有产品图片的地址
	var selectPictures = []; //选中的图片地址
	//初始化函数
	function init() {
		var postData = JSON.stringify({
			//			"username": "nhb1",
			//			"password": "123456",
			"username": "test2",
			"password": "123456"
		});
		$.ajax({
			url: baseUrl + "/opple-web/app/employee/login?api_key=login",
			contentType: 'application/json',
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeOut: 10000,
			data: postData,
			success: function(res) {
				if(res.code == 0) {
					//请求数据，获取所有产品筛选数据列表
					$.ajax({
						url: baseUrl + "/opple-web/app/goods/getGoodsFilter?api_key=login",
						contentType: 'application/json',
						dataType: 'json', //服务器返回json格式数据
						type: 'get', //HTTP请求类型
						timeOut: 10000,
						success: function(res) {
							console.log(res);
							if(res.code == 0) {
								productsDatas.categories = res.data.categories; //类型
								productsDatas.material = res.data.material; //材质
								productsDatas.price = res.data.price; //价格
								productsDatas.space = res.data.space; //空间
								productsDatas.styles = res.data.styles; //类型
								for(var i = 0; i < res.data.styles.length; i++) {
									$('#listMain').append('<li>' + res.data.styles[i].typeName + '</li>');
								}
								$('.contentMainBox ul').empty(); //清空列表内容
								handleQuery('', queryIndex, 1); //初始化显示产品
							} else {
								console.log(res.message);
							}
						},
						error: function(res) {
							console.error(res);
						}
					});
					$.ajax({
						url: baseUrl + "/opple-web/app/scene/getSceneFilter",
						contentType: 'application/json',
						dataType: 'json', //服务器返回json格式数据
						type: 'get', //HTTP请求类型
						timeOut: 10000,
						success: function(res) {
							console.log(res);
							if(res.code == 0) {
								sceneDatas.space = res.data.space; //空间
								sceneDatas.styles = res.data.styles; //类型
								for(var i = 0; i < res.data.styles.length; i++) {
									$('#listMain2').append('<li>' + res.data.styles[i].typeName + '</li>');
								}
								handleSceneQuery(queryIndex, 1); //初始化显示场景
							} else {
								console.log(res.message);
							}
						},
						error: function(res) {
							console.error(res);
						}
					});

				} else {
					console.log(res);
				}
			},
			error: function(res) {
				console.error(res);
			}
		});

	}
	init();

	//场景按钮绑定点击切换事件
	$('#sceneBtn').bind('click', function() {
		if($(this).attr('src') == "img/scene@2x2.png") { //如果当前场景为未选中状态
			if($('#contentBox').css('display') == 'block') { //如果产品展示区域显示
				$('#productBtn').attr('src', "img/product@2x2.png"); //将产品控制图片改为未选中
				$('#contentBox').slideUp(); //隐藏产品展示区域
			} else {
				$(this).attr('src', "img/scene@2x.png"); //将图片改为选中图片
				$('#contentBox2').slideDown(); //展示区域显示
			}

		} else {
			$(this).attr('src', "img/scene@2x2.png"); //将图片改为未选中图片
			$('#contentBox2').slideUp(); //展示区域隐藏
		}
	})
	//产品按钮绑定点击切换事件
	$('#productBtn').bind('click', function() {
		if($(this).attr('src') == "img/product@2x2.png") { //如果当前产品控制为未选中状态
			if($('#contentBox2').css('display') == 'block') { //如果场景展示区域显示
				$('#sceneBtn').attr('src', "img/scene@2x2.png"); //将场景控制图片改为未选中
				$('#contentBox2').slideUp(); //隐藏场景展示区域
			} else {
				$(this).attr('src', "img/product@2x.png"); //将图片改为选中图片
				$('#contentBox').slideDown(); //展示区域显示
			}

		} else {
			$(this).attr('src', "img/product@2x2.png"); //将图片改为未选中图片
			$('#contentBox').slideUp(); //展示区域隐藏

		}
	})
	//产品筛选列表点击事件
	$('#tagBox').on('click', 'li', function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('#listMain').empty(); //清空内部结点元素
		var index = $(this).index();
		if(index == 0) {
			type = 'styles';
			isCategory = false; //标记未选中类型选项
			for(var i = 0; i < productsDatas.styles.length; i++) {
				$('#listMain').append('<li>' + productsDatas.styles[i].typeName + '</li>');
			}
		} else if(index == 1) {
			type = 'space';
			isCategory = false; //标记未选中类型选项
			for(var i = 0; i < productsDatas.space.length; i++) {
				$('#listMain').append('<li>' + productsDatas.space[i].typeName + '</li>');
			}
		} else if(index == 2) {
			type = 'categories';
			isCategory = true; //标记选中类型选项
			for(var i = 0; i < productsDatas.categories.length; i++) {
				$('#listMain').append('<li>' + productsDatas.categories[i].name + '</li>');
				categoriesArr.push(productsDatas.categories[i]); //将每条类型存入
			}
		} else if(index == 3) {
			type = 'material';
			isCategory = false; //标记未选中类型选项
			for(var i = 0; i < productsDatas.material.length; i++) {
				$('#listMain').append('<li>' + productsDatas.material[i].typeName + '</li>');
			}
		} else if(index == 4) {
			type = 'price';
			isCategory = false; //标记未选中类型选项
			for(var i = 0; i < productsDatas.price.length; i++) {
				$('#listMain').append('<li>' + productsDatas.price[i].typeName + '</li>');
			}
		}
	})
	//场景筛选列表点击事件
	$('#tagBox2').on('click', 'li', function() {
		$(this).addClass('active').siblings().removeClass('active');
		$('#listMain2').empty(); //清空内部结点元素
		var index = $(this).index();
		if(index == 0) {
			type = 'styles';
			for(var i = 0; i < productsDatas.styles.length; i++) {
				$('#listMain2').append('<li>' + productsDatas.styles[i].typeName + '</li>');
			}
		} else if(index == 1) {
			type = 'space';
			for(var i = 0; i < productsDatas.space.length; i++) {
				$('#listMain2').append('<li>' + productsDatas.space[i].typeName + '</li>');
			}
		}
	})
	//产品交互ajax
	function ajaxFun(nameLike, categoryEquals, styleEquals, spaceEquals, materialEqueals, startprice, endprice, page) {
		var postData = JSON.stringify({
			"nameLike": nameLike,
			"categoryEquals": categoryEquals,
			"styleEquals": styleEquals,
			"spaceEquals": spaceEquals,
			"materialEqueals": materialEqueals,
			"startprice": startprice,
			"endprice": endprice,
			"page": {
				"total": 0,
				"page": page,
				"rows": 12,
				"sort": "",
				"order": "asc"
			}
		})
		$.ajax({
			url: baseUrl + "/opple-web/app/goods/query?api_key=login",
			data: postData,
			contentType: 'application/json',
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeOut: 10000,
			success: function(res) {
				console.log(res);
				if(res.code == 0) {
					totalpages = res.data.totalpages; //获取所有的页数
					//动态添加获取到的数据
					for(var i = 0; i < res.data.goodsEntity.length; i++) {
						$('.contentMainBox ul').append('<li>' +
							'<dl>' +
							'<dt><img src="' + res.data.goodsEntity[i].pictures.split(',')[0] + '"/></dt>' +
							'<dd>' +
							'<p>' + res.data.goodsEntity[i].name + '</p>' +
							'<p>' + res.data.goodsEntity[i].code + '</p>' +
							'<p>￥<span>' + res.data.goodsEntity[i].tagPrice + '</span></p>' +
							'</dd>' +
							'</dl>' +
							'</li>');
						totalPictures.push(res.data.goodsEntity[i].pictures);
					}
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
				console.error(res);
			}
		});
	}
	//处理产品查询
	function handleQuery(searchTXT, index, page) {
		if(type == 'styles') {
			var styleEquals = productsDatas.styles[index].typecode;
			ajaxFun(searchTXT, '', styleEquals, '', '', '', '', page);
		} else if(type == 'space') {
			var spaceEquals = productsDatas.space[index].typecode;
			ajaxFun(searchTXT, '', '', spaceEquals, '', '', '', page);
		} else if(type == 'material') {
			var materialEquals = productsDatas.material[index].typecode;
			ajaxFun(searchTXT, '', '', '', materialEquals, '', '', page);
		} else if(type == 'price') {
			var startprice = productsDatas.price[index].typeName.split('到')[0];
			var endprice = productsDatas.price[index].typeName.split('到')[1];
			ajaxFun(searchTXT, '', '', '', '', startprice, endprice, page);
		}
	}
	function handleCategoryQuery(searchTXT, index1, index2, page){
		var categoryEquals = categoriesArr[index1].children[index2].id;
			ajaxFun(searchTXT, categoryEquals, '', '', '', '', '', page);
	}
	//场景交互ajax
	function ajaxSceneFun(styleEquals, spaceEquals, page) {
		var postData = JSON.stringify({
			"styleEquals": styleEquals,
			"spaceEquals": spaceEquals,
			"page": {
				"total": 0,
				"page": page,
				"rows": 12,
				"sort": "",
				"order": "asc"
			}
		})
		$.ajax({
			url: baseUrl + "/opple-web/app/scene/query",
			data: postData,
			contentType: 'application/json',
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeOut: 10000,
			success: function(res) {
				console.log(res);
				if(res.code == 0) {
					totalpages = res.data.totalpages; //获取所有的页数
					$('#contentMainBox2 ul').empty(); //清空列表内容
					//动态添加获取到的数据
					for(var i = 0; i < res.data.list.length; i++) {
						$('#contentMainBox2 ul').append('<li><img src="' + res.data.list[i].pricure + '"/></li>')
					}
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
				console.error(res);
			}
		});
	}
	//处理场景查询
	function handleSceneQuery(index, page) {
		if(type == 'styles') {
			var styleEquals = sceneDatas.styles[index].typecode;
			ajaxSceneFun(styleEquals, '', page);
		} else if(type == 'space') {
			var spaceEquals = sceneDatas.space[index].typecode;
			ajaxSceneFun('', spaceEquals, page);
		}
	}

	//场景筛选列表分类详情点击事件
	$('#listMain2').on('click', 'li', function() {
		var index = $(this).index();
		queryIndex = index;
		nextPage = 2; //点击不同的选项，都将nextpage初始化为2
		$(this).addClass('active').siblings().removeClass('active');
		handleSceneQuery(index, 1);
	})

	//产品筛选列表分类详情点击事件
	$('#listMain').on('click', '>li', function(e) {
		var index = $(this).index();
		queryIndex = index;
		searchTXT = $('#search').val();
		nextPage = 2; //点击不同的选项，都将nextpage初始化为2
		totalPictures.splice(0, totalPictures.length); //切换选项的时候清空数组
		if(!isCategory) {
			$(this).addClass('active').siblings().removeClass('active');
			$('.contentMainBox ul').empty(); //清空列表内容
			handleQuery(searchTXT, index, 1);

		} else {
			var word = $(this).html();
			$(this).empty().html(word); //清空再重新加入原文字
			if($('#categoryBox').css('display') == 'block' && ishide) {
				//				$('#categoryBox').slideUp().parent().height(54);
				$('#categoryBox').slideUp().parent().css('margin-bottom', 0);
				$('#categoryBox').remove();
			} else {
				$(this).append('<ul class="categoryBox" id="categoryBox"></ul>'); 
				var len = categoriesArr[index].children.length;
				for(var i = 0; i < len; i++) {
					$('#categoryBox').append('<li class="categorylist">' + categoriesArr[index].children[i].name + '</li>');
				}
				//				$(this).height(54 * (len + 1));
				$(this).css('margin-bottom', 54 * (len)).siblings().css('margin-bottom', 0);
				$('#categoryBox').slideDown();
				ishide = true;
			}
		}
	})
	var queryIndex2 = 0; //记录类型内层选中索引
	$('#listMain').on('click', '.categoryBox li', function(e) {
		e.cancelBubble = true;
		if(e && e.stopPropagation) { //非IE浏览器 
			e.stopPropagation();
		} else { //IE浏览器 
			window.event.cancelBubble = true;
		}
		ishide = false;
		$(this).addClass('active').siblings().removeClass('active');
		console.log("点击子元素")
		var index = $(this).index();
		queryIndex2 = index;
		searchTXT = $('#search').val();
		$('.contentMainBox ul').empty(); //清空列表内容
		handleCategoryQuery(searchTXT, queryIndex, index, 1);
		return false;
	})

	//产品图片点击飞入效果
	$('.contentMainBox').on('click', 'li', function(e) {
		var cloneImg = $(this).children().find('img').clone();
		$(this).addClass('active');
		var index = $(this).index();
		selectPictures.push(totalPictures[index]); //将选中图片地址存入选中图片数组
		cloneImg.css({
			width: 100,
			height: 70
		});
		cloneImg.fly({
			start: {
				left: e.pageX, //开始位置（必填）#fly元素会被设置成position: fixed
				top: e.pageY, //开始位置（必填）
			},
			end: {
				left: $('#productBtn').offset().left + 20, //结束位置（必填）
				top: $('#productBtn').offset().top + 20, //结束位置（必填）
				width: 0, //结束时高度
				height: 0, //结束时高度
			},
			autoPlay: true, //是否直接运动,默认true
			onEnd: function() {
				//				cloneImg.attr(src)
				$('#productsBox ul').append('<li class="swiper-slide"><img src="' + cloneImg.attr('src') + '"/><i class="deleteImg"></i></li>')
				cloneImg.remove();
			} //结束回调
		});
	})

	//场景图片点击飞入效果
	var selectSceneArr = [];//存储场景中选中图片的索引
	$('#contentMainBox2').on('click', 'li', function(e) {
		var reg = new RegExp('active');
		var index = $(this).index();
		if(reg.test($(this).attr('class'))) { //如果当前场景图片选中
			$(this).removeClass('active');
			for(var i=0; i<selectSceneArr.length; i++){
				if(selectSceneArr[i]==index){
					$('#sceneBox ul li').eq(i).empty().remove();//从界面中移除
					selectSceneArr.splice(i,1);
				}
			}
			
		} else {
			var cloneImg = $(this).find('img').clone();
			$(this).addClass('active');
			
			selectSceneArr.push(index);
			cloneImg.css({
				width: 100,
				height: 70
			});
			cloneImg.fly({
				start: {
					left: e.pageX, //开始位置（必填）#fly元素会被设置成position: fixed
					top: e.pageY, //开始位置（必填）
				},
				end: {
					left: $('#sceneBtn').offset().left + 20, //结束位置（必填）
					top: $('#sceneBtn').offset().top + 20, //结束位置（必填）
					width: 0, //结束时高度
					height: 0, //结束时高度
				},
				autoPlay: true, //是否直接运动,默认true
				onEnd: function() {
					//				cloneImg.attr(src)
					$('#sceneBox ul').append('<li class="swiper-slide"><img src="' + cloneImg.attr('src') + '"/><i class="deleteImg"></i></li>')
					cloneImg.remove();
				} //结束回调
			});
		}

	})
	//点击搜索事件
	$('#searchBtn').click(function() {
		searchTXT = $('#search').val();
		$('.contentMainBox ul').empty(); //清空列表内容
		handleQuery(searchTXT, queryIndex, 1);
	})

	//点击右侧产品删除图片事件
	$('#productsBox ul').on('click', 'li i.deleteImg', function(e) {
		e.stopPropagation();
		var index = $(this).index();
		selectPictures.splice(index,1);//右侧图片删除，从选中图片数组中移除
		$(this).parent().empty().remove();
		
	})
	//点击下方场景图片删除图片事件
	$('#sceneBox ul').on('click', 'li i.deleteImg', function(e) {
		e.stopPropagation();
		var index = $(this).parent().index();
		console.log(selectSceneArr[index]);
		$('#contentMainBox2 li').eq(selectSceneArr[index]).removeClass('active');//根据选中图片记录的位置，更改场景中图片选中状态
		selectSceneArr.splice(index,1);
		$(this).parent().empty().remove();
	})
	//点击下方场景图片切换背景
	$('#sceneBox ul').on('click', 'li', function() {
		var backImgSrc = $(this).find('img').attr('src');
		$('.container').css('background-image', 'url(' + backImgSrc + ')');
	})

	//显示隐藏删除按钮
	$('#productsBox ul').on('mouseover', 'li', function() {
		$(this).find('i.deleteImg').show();
	})
	$('#productsBox ul').on('mouseleave', 'li', function() {
		$(this).find('i.deleteImg').hide();
	})
	$('#sceneBox ul').on('mouseover', 'li', function() {
		$(this).find('i.deleteImg').show();
	})
	$('#sceneBox ul').on('mouseleave', 'li', function() {
		$(this).find('i.deleteImg').hide();
	})

	var count = 0; //计算标记当前加入到场景中的产品图片数
	//点击添加商品到页面中心
	$('#productsBox ul').on('click', 'li', function() {
		var imgSrc = $(this).find('img').clone().attr('src');
		var index = $(this).index();
		var id = 'moveImgBox' + count;
		$('.container').append($('<div class="moveImgBox" id="' + id + '"></div>'));
		$('#' + id).addClass(id);
		$('#' + id).append($('<img class="moveImg" src="' + imgSrc + '"/>'));
		$('#' + id).append($('<i class="deleteImg"></i>'));//添加删除按钮标志
		$('#' + id).append($('<i class="rotateLeftImg"></i>'));//添加放大按钮标志
		$('#' + id).append($('<i class="rotateRightImg"></i>'));//添加减小按钮标志
		$(this).empty().remove();
		count++;
	})

	//页面中可移动图片的删除事件
	var deleteProductIndex = 0;//加入到场景中去的产品图从右侧出来的位置索引???????
	
	$('.container').on('mouseover', 'div.moveImgBox', function() {
		var className = $(this).attr('class').split(' ')[1];
		$(this).find('i.deleteImg').show();
		$(this).find('i.rotateLeftImg').show();
		$(this).find('i.rotateRightImg').show();
//		deleteProductIndex = className.substring(10,11);//?????????
		$(this).dragZoom();
		new Drag(className);
	})
	$('.container').on('mouseleave', 'div.moveImgBox', function() {
		$(this).find('i.deleteImg').hide();
		$(this).find('i.rotateLeftImg').hide();
		$(this).find('i.rotateRightImg').hide();
	})
	$('.container').on('click', 'div.moveImgBox i.deleteImg', function() {
		$(this).parent().empty().remove();
		var imgsrc = $(this).parent().find('img').attr('src');
		for(var i=0; i<selectPictures.length; i++){
			if(imgsrc == selectPictures[i].split(',')[0]){
				selectPictures.splice(i, 1); //在已选中图片数组中移除删除图片??????
			}
		}
//		selectPictures.splice(deleteProductIndex, 1); //在已选中图片数组中移除删除图片??????
	})
	//调整场景中图片的旋转
	var rotateRalue = 0;
	$('.container').on('click', 'div.moveImgBox i.rotateLeftImg', function() {
		rotateRalue -= 20;
        $(this).parent().rotate({ animateTo:rotateRalue})
	})
	$('.container').on('click', 'div.moveImgBox i.rotateRightImg', function() {
		rotateRalue += 20;
        $(this).parent().rotate({ animateTo:rotateRalue})
	})
	//点击切换灯亮度
	$('#light').click(function() {
		if($(this).attr('src') == 'img/trunoff@2x.png') {
			$(this).attr('src', 'img/trunon@2x.png');
			for(var i = 0; i < $('.moveImgBox').length; i++) {
				for(var j=0; j<selectPictures.length; j++){
					if($('.moveImgBox').eq(i).find('img').attr('src') == selectPictures[j].split(',')[0]){
						if(!selectPictures[j].split(',')[1]) {
							alert('没有可点亮资源图片！');
						} else {
							$('.moveImgBox').eq(i).find('img').attr('src', selectPictures[j].split(',')[1]);
						}
					}
				}
			}

		} else {
			$(this).attr('src', 'img/trunoff@2x.png');
			for(var i = 0; i < $('.moveImgBox').length; i++) {
				for(var j=0; j<selectPictures.length; j++){
					if($('.moveImgBox').eq(i).find('img').attr('src') == selectPictures[j].split(',')[1]){
							$('.moveImgBox').eq(i).find('img').attr('src', selectPictures[j].split(',')[0]);
					}
				}
//				$('.moveImgBox').eq(i).find('img').attr('src', selectPictures[productIndexArr[i]].split(',')[0]);
			}
		}
	})

	var swiper = new Swiper('.swiper-container', {
		scrollbar: '.swiper-scrollbar',
		scrollbarHide: true,
		slidesPerView: 'auto',
		//      centeredSlides: true,
		spaceBetween: 30,
		grabCursor: true
	});
	var swiper2 = new Swiper('.swiper-container2', {
		scrollbar: '.swiper-scrollbar',
		scrollbarHide: true,
		slidesPerView: 'auto',
		//      centeredSlides: true,
		spaceBetween: 20,
		grabCursor: true,
		direction: 'vertical'
	});

	//产品滚动加载更多
	var nextPage = 2;
	$('#contentMainBox').scroll(function(event) {
		var totalHeight = $('#contentMainBox ul li').length / 3 * 250; //当前ul的的高度，随着li的增加增加
		var currentHeight = $('#contentMainBox').scrollTop() + $('#contentMainBox').height(); //contentMainBox底部滚动距离
		if(isCategory){
			if((totalHeight - currentHeight) <= 0 && totalpages >= nextPage) {
				searchTXT = $('#search').val();
				handleCategoryQuery(searchTXT, queryIndex, queryIndex2, nextPage);
				nextPage++;
			}
			//		if(totalpages < nextPage) {
//			alert("已加载全部数据！")
//		}
		}else{
			if((totalHeight - currentHeight) <= 0 && totalpages >= nextPage) {
				console.log('小于100');
				searchTXT = $('#search').val();
				handleQuery(searchTXT, queryIndex, nextPage);
				nextPage++;
			}
			//		if(totalpages < nextPage) {
//			alert("已加载全部数据！")
//		}
		}
		

	});
	//场景滚动加载更多
	$('#contentMainBox2').scroll(function(event) {
		var totalHeight = $('#contentMainBox2 ul li').length / 3 * 170; //当前ul的的高度，随着li的增加增加
		var currentHeight = $('#contentMainBox2').scrollTop() + $('#contentMainBox2').height(); //contentMainBox底部滚动距离
		if((totalHeight - currentHeight) <= 0 && totalpages >= nextPage) {
			console.log('小于100');
			handleSceneQuery(queryIndex, nextPage);
			nextPage++;
		}
//		if(totalpages < nextPage) {
//			alert("已加载全部数据！")
//		}
	});
})