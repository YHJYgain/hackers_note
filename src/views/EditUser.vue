<template>
    <el-container class="page-container">
        <el-header>
            <h1>个人设置</h1>
        </el-header>
        <el-main>
            <el-form class="user-form" ref="userForm" :model="user" :rules="userRules" label-position="top"
                label-width="auto">
                <el-form-item label="头像">
                    <div class="div-avatar" @click="openFileInput">
                        <el-avatar class="avatar" title="点击更换头像" :size="100" :fit="cover">
                            <div class="avatar-image-container">
                                <img class="avatar-image" v-if="user.avatar" :src="user.avatar" alt="Avatar" />
                                <div v-else class="default-avatar">
                                    <el-icon class="avatar-icon">
                                        <Avatar />
                                    </el-icon>
                                </div>
                            </div>
                        </el-avatar>
                        <input ref="fileInput" type="file" @change="handleAvatarChange" style="display: none;">
                    </div>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="user.nickname"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="saveUser" plain><el-icon>
                            <Check />
                        </el-icon></el-button>
                    <el-button type="warning" @click="resetForm" plain><el-icon>
                            <Refresh />
                        </el-icon></el-button>
                    <el-button type="danger" @click="showChangePasswordDialog" plain>修改密码</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
    <el-dialog title="修改密码" v-model="passwordDialogVisible" width="40%" destroy-on-close draggable>
        <el-form class="passwordForm" ref="passwordForm" :model="password" :rules="passwordRules" label-position="top"
            label-width="auto" @keyup.enter="changePassword">
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input :type="passwordFieldType" v-model="password.oldPassword">
                    <template #suffix>
                        <el-icon class="password-toggle" @click="togglePasswordVisibility">
                            <template v-if="passwordVisible">
                                <View />
                            </template>
                            <template v-else>
                                <Hide />
                            </template>
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input :type="passwordFieldType" v-model="password.newPassword">
                    <template #suffix>
                        <el-icon class="password-toggle" @click="togglePasswordVisibility">
                            <template v-if="passwordVisible">
                                <View />
                            </template>
                            <template v-else>
                                <Hide />
                            </template>
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="action-button">
                <el-button type="success" @click="changePassword" plain>确认</el-button>
                <el-button type="warning" @click="this.passwordDialogVisible = false" plain>取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";

