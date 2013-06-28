/* slideMenu
* Fork form http://www.jeep.com.cn/11_grand_cherokee/2014/?&utm_campaign=2013%E5%B9%B4%E5%A4%A7%E5%88%87%E9%A2%84%E5%94%AE&utm_source=Smartmedia%E5%B9%BF%E5%91%8A%E7%BD%91%E7%BB%9C&utm_content=WK&utm_channel=Smartmedia%E5%B9%BF%E5%91%8A%E7%BD%91%E7%BB%9C&utm_medium=%E4%BC%98%E5%8A%BF%E5%B9%BF%E5%91%8A%E4%BD%8D&utm_term=201306240005
*
* 2013-06-28
* 分析一下儿, 看看他是怎么实现的
* 触发的脚本儿
* slideMenu.build( 'pic-silde', 750, 20, 10, 1 );
* 看了一遍, 发现写的真是无比的混乱, 估计是压缩过变量, 但话说逻辑也特别罗嗦
*/

var slideMenu = function(){
  var sp, st, t, m, sa, l, w, gw, ot;

  return{

    build : function( sm, sw, mt, s, sl, h ){
      /* 参数说明:
      slideMenu.build( 'pic-silde', 750, 20, 10, 1 );
      sm, Slide Menu 要处理的 slider, 这里是 'pic-silde'
      sw, Slide Width 每一个 slide 展开的宽度, 这里是 750
      mt, 估计是 Motion Time, 这里是 20
      s,  这里是 10
      sl, 这里是 1
      h, 这个参数貌似没参与任何计算
      */

      sp = s;                                   // 接收 参数 s
      st = sw;                                  // 参数里指定的, 每一个 slide 展开的宽度
      t  = mt;                                  // 接收 参数 t
      m  = document.getElementById(sm);         // 用参数传进来的 id 找到页面里要操作的 slider
      sa = m.getElementsByTagName('li');        // 在要操作的 slider 里, 找到每个 li
      l  = sa.length;                           // li 的个数儿
      w  = m.offsetWidth;                       // 要操作的 slider 的宽度
      gw = w / l;                               // 用 li 的个数儿 平分 slider 的宽度, 换句话说就是每个 li 正常的的宽度
      ot = Math.floor( (w - st) / ( l - 1 ) );  // 用完整宽度减去 展开的那个 slide 的宽度, 除以 slide 的个数减 1, 
                                                // 得出每个折叠的 slide 的宽度, 为了避免出现浮点数四舍五入, 用 floor() 方法下舍
                                                // 比如, 整个 slider 宽度是 948px, 展开后的 slide 宽750, slide 的个数是 7
                                                // ( ( 948 - 750 ) / ( 7 -1 ) ) = 33, 每个折叠的 slide 宽度是 33px

      var i = 0;
      for ( i; i<l; i++ ){
        s = sa[i];                              // 遍历每一个 slide
        s.style.width = gw + 'px';              // 给每一个 slide 设置 计算好的宽度
        this.timer(s)                           // 把遍历到的每一个 slide 用 timer 方法添加鼠标事件
      }

      if( sl != null ){                         // 如果参数里的 sl 不为 空
        m.timer = setInterval(                  // 按照参数 mt 设定的时间, 周期性调用下边的 slide 方法
          function(){
            slideMenu.slide( sa[sl - 1] )       // 调用 slide 方法, 参数是 sa 数组里 的 sl - 1个, sl 是参数传进来
          },
          t                                     // 参数里传进来的 mt
        )
      }
    },




    timer : function( s ) {                     // timer 方法, 参数是 slider里的 某个 li
      s.onmouseover = function() {              // 当鼠标 hover 时, 
        clearInterval(m.htimer);                // 取消 htimer 变量所引用的 周期性调用
        clearInterval(m.timer);                 // 取消 timer 变量所引用的 周期性调用
        m.timer = setInterval(                  // 设置一个周期性调用 timer
          function(){                           // 按照参数 mt 传进来的时间, 周期性的在指定的 li 上调用 slide 方法
            slideMenu.slide( s )                // 指定的 li 是由 调用 timer 方法时的参数 s 传进来的
          },
          t
        )
      }

      s.onmouseout = function(){                // 当鼠标移出是,
        clearInterval(m.timer);                 // 取消 timer 变量所引用的 周期性调用
        clearInterval(m.htimer);                // 取消 htimer 变量所引用的 周期性调用
        m.htimer = setInterval(                 // 设置一个周期性调用 htimer
          function() {                          // 按照参数 mt 传进来的时间, 周期性的在指定的 li 上调用 slide 方法
            slideMenu.slide ( s, true )         // 指定的 li 是由 调用 timer 方法时的参数 s 传进来的, 另一个 slider 的参数 c 设置为 true
          },
          t
        )
      }
    },

    slide : function( s, c ){                   // slide 方法, 两个参数, s 用来指定某个 li , c 是个条件参数

      var cw = parseInt( s.style.width );       // 获取 参数s 传进来的那个 li 的宽度, 然后取整, 赋值给 cw

      if( (cw < st && !c) || (cw > gw && c) ){  // 如果 cw 小于 设定好的 slide 展开后的宽度, 并且是由 timer 调用的时候, 或者
                                                // cw 大于 每个 slide 正常情况下的宽度, 并且是由 htime 调用的时候...
        var owt = 0;
        var i = 0;

        for( i; i < l; i++ ){                   // 遍历每个 li

          if( sa[i] != s ){                     // 如果当前遍历到的li 不是调用 slide 方法时的那个 li

            var o, ow;
            var oi = 0;
                o  = sa[i];                     // 把当前遍历到的那个 li 赋值给 o
                ow = parseInt( o.style.width ); // 把当前遍历到的那个 li 的 宽度, 赋值给 ow

            if ( ow < gw && c ) {                    // 如果 ow 小于 每个 slide 正常情况下的宽度, 并且是由 htimer 调用的
              oi = Math.floor( ( gw - ow ) / sp );   // 计算 每个 slide 正常情况下的宽度 减去 ow 之后再 除以 10, (sp接收的是参数 s)
              oi = ( oi > 0 ) ? oi : 1;              // 
              o.style.width = ( ow + oi ) + 'px';
            } else if ( ow > ot && !c ){             // 如果 ow 大于 slide 折叠后的宽度, 并且是由 timer 调用的
              oi = Math.floor( (ow - ot ) / sp );    // 
              oi = ( oi > 0 ) ? oi : 1;
              o.style.width = ( ow - oi ) + 'px'
            }

            if ( c ){
              owt = owt + ( ow + oi )
            } else {
              owt = owt + ( ow - oi )
            }
          }
        }
        s.style.width = ( w - owt ) +'px';
      } else {
        clearInterval(m.timer);
        clearInterval(m.htimer);
      }
    }
  };
}();
