<template>
    <div id="stage3">
        <!--修改下方的MessageList和PostDialog，注意做好数据绑定-->
        <MessageList :messageList="messageList" />
        <PostDialog
            :dialogVisible="dialogVisible"
            :state="state"
            :add_message="post_offline"
        />
    </div>
</template>

<script>
import MessageList from "@/components/MessageList.vue";
import PostDialog from "@/components/PostDialog.vue";
import CookieOperation from "@/utils/tools";
export default {
    name: "Stage3",
    components: {
        MessageList,
        PostDialog,
    },
    mounted() {
        CookieOperation.setCookie("username", "Alice", 1e9); //仅用于测试PostDialog
        this.state.username = "Alice";
    },
    // 请在下方设计自己的数据结构和函数，例如其中messageList是用于保存从后端获取到的消息列表，dialogVisible可以用于标识对话框是否显示（参见Vue对话框组件的属性列表）
    data() {
        return {
            messageList: [],
            dialogVisible: true,
            state: {
                username: "",
                username_valid: false,
            },
        };
    },
    methods: {
        post_offline(data) {
            this.dialogVisible = false;
            var time = new Date().getTime();
            var newdata = {
                title: data.title,
                message: data.message,
                user: this.state.username,
                timestamp: time,
            };
            this.messageList.unshift(newdata);
        },
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