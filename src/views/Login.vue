<template>
    <div class="login-container">
        <div class="login-form">
            <div class="heading">登录</div>
            <div class="form" @keyup.enter="login">
                <input required class="input" id="username" type="text" name="username" v-model="username" placeholder="用户名">
                <input required class="input" id="password" type="password" name="password" v-model="password" placeholder="密码">
                <span class="forgot-password" @click="forgotPassword">忘记密码？</span>
                <button class="login-button" id="loginButton" type="submit" @click="login">登录</button>

            </div>
            <div class="social-account-container">
                <span class="title">Or <router-link to="/register">注册</router-link></span>
                <div class="social-accounts" @click="loginBysocialAccounts">
                    <el-image class="social-button" v-for="(contact, index) in contacts" :key="index" :src="contact.icon"
                        style="width: 25px; height: 25px" :fit="cover">
                    </el-image>
                    <div v-if="showTooltip" class="tooltip">
                        <img :src="currentQRCode" alt="二维码">
                        <p>{{ currentContactInfo }}</p>
                    </div>
                </div>
            </div>
            <span class="agreement"><router-link to="/about">Learn about us</router-link></span>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Login',
    data() {
        return {
            message: '',  // 操作提示信息
            username: '', // 用户名
            password: '', // 密码
            contacts: [
                { icon: require('@/assets/images/QQ.png') },
                { icon: require('@/assets/images/WeChat.png') },
            ],
            showTooltip: false,
            currentQRCode: '',
            currentContactInfo: '',
        };
    },
    methods: {
        async login() {
            if (this.usernam == '' || this.password == '') {
                ElMessage({
                    showClose: true,
                    message: "请输入账号或密码",
                    type: "warning",
                });
            } else {
                await axios
                    .post('/api/user/login', {
                        username: this.username,
                        password: this.password,
                    })
                    .then((res) => {
                        console.log(res.data.message);
                        this.message = res.data.message;
                        if (this.message == '登录成功') {
                            console.log(res.data.data);
                            this.$store.dispatch('login', res.data.data);
                            this.$store.dispatch('updateDefaultActive', 'home');
                            this.$router.push('/');
                            ElMessage({
                                showClose: true,
                                message: this.message + '，欢迎' + "“" + res.data.data.nickname + "”" + '！',
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
                            message: "登录出错",
                            type: "error",
                        });
                    });
            }
        },
        forgotPassword() {
            ElMessage({
                showClose: true,
                message: "请联系管理重置密码",
                type: "warning",
            });
        },
        loginBysocialAccounts() {
            ElMessage({
                showClose: true,
                message: '该功能开发中……',
            });
        }
    },
    created() {
        this.$store.dispatch('updateDefaultActive', 'login');
    },
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 82vh;
}

.login-form {
    max-width: 350px;
    background: #F8F9FD;
    background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
    border-radius: 40px;
    padding: 25px 35px;
    border: 5px solid rgb(255, 255, 255);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
    margin: 20px;
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

.heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
}

.form {
    margin-top: 20px;
}

.form .input {
    width: 88%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    margin-top: 15px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
}

.form .input::-moz-placeholder {
    color: rgb(170, 170, 170);
}

.form .input::placeholder {
    color: rgb(170, 170, 170);
}

.form .input:focus {
    outline: none;
    border-inline: 2px solid #12B1D1;
}

.password-toggle {
    position: relative;
    left: -30px;
    cursor: pointer;
    user-select: none;
    font-size: 18px;
    color: grey;
}

.form .forgot-password {
    display: block;
    margin-top: 10px;
    margin-left: 10px;
    font-size: 11px;
    color: #0099ff;
    cursor: pointer;
}

.form .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
    color: white;
    padding-block: 15px;
    margin: 20px auto;
    border-radius: 20px;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
}

.form .login-button:hover {
    transform: scale(1.03);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
}

.form .login-button:active {
    transform: scale(0.95);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
}

.social-account-container {
    margin-top: 25px;
}

.social-account-container .title {
    display: block;
    text-align: center;
    font-size: 10px;
    color: rgb(170, 170, 170);
    cursor: pointer;
}

.social-account-container .social-accounts {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 6px;
}

.social-account-container .social-accounts .social-button {
    padding: 5px;
    border-radius: 50%;
    width: 40px;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 12px 10px -8px;
    transition: all 0.2s ease-in-out;
}

.social-account-container .social-accounts .social-button:hover {
    transform: scale(1.2);
}

.social-account-container .social-accounts .social-button:active {
    transform: scale(0.9);
}

.agreement {
    display: block;
    text-align: center;
    margin-top: 15px;
}

.agreement a {
    text-decoration: none;
    color: #0099ff;
    font-size: 9px;
}
</style>