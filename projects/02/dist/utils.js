var comm = window.comm || {};
comm.isEmpty=function(obj) {
    if (obj == null) {
        return true;
    }else if(obj === "null"){
        return true;
    } else if ( typeof (obj) == "undefined") {
        return true;
    }else if(obj === "undefined"){
        return true;
    } else if (obj === "") {
        return true;
    } else if ($.trim(obj) === "") {
        return true;
    } else if (obj.length === 0) {
        return true;
    } else {
        return false;
    }
};

comm.getQueryString=function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return '';
};

comm.askHttp=function (pId){
	var qhclickid = comm.getQueryString('qhclickid');
	if(!comm.isEmpty(qhclickid)){
		$.post("http://ret.huizbt.com/mtg_api/gateway/api/qh/eventPcSearchNew",{pId:pId,tabId:qhclickid,eventTime:new Date().getTime()},
		function(json){ console.info(json)});
		}
}

comm.askHttps=function (pId){
	var qhclickid = comm.getQueryString('qhclickid');
	if(!comm.isEmpty(qhclickid)){
		$.post("https://ret.huizbt.com/mtg_api/gateway/api/qh/eventPcSearchNew",{pId:pId,tabId:qhclickid,eventTime:new Date().getTime()},
		function(json){ console.info(json)});
		}
}

comm.askTwoHttp=function (pId){
	var qhclickid = comm.getQueryString('qhclickid');
	if(!comm.isEmpty(qhclickid)){
		$.post("http://ret.huizbt.com/mtg_api/gateway/api/qh/eventPcSearchTwo",{pId:pId,tabId:qhclickid,eventTime:new Date().getTime()},
		function(json){ console.info(json)});
		}
}

comm.askTwoHttps=function (pId){
	var qhclickid = comm.getQueryString('qhclickid');
	if(!comm.isEmpty(qhclickid)){
		$.post("https://ret.huizbt.com/mtg_api/gateway/api/qh/eventPcSearchTwo",{pId:pId,tabId:qhclickid,eventTime:new Date().getTime()},
		function(json){ console.info(json)});
		}
}

comm.askTwoTabHttp=function (pId){
	var qhclickid = comm.getQueryString('qhclickid');
	if(!comm.isEmpty(qhclickid)){
		$.post("http://ret.huizbt.com/mtg_api/gateway/api/qh/eventPcSearchTwoTab",{pId:pId,tabId:qhclickid,eventTime:new Date().getTime()},
		function(json){ console.info(json)});
		}
}

comm.askTwoTabHttps=function (pId){
	var qhclickid = comm.getQueryString('qhclickid');
	if(!comm.isEmpty(qhclickid)){
		$.post("https://ret.huizbt.com/mtg_api/gateway/api/qh/eventPcSearchTwoTab",{pId:pId,tabId:qhclickid,eventTime:new Date().getTime()},
		function(json){ console.info(json)});
		}
}

comm.askTwoHttpNoTab=function (pId){
	var tabId=new Date().getTime()
	$.post("http://ret.huizbt.com/mtg_api/gateway/api/qh/eventPcSearchTwo",{pId:pId,tabId:tabId,eventTime:new Date().getTime()},
		function(json){ console.info(json)});
}