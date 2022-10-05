<template>
    <div id="message-board">
        <el-container style="height: 100%; border: 1px solid #eee">
            <el-header style="text-align: right; font-size: 10px">
                <el-button
                    style="display: inline-block; margin-right: 15px"
                    v-on:click="postDialog.dialogVisible = true"
                >
                    <i class="el-icon-edit">发表</i>
                </el-button>
                <!--请修改这两行注释中间的代码完成"刷新"功能-->
                <el-button
                    style="display: inline-block; margin-right: 15px"
                    v-on:click="load_data"
                >
                <!--请修改这两行注释中间的代码完成"刷新"功能-->
                    <i class="el-icon-refresh" style="object-fit: fill">刷新</i>
                </el-button>
                <el-dropdown trigger="click">
                    <el-button
                        ><i class="el-icon-user" style="object-fit: contain">
                            <span v-if="state.username_valid">{{ state.username }}</span>
                            <span v-else>匿名</span></i
                        >
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="state.username_valid">
                            <a v-on:click="clearUserName()">注销</a>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="state.username_valid">
                            <a v-on:click="loginDialog.dialogVisible = true">修改</a>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="!state.username_valid">
                            <a v-on:click="loginDialog.dialogVisible = true">设置</a>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>

            <el-main>
                <!--请补全这两行注释中间的messagelist-->
                <MessageList :messageList="messageList"/>
                <!--请补全这两行注释中间的messagelist-->
            </el-main>

            <el-footer>@CST2021SE</el-footer>
        </el-container>
        <!--请补全这两行注释中间的PostDialog-->
        <PostDialog
            :set_visible="set_postdialog"
            :show_error="post_error"
            :show_result="post_result"
            :add_message="add_message"
            :state="state"
            :dialogVisible="postDialog.dialogVisible"
        />
        <!--请补全这两行注释中间的PostDialog-->
        <!--请补全这两行注释中间的LoginDialog-->
        <LoginDialog 
            :updateUsername="update_usr"
            :close_dialog="close_login"
            :state="state"
            :loginDialog="loginDialog"
        />
        <!--请补全这两行注释中间的LoginDialog-->
        <el-dialog
            style="text-align: center"
            :title="alertDialog.text"
            :visible.sync="alertDialog.dialogVisible"
            width="40%"
        >
        </el-dialog>
    </div>
</template>

<script>
import MessageList from "@/components/MessageList";
import PostDialog from "@/components/PostDialog";
import LoginDialog from "./LoginDialog";
import CookieOperation from "@/utils/tools"
import {get_json} from "@/utils/communication"
export default {
    name: "MessageBoard",
    components: {
        LoginDialog,
        MessageList,
        PostDialog,
    },
    // 请在下方设计自己的数据结构及函数来完成最终的留言板功能
    data() {
        return {
            postDialog: {
                dialogVisible: false,
            },
            loginDialog: {
                dialogVisible: false,
                dialogError: "",
                form: {
                    username: "",
                },
            },
            alertDialog: {
                text: "",
                dialogVisible: false,
            },
            state: {
                username: "",
                username_valid: false,
            },
            messageList: [],
        };
    },
    methods: {
        clearUserName() {
            //补全代码时可以使用utils/tool.js的代码
            this.state.username = ""
            this.state.username_valid = false
            CookieOperation.setCookie("user", "", -1)
        },
        load_data() {
            get_json(this.bind_data)
			this.alertDialog.text = "刷新成功！"
			this.alertDialog.dialogVisible = true
        },
        bind_data(json){
            this.messageList = []
            // console.log(json)
            for(var i = 0; i < json.length; i++)
            {
                var item = {
                    title: "",
                    message: "",
                    user: "",
                    timestamp: 0
                }
                item.title = json[i].title
                item.message = json[i].content
                item.user = json[i].user
                if(String(json[i].timestamp).length == 10)
                    item.timestamp = Number(json[i].timestamp) * 1000
                else item.timestamp = Number(json[i].timestamp)
                this.messageList.push(item) 
            }
        },
        set_postdialog(status) {
            this.postDialog.dialogVisible = status;
        },
        post_error() {
            this.alertDialog.text = "不能发表！";
            this.alertDialog.dialogVisible = true;
        },
        post_result(status) {
            if (status) this.alertDialog.text = "发送成功！";
            else this.alertDialog.text = "发送失败！";
            this.alertDialog.dialogVisible = true;
            this.postDialog.dialogVisible = false;
			// console.log(status)
        },
        add_message(data) {
            var time = new Date().getTime()
            var newdata = {
                title : data.title,
                message : data.message,
                user : this.state.username,
                timestamp : time
            }
            this.messageList.unshift(newdata)
        },
        update_usr() {
            var usr = CookieOperation.getCookie("user", "")
            if(usr != "")
                this.state.username = usr
                // this.state.username_valid = true
        },
        close_login() {
            this.loginDialog.dialogVisible = false
        }
    },
    created() {
        this.load_data()
    },
    watch: {
        // 用于实时检测username是否合法
        "state.username": {
            handler(newName) {
                this.state.username_valid =
                    /^[A-Za-z\u4e00-\u9fa5][-A-Za-z0-9\u4e00-\u9fa5_]*$/.test(newName);
            },
        },
    },
};
</script>

<style scoped>
#message-board {
    height: calc(100vh - 16px);
}
.message-tab {
    display: block;
    padding: 10px;
    text-align: left;
}
.el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
}
.el-footer {
    background-color: #7197c9;
    color: #333;
    line-height: 60px;
}
.el-aside {
    color: #333;
}
</style>
