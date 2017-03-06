;(function(){

	var _extend = function(o1,o2){
		for(var attr in o2)	{
			o1[attr] = o2[attr];
		}
		return o1;
	};

	var _analysis = function(){
		switch (this.lrcType ){
			case "LRC" :  _analysisLrc.call(this);break;
		}
	};

	var _analysisLrc = function(){

		var lrcObj = {},
			lrcArray = this.lrcStr.split(/[\n\\n]/);

		for(var i=0;i<lrcArray.length;i++){
			var lyric = decodeURIComponent(lrcArray[i]);
			var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
			var timeRegExpArr = lyric.match(timeReg);
			if(!timeRegExpArr)continue;

			//�����׼�������
			var clause = lyric.replace(timeReg,'');
			this.lrcArray.push(clause);

			for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
				var t = timeRegExpArr[k];
				var min = Number(String(t.match(/\[\d*/i)).slice(1)),
					sec = Number(String(t.match(/\:\d*/i)).slice(1));
				var time = min * 60 + sec;

				//���������ĸ����Ϣ����
				lrcObj[time] = {
					txt : clause,
					index : this.lrcArray.length - 1 
				}
			}
		}
		this.lrc = lrcObj;
	};

	/*
	 * ���캯��
	 * lrcStr - ԭʼ����ַ���
	 * */
	function Constructor (lrcStr,type){
		this.lrcStr = lrcStr;	
		this.lrcType = type;
		this.lrcArray = [];
		_analysis.call(this);
	}

	_extend(Constructor.prototype,{
		findLrc : function(second){
			//�ҵ��ȵ�ǰʱ��С,����������ʱ��
			//��Ϊ��ʶ�����ʱ��֮���
			var min = 3;
			for( var i in this.lrc){
				if ( i < second &&   Math.abs(second - i) < Math.abs(second - min) ){
					min = i;
				}
			}
			return this.lrc[min]['index'];
		},

		getLrc : function(index){
			return this.lrcArray[index];
		}
	
	});

	window.LrcS = Constructor;	

})();
