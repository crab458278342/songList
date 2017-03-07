
var isplay;

$(".boxlink").click(function(e){
    e.preventDefault();
    $(".boxlink").removeClass('playing');
    $(this).addClass('playing');
    var liindex = $(this).attr('data-index');
    openDialog("p2");
    clickfunc(liindex);
});
$("#p2 .btn_close").click(function(e){
    audio.pause();
    isplay = true;
});

var audioIndex = 0;//��ǰ���ŵڼ���
var singernum = 0;
//���弰��ʼ��������
var a = audiojs.createAll({
  trackEnded: function() {
    var next = $('ol li.playing').next(); audioIndex++;
    if (!next.length){next = $('ol li').first(); audioIndex = 0;} 
    next.addClass('playing').siblings().removeClass('playing');
    audio.load($('a', next).attr('data-src'));
    audio.play();
    replay(audioIndex);
    $(".boxlink").removeClass('playing');
    $(".mp3link"+audioIndex).addClass('playing');
    singernum = parseInt(audioIndex)+1;
    $("#bgSinger img").attr("src","ossweb-img/bg_pop_singer"+singernum+".png");
  }
});
//���ż�ʱ��
function mtimeupdate(currentTime) {
    var index = lrc.findLrc(currentTime);
    if (curIndex != index) {
        lrcs = $(".lrc_scroll p");
        lrcs.eq(curIndex).removeClass('active');
        lrcs.eq(index).addClass('active');
        if (index > 4) {
            $(".lrc_scroll").animate({"margin-top": -36 * (index - 4)},500);
        }else{
            $(".lrc_scroll").animate({"margin-top": "0"},500);
        }
        curIndex = index;
    }
}
var audio = a[0];
    first = $('ol a').attr('data-src');
$('ol li').first().addClass('playing');
audio.load(first);

//�㲥����
$('ol li').click(function(e) {
  e.preventDefault();
  var liindex = $(this).index();
  clickfunc(liindex);
});

function clickfunc(liindex) {
  var $this = $('ol li').eq(liindex);
  $this.addClass('playing').siblings().removeClass('playing');
  audio.load($('a', $this).attr('data-src'));
  audio.play();
  audioIndex = liindex;
  replay(audioIndex);
};

//��һ�׸���
$('#next').click(function() {
    var next = $('li.playing').next();audioIndex++;
    if (!next.length) {next = $('ol li').first();audioIndex = 0;} 
    next.click();            
    replay(audioIndex);
});

//��һ�׸���
$('#prev').click(function() {
    var prev = $('li.playing').prev();audioIndex--;
    if (!prev.length) {prev = $('ol li').last();audioIndex = 3;} 
    prev.click();            
    replay(audioIndex);
});

//��ͣ����
$('#pause').click(function(e) {
    e.preventDefault();
    audio.playPause();
    if(!isplay){
      $('#pause').addClass('onplay');
      isplay = true;
    }else{
      $('#pause').removeClass('onplay');
      isplay = false;
    }
});

//����ִ�з���
var curIndex = 0;//��ǰ��curIndex����
var lrc = null;//�������
var lrcs = null;//�������
var _LrcS = LrcS;//����json�ļ�
var interHandler = null;//�����ʱ��

function replay(audioIndex){ 
  clearInterval(interHandler);//�������ʱ��
  interHandler = null;
  $(".lrc_scroll").html(" ");//�����������
  $(".lrc_scroll").css("margin-top","0");
  isplay = false;
  $('#pause').removeClass('onplay');
  $(".boxlink").removeClass('playing');
  $(".mp3link"+audioIndex).addClass('playing');
  singernum = parseInt(audioIndex)+1;
  $("#bgSinger img").attr("src","ossweb-img/bg_pop_singer"+singernum+".png");
  var currentTime = 0;

  interHandler = setInterval(function(){//��ʼ��ʱ
      var proh = $(".progress").width();
      var scrh = $(".scrubber").width();
      var loadPercent = proh/scrh;
      currentTime = audio.duration*loadPercent;
      mtimeupdate(currentTime);
  },500);

  $.ajax({
      url: "src/lrc"+audioIndex+".json",
      context: document.body,
      dataType: "json",
      success: function(data) {
          var lrcText = data.txt;
          showLrc(lrcText);

      },
      error: function(e) {
          var lrcText = e.responseText;
          showLrc(lrcText);
      }
  });
  
  //�����չʾjson���
  function showLrc(lrcText) {
      lrc = new LrcS(lrcText, "LRC");
      var _txt = "";
      $.each(lrc.lrc, function(index, val, arr) {
          if (index == 0) {
              _txt += "<p class='active'>" + val.txt + "</p>";
          } else {
              _txt += "<p>" + val.txt + "</p>";
          }
      });
      $(".lrc_scroll").html(_txt);
  }
}

