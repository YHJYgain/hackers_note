<template>
    <el-container class="page-container">
        <el-header>
            <h1>发布博文</h1>
        </el-header>
        <el-main>
            <el-form class="article-form" ref="articleForm" :model="article" :rules="rules" label-width="120px"
                label-position="right" status-icon>
                <el-form-item label="标题" prop="title">
                    <el-input id="title" v-model="article.title"></el-input>
                </el-form-item>
                <el-form-item label="封面">
                    <div class="div-featuredImage" @click="openFileInput">
                        <el-image :src="article.featuredImage" title="点击更换博文封面" fit="cover">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon>
                                        <PictureFilled />
                                    </el-icon>
                                </div>
                            </template>
                        </el-image>
                    </div>
                    <input ref="fileInput" type="file" @change="handleAvatarChange" style="display: none;">
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input id="description" v-model="article.description"></el-input>
                </el-form-item>
                <el-form-item label="正文">
                    <v-md-editor id="content" v-model="article.content"></v-md-editor>
                </el-form-item>
                <el-form-item label="分类" prop="selectedCategories">
                    <el-select v-model="article.selectedCategories" placeholder="请至少选择一个分类" filterable allow-create
                        default-first-option multiple>
                        <el-option v-for="category in categories" :key="category.id" :label="category.name"
                            :value="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button id="publish" type="success" @click="publishArticle" plain><el-icon>
                            <Check />
                        </el-icon></el-button>
                    <el-button type="warning" @click="resetForm" plain><el-icon>
                            <Refresh />
                        </el-icon></el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";

export default {
    name: 'PublishArticle',
    data() {
        return {
            message: '',            // 操作提示信息
            article: {              // 博文发布表单数据
                title: '',
                featuredImage: '',
                description: '',
                content: '',
                selectedCategories: [],
            },
            rules: {                // 表单验证规则
                title: [{ required: true, message: "请输入标题", trigger: "blur" },
                { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }],
                description: [{ required: true, message: "请输入描述", trigger: "blur" },
                { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }],
                selectedCategories: [{ required: true, message: "请选择至少一个分类", trigger: "change" }],
            },
            categories: [],         // 所有分类
            defaultCategory: {      // 定义默认分类
                id: 0, name: '默认分类'
            },
        };
    },
    methods: {
        async fetchCategories() {
            await axios
                .get("/api/category/getAllCategories")
                .then((res) => {
                    console.log(res.data.data);
                    this.categories = res.data.data;
                    if (res.data.data.length > 0) {
                        this.categories = res.data.data;
                        // 设置默认选中的分类为后端返回的第一个分类
                        this.article.selectedCategories = [this.categories[0].id];
                    } else {
                        // 如果后端没有返回分类数据，则使用预定义的默认分类
                        this.categories.push(this.defaultCategory);
                        this.article.selectedCategories = [this.defaultCategory.id];
                    }
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "分类资源初始化失败",
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
                this.article.featuredImage = URL.createObjectURL(file);
                console.log(this.article.featuredImage);
            }
        },
        async createCategory(categoryName) {
            await axios
                .post("/api/category/createCategory", {
                    categoryName: categoryName
                })
                .then((res) => {
                    console.log(res.data.message);
                    this.message = res.data.message;
                    if (this.message == '分类创建成功') {
                        console.log(res.data.data);
                        const createdCategory = res.data.data;
                        if (this.categories == null) {
                            this.categories = [createdCategory];
                        } else {
                            this.categories.push(createdCategory);
                        }
                        ElMessage({
                            showClose: true,
                            message: this.message,
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
                        message: "分类创建出错",
                        type: "error",
                    });
                });
        },
        async publishArticle() {
            await this.$refs.articleForm.validate(async valid => { // 触发表单验证
                if (valid) {
                    const newCategories = this.article.selectedCategories.filter(id => !this.categories || !this.categories.find(category => category.id === id));
                    console.log(newCategories);
                    if (newCategories.length > 0) {
                        for (const newCategory of newCategories) {
                            await this.createCategory(newCategory);
                        }
                        /* 如果用户输入了新的分类，那么 selectedCategories 内容会自动存新分类的名称而不是 ID，因此需要转换 */
                        this.article.selectedCategories.forEach(selectedCategory => {
                            console.log(selectedCategory);
                            let foundCategory = null;
                            if (this.categories) {
                                foundCategory = this.categories.find(category => category.name === selectedCategory);
                            } else {
                                foundCategory = selectedCategory;
                            }
                            console.log(foundCategory);
                            if (foundCategory) {
                                this.article.selectedCategories = this.article.selectedCategories.map(item => {
                                    if (item === selectedCategory) {
                                        return foundCategory.id;
                                    }
                                    return item;
                                });
                            }

                        });
                    }
                    console.log(this.article.selectedCategories);
                    axios
                        .post("/api/article/publishArticle", {
                            title: this.article.title,
                            featuredImage: this.article.featuredImage,
                            description: this.article.description,
                            content: this.article.content,
                            categoryIds: this.article.selectedCategories,
                        })
                        .then((res) => {
                            console.log(res.data.message);
                            this.message = res.data.message;
                            if (this.message == '博文发布成功') {
                                console.log(res.data.data);
                                this.article = res.data.data;
                                this.$store.dispatch('updateDefaultActive', 'home');
                                this.$router.push('/');
                                ElMessage({
                                    showClose: true,
                                    message: this.message,
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
                                message: "博文发布出错",
                                type: "error",
                            });
                        });
                } else {
                    ElMessage({
                        showClose: true,
                        message: "表单验证出错",
                        type: "error",
                    });
                }
            });
        },
        resetForm() {
            this.$refs.articleForm.resetFields();
            this.article = {
                title: '',
                featuredImage: '',
                description: '',
                content: '',
                selectedCategories: [],
            };
            ElMessage({
                showClose: true,
                message: "表单已重置",
                type: "success",
            });
        },
    },
    created() {
        this.$store.dispatch('updateDefaultActive', 'publishArticle');
        if (!this.$store.state.user) {
            this.$store.dispatch('updateDefaultActive', 'login');
            this.$router.push('/login');
            ElMessage({
                showClose: true,
                message: "请登录",
                type: "warning",
            });
        } else {
            this.fetchCategories();
        }
    },
}
</script>

<style scoped>
.page-container {
    height: 88vh;
    overflow: auto;
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

.article-form {
    margin-left: 6%;
    margin-right: 13%;
}

.article-form .el-image {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    transform-origin: center;
    transition: transform 0.3s;
}

.article-form .el-image:hover {
    transform: scale(1.1);
}

.article-form .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
    transition: transform 0.3s;
}

.article-form .image-slot:hover {
    transform: scale(1.05);
}
</style>