/* 如果需要修改为正常上线模式，请注释下面mock的import代码 */

// import "@/mock/index"
// import "@/mock/MessageBoard.mock"
import API from "@/utils/API"
// 请在下方实现自己的后端通信函数
export function get_json(set_data){
	var req = new XMLHttpRequest()	
	req.onreadystatechange = function()
	{
		if(req.readyState == 4 && req.status == 200)
			set_data(JSON.parse(req.responseText).data)		
	}
	req.open(API["GET_MESSAGE_LIST"].method, API["GET_MESSAGE_LIST"].path, true)
	req.send()
}

export function post_json(data, show_result, user){
	var req = new XMLHttpRequest()
	req.onreadystatechange = function(){
		// console.log(req.readyState)
		if(req.readyState == 4){
			if (req.status == 201)
				show_result(true)
			else show_result(false)
		} 
	}
	req.open(API["POST_NEW_MESSAGE"].method, API["POST_NEW_MESSAGE"].path + "?" + user, true)
	req.send(JSON.stringify(data))
}

export function request_json(type, call_back, data)
{
	if(type == false) get_json(call_back)
	else post_json(data, call_back)
}