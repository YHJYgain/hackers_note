<template>
    <el-menu class="el-menu-demo" :default-active="getDefaultActive" @select="handleMenuSelect" mode="horizontal"
        router="true" :ellipsis="false">
        <el-menu-item index="home" route="/"><el-icon><HomeFilled /></el-icon>首页</el-menu-item>
        <el-menu-item id="publishArticle" index="publishArticle" route="/publishArticle"><el-icon><Management /></el-icon>发布博文</el-menu-item>
        <el-menu-item index="about" route="/about"><el-icon><InfoFilled /></el-icon>关于</el-menu-item>
        <div class="flex-grow">
            <h2>Welcome Hackers Note！</h2>
        </div>
        <template v-if="user">
            <!-- 显示用户信息 -->
            <el-menu-item index="user" route="/user"><el-icon><UserFilled /></el-icon>个人中心</el-menu-item>
            <el-menu-item id="logout" index="logout" @click="logout">退出</el-menu-item>
        </template>
        <template v-else>
            <!-- 显示登录和注册链接 -->
            <el-menu-item id="register" index="register" route="/register">注册</el-menu-item>
            <el-menu-item id="login" index="login" route="/login">登录</el-menu-item>
        </template>
    </el-menu>
</template>

<script>
import axios from 'axios';
import { ElMessage } from "element-plus";

export default {
    name: 'NavBar',
    data() {
        return {
            user: this.$store.state.user, // 当前用户
        };
    },
    computed: {
        getDefaultActive() {
            return this.$store.state.defaultActive;
        },
    },
    methods: {
        handleMenuSelect(selectedMenu) {
            this.$store.dispatch('updateDefaultActive', selectedMenu);
        },
        async logout() {
            await axios
                .get('/api/user/logout')
                .then((res) => {
                    if (res.data.message == '退出成功') {
                        console.log(res.data.data);
                        this.user = null;
                        this.$store.dispatch('logout');
                        this.$store.dispatch('updateDefaultActive', 'login');
                        this.$router.push('/login');
                        ElMessage({
                            showClose: true,
                            message: "退出成功",
                            type: "success",
                        });
                    } else {
                        this.$store.dispatch('updateDefaultActive', 'home');
                        this.$router.push('/home');
                        ElMessage({
                            showClose: true,
                            message: res.data.message,
                            type: "warning",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$store.dispatch('updateDefaultActive', 'home');
                    this.$router.push('/home');
                    ElMessage({
                        showClose: true,
                        message: "退出出错",
                        type: "error",
                    });
                });
        },
    },
    watch: {
        '$store.state.user': {
            immediate: true,
            handler(newValue) {
                this.user = newValue;
            },
        },
        '$store.state.defaultActive': {
            immediate: true,
            handler(newValue) {
                this.$store.state.defaultActive = newValue;
            },
        },
    },
}
</script>

<style scoped>
.el-menu-demo {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
}

.el-menu-item {
    font-size: medium;
}

.flex-grow {
    flex-grow: 1;
}

.flex-grow h2 {
    font-size: 1.23em;
    margin-right: 14.5%;
    text-shadow: -1px 1px #bbb, -2px 2px #bbb, -3px 3px #bbb, -4px 4px #bbb;
    animation: showup 3s forwards;
}

@keyframes showup {
    from {
        letter-spacing: -50px;
    }

    to {
        letter-spacing: 6px;
    }
}
</style>