export default {
    name: "EditUser",
    data() {
        return {
            passwordVisible: false,       // 控制密码的显示/隐藏
            passwordDialogVisible: false, // 打开/关闭“修改密码”对话框
            message: '',                  // 操作提示信息
            user: {},                     // 当前用户
            userRules: {                  // 用户表单验证规则
                nickname: [{ required: true, message: "请输入昵称", trigger: "blur" },
                { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'change' }],
            },
            password: {                   // 密码
                oldPassword: '',
                newPassword: '',
            },
            passwordRules: {               // 修改密码表达验证规则
                oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" },
                { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'change' },
                { validator: this.validateOldPassword, trigger: "change" },],
                newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" },
                { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'change' },
                { validator: this.validateNewPassword, trigger: "change" },],
            },
        }
    },
    computed: {
        passwordFieldType() {
            return this.passwordVisible ? 'text' : 'password';
        }
    },
    methods: {
        async fetchUser() {
            await axios
                .get("/api/user/getLoggedUserInfo")
                .then((res) => {
                    console.log(res.data.data);
                    this.user = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "用户资源初始化失败",
                        type: "error",
                    });
                });
        },
        openFileInput() {
            this.$refs.fileInput.click();
        },
        handleAvatarChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.user.avatar = URL.createObjectURL(file);
                console.log(this.user.avatar);
            }
        },
        async saveUser() {
            await this.$refs.userForm.validate(async valid => {
                if (valid) {
                    await axios
                        .put("/api/user/updateUser", {
                            avatar: this.user.avatar,
                            nickname: this.user.nickname
                        })
                        .then((res) => {
                            console.log(res.data.data);
                            console.log(res.data.message);
                            this.message = res.data.message;
                            this.user = res.data.data;
                            this.$store.state.user = this.user;
                            this.$store.dispatch('updateDefaultActive', 'user');
                            this.$router.push('/user');
                            ElMessage({
                                showClose: true,
                                message: this.message,
                                type: "success",
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            ElMessage({
                                showClose: true,
                                message: "用户更新出错",
                                type: "error",
                            });
                        });
                } else {
                    ElMessage({
                        showClose: true,
                        message: "用户表单验证出错",
                        type: "error",
                    });
                }
            })
        },
        resetForm() {
            this.$refs.userForm.resetFields();
            this.user = this.$store.state.user;
            ElMessage({
                showClose: true,
                message: "表单已重置",
                type: "success",
            });
        },
        showChangePasswordDialog() {
            this.passwordDialogVisible = true;
            this.passwordVisible = false;
        },
        togglePasswordVisibility() {
            this.passwordVisible = !this.passwordVisible;
        },
        validateOldPassword(rule, value, callback) {
            axios
                .post("/api/user/validatePassword", {
                    password: value
                })
                .then((res) => {
                    console.log(res.data.data);
                    console.log(res.data.message);
                    this.message = res.data.message;
                    let valid = false;
                    valid = res.data.data;
                    if (valid) {
                        callback();
                    } else {
                        callback(new Error("旧密码不正确"));
                    }
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "验证旧密码出错",
                        type: "error",
                    });
                });
        },
        validateNewPassword(rule, value, callback) {
            if (value === this.password.oldPassword) {
                callback(new Error("新密码与旧密码相同"));
            } else {
                callback();
            }
        },
        async changePassword() {
            await this.$refs.passwordForm.validate(async valid => {
                if (valid) {
                    await axios
                        .put("/api/user/changePassword", {
                            oldPassword: this.password.oldPassword,
                            newPassword: this.password.newPassword
                        })
                        .then((res) => {
                            console.log(res.data.data);
                            console.log(res.data.message);
                            this.message = res.data.message;
                            this.user = res.data.data;
                            ElMessage({
                                showClose: true,
                                message: this.message + '，请重新登录',
                                type: "success",
                            });
                            axios
                                .get('/api/user/logout')
                                .then((res) => {
                                    if (res.data.message == '退出成功') {
                                        console.log(res.data.data);
                                        this.$store.dispatch('logout');
                                        this.$store.dispatch('updateDefaultActive', 'login');
                                        this.$router.push('/login');
                                    } else {
                                        this.$store.dispatch('updateDefaultActive', 'user');
                                        this.$router.push('/user');
                                        ElMessage({
                                            showClose: true,
                                            message: res.data.message,
                                            type: "warning",
                                        });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    this.$store.dispatch('updateDefaultActive', 'user');
                                    this.$router.push('/user');
                                    ElMessage({
                                        showClose: true,
                                        message: "退出出错",
                                        type: "error",
                                    });
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            ElMessage({
                                showClose: true,
                                message: "修改密码出错",
                                type: "error",
                            });
                        });
                } else {
                    ElMessage({
                        showClose: true,
                        message: "密码表单验证出错",
                        type: "error",
                    });
                }
            })
        },
    },
    created() {
        this.fetchUser();
    },
}
</script>

<style scoped>
.page-container {
    animation: slide-in-elliptic-top-fwd .7s cubic-bezier(.25, .46, .45, .94) both
}

@keyframes slide-in-elliptic-top-fwd {
    0% {
        transform: translateY(-600px) rotateX(-30deg) scale(0.7);
        transform-origin: 50% 100%;
        opacity: 0
    }

    100% {
        transform: translateY(0) rotateX(0) scale(1);
        transform-origin: 50% 1400px;
        opacity: 1
    }
}

.user-form {
    margin-left: 35%;
    margin-right: 35%;
}

.avatar-image-container {
    width: 120px;
    height: 120px;
    overflow: hidden;
    border-radius: 50%;
    margin: 0 auto;
}

.avatar {
    margin: 0 auto;
    cursor: pointer;
    width: 120px;
    height: 120px;
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
    width: 120px;
    height: 120px;
    transition: transform 0.3s;
}

.default-avatar:hover {
    transform: scale(1.1);
}

.passwordForm {
    margin-left: 8%;
    margin-right: 8%;
}

.password-toggle {
    cursor: pointer;
}</style>