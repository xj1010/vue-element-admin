<!--优惠券弹窗js-->
<link rel="stylesheet" href="//cdn.shopifycdn.net/s/files/1/0428/5612/0472/t/26/assets/bootstrap.min.css">
  <script src="//cdn.shopifycdn.net/s/files/1/0428/5612/0472/t/26/assets/bootstrap.min.js"></script>
  <script src="//cdn.shopifycdn.net/s/files/1/0428/5612/0472/t/26/assets/clipboard.min.js"></script>

  <script>
  $(function(){
    $('.main-content ').css({'margin-top':'0px', 'padding-top':'0px'});

    function getCookie(name) {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    }
    //删除cookies
    function delCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval=getCookie(name);
      if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
    function setCookie(name,value,time) {
      var strsec = getsec(time);
      var exp = new Date();
      exp.setTime(exp.getTime() + strsec*1);
      document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() +";path=/";
    }

    function getsec(str) {
      var str1=str.substring(1,str.length)*1;
      var str2=str.substring(0,1);
      if (str2=="s") {
        return str1*1000;
      } else if (str2=="h") {
        return str1*60*60*1000;
      } else {
        return str1*24*60*60*1000;
      }
    }

    //var web_name = "www.sharelily.com";
    var web_name = document.domain;
    var couponCode = 'dj_coupon_name';
    var couponExpiretime = 'dj_coupon_expire_time';
    var isCouponCopy = 'is_coupon_copy';
    var code = getCookie(couponCode);
    var expireTime = getCookie(couponExpiretime);
    var isCollection = false;
    var collection = '';
    var url = location.href.toLocaleLowerCase();
    //是否直播链接
    if (url.lastIndexOf("collections/live-") != -1  && url.lastIndexOf("/products") == -1  ) {
      isCollection = true;
      var urlArr = url.match(/live-([^\/]+)/);
      if(urlArr) {
        collection = urlArr[1];
        console.log(collection);
      }

    }

    //是否已经copy优惠券
    var isCopy = getCookie(isCouponCopy);;
    if (code && expireTime) {
      time_down(expireTime, code);
    }else{
      if(isCollection) {
        get_coupon_num();
      }

    }

    function time_down(endTime, code, isShowAlert=true, isShowCodeNum=true) {
      var b = $(".date_down");
      var b1 = $(".date_down1");
      var timeout = setInterval(function(){
        var nowtime = new Date();//获取当前时间
        //下面是将时间差转换成时分秒
        var time_c=(endTime - nowtime.getTime())/1000;
        if (time_c <= 0) {
          var shi = fen = miao = "00";
          clearInterval(timeout);
          var str ="<span class='shi'>"+shi+"</span>"+":<span class='shi'>"+fen+"</span>"+":<span class='shi'>"+miao+"</span>";
          b.html(str);
          if(b1.length>0){
            var str1 ="<span class='time'>"+shi+"</span>"+":<span class='time'>"+fen+"</span>"+":<span class='time'>"+miao+"</span>";
            b1.html(str1);
          }
          get_coupon_num();
        }else{
          var shi=parseInt(time_c/(60*60)%24);
          if(shi.toString().length == 1) {
            shi = "0" + shi;
          }
          var fen=parseInt((time_c/60)%60);
          if(fen.toString().length == 1) {
            fen = "0" + fen;
          }

          var miao=parseInt(time_c%60);
          if(miao.toString().length == 1) {
            miao = "0" + miao;
          }

          var str ="<span class='shi'>"+shi+"</span>"+":<span class='shi'>"+fen+"</span>"+":<span class='shi'>"+miao+"</span>";
          b.html(str);
          if(b1.length>0){
            var str1 ="<span class='time'>"+shi+"</span>"+":<span class='time'>"+fen+"</span>"+":<span class='time'>"+miao+"</span>";
            b1.html(str1);
          }
        }
      },1);
      $('.coupon_code_info,.coupon_code_info1').html(code);
      if(isShowAlert && $('#myModal2').length > 0) {
        if(!isCopy && isCollection) {
          $('#myModal2').modal('show');
        }
        $('#myModal1').modal('hide');
      }
      $('.ad_block_v1').css('display', 'none');
      $('.ad_block_v2').css('display', 'block');
      isShowCodeNum && get_coupon_num(true);

    }


    function get_coupon_num(isOnlyNum = false) {
      $.ajax({
        type : "get",
        url : "https://goods.poemfuture.com/coupon/get_coupon_nums",
        //jsonp: "jsonpCallback",//服务端用于接收callback调用的function名的参数
        dataType : "json",//数据类型为jsonp
        data : {'site_name':web_name, 'collection':collection},
        success : function(data){
          //如果只是查询数量
          if(isOnlyNum) {
            var codeLeftNum = 0;
            if(data && data.code==200) {
              codeLeftNum = data.data.nums;
            }
            $('.code_left_num').html(codeLeftNum);
            if(codeLeftNum == 0) {
              $('#myModal2').modal('hide');
            }
            return true;
          }

          if(data && data.code==200) {
            $('.coupon_num').html(data.data.nums)
            if($('#myModal1').length > 0 &&  data.data.nums>0  ) {
              if(!isCopy && isCollection) {
                $('#myModal1').modal('show');
              }
              $('#myModal2').modal('hide');
            }

            $('.ad_block_v1').css('display', 'block');
            $('.ad_block_v2').css('display', 'none');
          }else{
            if($('#myModal1').length > 0) {
              $('#myModal1').modal('hide');
              $('#myModal2').modal('hide');
            }

            $('.ad_block_v1').css('display', 'none');
            $('.ad_block_v2').css('display', 'none');
          }
        },
        error:function(){
          console.log('fail');
        }
      });
    }


    $('.getCode, .getCode1').click(function(){
      var that = this;
      if($('body').data('islock') == 1) {
        return false;
      }
      $('body').data('islock', 1);
      $.ajax({
        type : "get",
        url : "https://goods.poemfuture.com//coupon/receive",
        dataType : "json",//数据类型为jsonp,
        data : {'site_name':web_name, 'collection':collection},
        success : function(data){
          $('body').data('islock', 0);
          console.log(data);
          if(data && data.code==200) {
            var expire_end_time = new Date().getTime() + data.data.expire_period_time;
            data.data.end_time = expire_end_time;
            var time_c = (data.data.end_time - new Date().getTime())/1000;
            var expireDay = 'd' + parseFloat(time_c/86400);
            setCookie(couponCode, data.data.code,  expireDay);
            setCookie(couponExpiretime, data.data.end_time, expireDay);

            isShowAlert = $(that).attr('class') == "getCode1" ? false : true;
            time_down(data.data.end_time, data.data.code, isShowAlert, false);
            $('.code_left_num').html(data.data.nums);
            //window.location.href="http://" + window.location.host + "/discount/" + data.data.code;

            $.ajax({
              type : "get",
              url : "http://" + window.location.host + "/discount/" + data.data.code,
              //jsonp: "jsonpCallback",//服务端用于接收callback调用的function名的参数
              data : {},
              success : function(data){
              },
              error:function(){
                console.log('fail');
              }
            });




            //return true;
          }else if(data.code==1001 || data.code==1002 || data.code==202){
            $('.ad_block_v4').css('display', 'block');
            $('.note_msg').html(data.msg);
            setTimeout(function(){
              $('.ad_block_v4').css('display', 'none');
            }, 3000);
          }else{
            if($('#myModal1').length > 0){
              $('#myModal1').modal('hide');
              $('#myModal2').modal('hide');
            }

            $('.ad_block_v1').css('display', 'none');
            $('.ad_block_v2').css('display', 'none');
            return false;
          }
        },
        error:function(){
          $('body').data('islock', 0);
          console.log('fail');
        }
      });
    });
    //关闭弹窗触发
    $('.modal').on('hidden.bs.modal', function () {

    });

    function setCouponFlag() {
      var expireTime = getCookie(couponExpiretime);
      if(expireTime) {
        var time_c = (expireTime - new Date().getTime())/1000;
        var expireDay = 'd' + parseFloat(time_c/86400);
        setCookie(isCouponCopy, 1,  expireDay);

        if($('#myModal1').length > 0){
          $('#myModal1').modal('hide');
          $('#myModal2').modal('hide');
        }

        $('.ad_block_v1').css('display', 'none');
      }

    }

    //复制coupon_code
    var clipboard = new Clipboard('.coupon_code_info');
    clipboard.on('success', function(e) {
      setCouponFlag();
      console.log(e);
      window.getSelection().empty();
      $('.ad_block_v3').css({'display':'block', 'z-index':'999999'});
      setTimeout(function(){
        $('.ad_block_v3').css('display', 'none');
      }, 3000);

    });
    clipboard.on('error', function(e) {
      alert('copy fail');
    });

    var clipboard1 = new Clipboard('.coupon_code_info1');
    clipboard1.on('success', function(e) {
      setCouponFlag();
      console.log(e);
      window.getSelection().empty();
      $('.ad_block_v3').css('display', 'block');
      setTimeout(function(){
        $('.ad_block_v3').css('display', 'none');
      }, 3000);

    });
    clipboard1.on('error', function(e) {
      alert('copy fail');
    });


  });


</script>
