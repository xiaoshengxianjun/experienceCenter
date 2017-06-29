/*
 Author: luyunjun
 email:lulei90@qq.com
 Version:1.0(2014-7-26 20:03:23)
*/
;(function($){
    $.fn.dragZoom=function(options){
        var defaults ={
            'dzDad':this,//这里传需要被拖拽和滚动改变大小的jQuery对象的父亲jQuery对象
            'dzSon':this.children('img'),//需要被拖拽和滚动改变大小的jQuery对象
            'multiple':1.02,//放大缩小倍数
            'onlyDrag':false,//只拖拽 注意如果设置true 记得dzSon和dzDad相同
            'onlyZoom':false,//只放大缩小 注意如果设置true 记得dzSon和dzDad相同
            'minChoose':true,//是否限制缩小的最小值
            'minWidth':80,//图片缩小的最小宽度,如需启用请把minChoose设为true
            'minHeight':60,//图片缩小的最小高度,如需启用请把minChoose设为true
            'maxChoose':true,//是否限制放大的最大值
            'maxWidth':300,//图片缩小的最小宽度,如需启用请把maxChoose设为true
            'maxHeight':280,//图片缩小的最小高度，如需启用请把maxChoose设为true
            'resetTime':1000//设置重置按钮消失和显示的速度
        }
        var options= $.extend(defaults,options);
        if(options.onlyDrag||options.onlyZoom){
            options.dzSon=options.dzDad
        }

        //接收一个布尔值 真就放大 假就缩小
        function zoomOpen(detail){
            if(detail){
                options.dzSon.width(options.dzSon.width()*options.multiple);
                options.dzSon.height(options.dzSon.height()*options.multiple);
                options.dzDad.width(options.dzSon.width()*options.multiple);
                options.dzDad.height(options.dzSon.height()*options.multiple);
            }else{
                options.dzSon.width(options.dzSon.width()/options.multiple);
                options.dzSon.height(options.dzSon.height()/options.multiple);
                options.dzDad.width(options.dzSon.width()/options.multiple);
                options.dzDad.height(options.dzSon.height()/options.multiple);
            }
        }

        //图片最大最小宽高
        function judgeSize(){
            if(options.minChoose){
                if( options.dzSon.width()<options.minWidth){
                    options.dzSon.width(options.minWidth);
                }
                if( options.dzSon.height()<options.minHeight){
                    options.dzSon.height(options.minHeight);
                }
            }
            if(options.maxChoose){
                if( options.dzSon.width()>options.maxWidth){
                    options.dzSon.width(options.maxWidth);
                }
                if( options.dzSon.height()>options.maxHeight){
                    options.dzSon.height(options.maxHeight);
                }
            }
        }

        //判断重置按钮是否需要显示
//      function checkNeedReset(){
//          var checkValue=50;
//          var checkleft=parseInt(options.dzSon.css('left'));
//          var checktop=parseInt(options.dzSon.css('top'));
//          var checkright=checkleft+options.dzSon.width();
//          var checkbottom=checktop+options.dzSon.height();
//          var forh=options.dzDad.height();
//          var forw=options.dzDad.width();
//          if(checktop+checkValue>=forh||checkleft+checkValue>=forw||
//              checkright-checkValue<=0||checkbottom-checkValue<=0
//              ){
//              reset.fadeIn(options.resetTime);
//          }else{
//              reset.fadeOut(options.resetTime);
//          }
//      }
//      //设置重置功能
//      var defaultWidth=options.dzSon.width();
//      var defaultHeight=options.dzSon.height();
//      var reset=$('<div id="dragZoom_reset">重置</div>');
//      reset.css({
//          'width':'100px',
//          'height':'25px',
//          'lineHeight':'25px',
//          'fontSize':'16px',
//          'textAlign':'center',
//          'color':'#000',
//          'cursor':'pointer',
//          'backgroundColor':'#eee',
//          'opacity':'0.3',
//          'borderColor':'#999',
//          'borderStyle':'dashed',
//          'borderWidth':'1px',
//          'position':'absolute',
//          'display':'none'
//      })
//      var cleft=(options.dzDad.width()-reset.width())/2+'px';
//      var ctop=(options.dzDad.height()-reset.height())/2+'px';
//      reset.css({
//          'left':cleft,
//          'top':ctop
//      })
//      reset.hover(function(){
//          reset.css('opacity','0.6');
//      },function(){
//          reset.css('opacity','0.3');
//      })
//      reset.click(function(){
//          options.dzSon.width(defaultWidth);
//          options.dzSon.height(defaultHeight);
//          var releft=(options.dzDad.width()-defaultWidth)/2+'px';
//          var retop=(options.dzDad.height()-defaultHeight)/2+'px';
//          options.dzSon.css({
//              'left':releft,
//              'top':retop
//          });
//          reset.fadeOut(options.resetTime);
//      })
//      reset.appendTo(options.dzDad);

        this.each(function(){
            options.dzSon.css('cursor','pointer')
//          if(!options.onlyZoom){
//              //拖拽功能
//              options.dzSon.on('mousedown.drag',function(e){
//                  e.preventDefault();
//                  var mpx= e.clientX-$(this).position().left;
//                  var mpy= e.clientY-$(this).position().top;
//                  options.dzSon.on('mousemove.drag',function(e){
//                      e.preventDefault();
//                      checkNeedReset();
//                      var pleft= e.clientX-mpx;
//                      var ptop= e.clientY-mpy;
//                      options.dzSon.css({
//                          'top':ptop+'px',
//                          'left':pleft+'px'
//                      })
//                  });
//                  options.dzSon.on('mouseup.drag',function(e){
//                      options.dzSon.off('mousemove.drag');
//                      options.dzDad.off('mouseleave.drag');
//                      options.dzSon.off('mouseup.drag');
//                  })
//                  options.dzDad.on('mouseleave.drag',function(e){
//                      options.dzSon.off('mousemove.drag');
//                      options.dzSon.off('mouseup.drag');
//                      options.dzDad.off('mouseleave.drag');
//                  })
//              })
//          }
            if(!options.onlyDrag){
                //鼠标滚动放大缩小功能
                options.dzDad.on('mouseenter',function(e){
                    if(typeof this.onmousewheel !='undefined'){

                        this.onmousewheel=function(e){
                            var e=e||window.event;
                            if(e.preventDefault) {
                                e.preventDefault();
                            }else{
                                e.returnValue = false;
                            }
                            judgeSize();
                            zoomOpen(e.wheelDelta<0|| e.detail<0);
//                          checkNeedReset();
                        }
                    }else {
                        this.addEventListener('DOMMouseScroll',function(e){
                            e.preventDefault();
                            judgeSize();
                            zoomOpen(e.detail<0);
//                          checkNeedReset();
                        })
                    }
                })
            }

        });
        return this;//
    }
}(jQuery));
