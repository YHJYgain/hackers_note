<template>
    <div class="register-container" v-cloak>
        <div class="register-form" @keyup.enter="register">
            <p class="title">注册</p>
            <p class="message">Signup now and get full access to our app. </p>
            <div class="div-avatar" @click="openFileInput">
                <el-avatar class="avatar" title="点击更换头像" :size="100" :fit="cover">
                    <div class="avatar-image-container">
                        <img class="avatar-image" v-if="avatar" :src="avatar" alt="Avatar" />
                        <div v-else class="default-avatar">
                            <el-icon class="avatar-icon">
                                <Avatar />
                            </el-icon>
                        </div>
                    </div>
                </el-avatar>
                <input ref="fileInput" type="file" @change="handleAvatarChange" style="display: none;">
            </div>
            <label>
                <input class="input" id="username" required placeholder="" type="text" v-model="username">
                <span>用户名</span>
                <div v-if="usernameVaild" class="error-message">*请输入用户名或密码过长（≤ 7）</div>
            </label>
            <label>
                <input class="input" id="nickname" required placeholder="" type="text" v-model="nickname">
                <span>昵称</span>
                <div v-if="nicknameVaild" class="error-message">*请输入昵称或密码过长（≤ 7）</div>
            </label>
            <label>
                <input class="input" id="password" required placeholder="" :type="passwordFieldType" v-model="password">
                <span>密码</span>
                <el-icon class="password-toggle" @click="togglePasswordVisibility">
                    <template v-if="passwordVisible">
                        <View />
                    </template>
                    <template v-else>
                        <Hide />
                    </template>
                </el-icon>
            </label>
            <label>
                <input class="input" id="confirmPassword" required placeholder="" :type="passwordFieldType" v-model="confirmPassword">
                <span>确认密码</span>
                <el-icon class="password-toggle" @click="togglePasswordVisibility">
                    <template v-if="passwordVisible">
                        <View />
                    </template>
                    <template v-else>
                        <Hide />
                    </template>
                </el-icon>
            </label>
            <div v-if="passwordMismatch" class="error-message">*密码与确认密码不匹配或密码过长（≤ 7）</div>
            <button class="register-button" id="registerButton" type="submit" @click="register">注册</button>
            <p class="signin">已有账号 ?<router-link class="toLogin" to="/login">去登录</router-link></p>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Register',
    data() {
        return {
            hovered: false,          // 鼠标是否悬浮
            usernameVaild: false,    // 用户名是否有效
            nicknameVaild: false,    // 昵称是否有效
            passwordVisible: false,  // 控制密码的显示/隐藏
            passwordMismatch: false, // 密码是否匹配
            message: '',             // 操作提示信息
            avatar: '',              // 头像
            username: '',            // 用户名
            nickname: '',            // 昵称
            password: '',            // 密码
            confirmPassword: '',     // 确认密码
        };
    },
    computed: {
        passwordFieldType() {
            return this.passwordVisible ? 'text' : 'password';
        }
    },
    methods: {
        openFileInput() {
            this.$refs.fileInput.click();
        },
        handleAvatarChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.avatar = URL.createObjectURL(file);
                console.log(this.avatar);
            }
        },
        togglePasswordVisibility() {
            this.passwordVisible = !this.passwordVisible;
        },
        async register() {
            if (this.username == '' || this.nickname == '' || this.password == '' || this.confirmPassword == '') {
                ElMessage({
                    showClose: true,
                    message: "请将信息输入完整",
                    type: "warning",
                });
            } else if (this.usernameVaild || this.nicknameVaild || this.passwordMismatch) {
                ElMessage({
                    showClose: true,
                    message: "输入有误，请检查",
                    type: "warning",
                });
            } else {
                await axios
                    .put('/api/user/register', {
                        username: this.username,
                        password: this.password,
                        nickname: this.nickname,
                        avatar: this.avatar
                    })
                    .then((res) => {
                        console.log(res.data.message);
                        this.message = res.data.message;
                        if (this.message == '注册成功') {
                            console.log(res.data.data);
                            this.$store.dispatch('updateDefaultActive', 'login');
                            this.$router.push('/login');
                            ElMessage({
                                showClose: true,
                                message: this.message + '赶紧登录体验吧！',
                                type: "success",
                            });
                        } else {
                            ElMessage({
                                showClose: true,
                                message: this.message,
                                type: "warning",
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        ElMessage({
                            showClose: true,
                            message: "注册出错",
                            type: "error",
                        });
                    });
            }
        }
    },
    watch: {
        username(newUsername) {
            if (newUsername == '') {
                this.usernameVaild = true;
            } else {
                this.usernameVaild = false;
            }
            if (newUsername.length > 7) {
                this.usernameVaild = true;
            }
        },
        nickname(newNickname) {
            if (newNickname == '') {
                this.nicknameVaild = true;
            } else {
                this.nicknameVaild = false;
            }
            if (newNickname.length > 7) {
                this.nicknameVaild = true;
            }
        },
        password(newPassword) {
            if (this.confirmPassword && newPassword !== this.confirmPassword) {
                this.passwordMismatch = true;
            } else {
                this.passwordMismatch = false;
            }
            if (newPassword.length > 7) {
                this.passwordMismatch = true;
            }
        },
        confirmPassword(newConfirmPassword) {
            if (this.password && newConfirmPassword !== this.password) {
                this.passwordMismatch = true;
            } else {
                this.passwordMismatch = false;
            }
            if (newConfirmPassword.length > 7) {
                this.passwordMismatch = true;
            }
        }
    },
    created() {
        this.$store.dispatch('updateDefaultActive', 'register');
    },
}
</script>

<style scoped>
[v-cloak] {
    display: none;
}

.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 82vh;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
    position: relative;
    -webkit-animation: fade-in-fwd 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: fade-in-fwd 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

@-webkit-keyframes fade-in-fwd {
    0% {
        -webkit-transform: translateZ(-80px);
        transform: translateZ(-80px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}

@keyframes fade-in-fwd {
    0% {
        -webkit-transform: translateZ(-80px);
        transform: translateZ(-80px);
        opacity: 0;
    }

    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}

.title {
    font-size: 28px;
    color: royalblue;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
}

.title::before,
.title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: royalblue;
}

.title::before {
    width: 18px;
    height: 18px;
    background-color: royalblue;
}

.title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
}

.div-avatar {
    width: 108.5%;
}

.avatar {
    margin: 0 auto;
    width: 100px;
    height: 100px;
    cursor: pointer;
}

.avatar-image-container {
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 50%;
    margin: 0 auto;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform-origin: center;
    transition: transform 0.3s;
}

.avatar:hover .avatar-image {
    transform: scale(1.1);
}

.avatar-icon {
    font-size: 40px;
}

.default-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    transition: transform 0.3s;
}

.default-avatar:hover {
    transform: scale(1.1);
}

.message {
    color: rgba(88, 87, 87, 0.822);
    font-size: 14px;
    width: 108.5%;
}

.signin {
    color: rgba(88, 87, 87, 0.822);
    font-size: 14px;
}

.signin {
    text-align: center;
}

.toLogin {
    color: royalblue;
}

.toLogin:hover {
    text-decoration: underline royalblue;
}

.register-form label {
    position: relative;
}

.register-form label .input {
    width: 100%;
    padding: 10px 10px 20px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
}

.register-form label .input+span {
    position: absolute;
    left: 10px;
    top: 15px;
    color: grey;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
}

.register-form label .input:placeholder-shown+span {
    top: 15px;
    font-size: 0.9em;
}

.register-form label .input:focus+span,
.register-form label .input:valid+span {
    top: 30px;
    font-size: 0.7em;
    font-weight: 600;
}

.password-toggle {
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    user-select: none;
    font-size: 18px;
    color: grey;
}

.error-message {
    font-size: 1px;
    color: #f56c6c;
    text-align: left;
}

.register-button {
    border: none;
    outline: none;
    background-color: royalblue;
    padding: 10px;
    width: 108.5%;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
}

.register-button:hover {
    background-color: rgb(56, 90, 194);
}

@keyframes pulse {
    from {
        transform: scale(0.9);
        opacity: 1;
    }

    to {
        transform: scale(1.8);
        opacity: 0;
    }
}
</style>