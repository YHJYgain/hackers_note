<template>
    <el-container class="article-container">
        <el-header>
            <h1 class="article-title">{{ article.title }}</h1>
        </el-header>
        <el-main class="main-container">
            <div class="article-top">
                <p class="article-author">作者：
                    <el-tooltip content="访问博主主页" placement="top">
                        <el-button id="userInfo" class="userInfo-link" type="danger" @click="toUserInfo" link>
                            {{ author.nickname }}
                        </el-button>
                    </el-tooltip>
                </p>
                <el-divider direction="vertical"></el-divider>
                <span class="article-publishDate">发布时间：{{ formatDate(article.publishDate) }}</span>
                <el-divider direction="vertical"></el-divider>
                <span class="article-updateDate">更新时间：{{ formatDate(article.updateDate) }}</span>
            </div>
            <div class="article-actions">
                <el-tooltip content="点赞" placement="top">
                    <el-button class="action-button" type="primary" @click="handleLike" plain>
                        <el-icon>
                            <Pointer />
                        </el-icon> {{ likesCount }}
                    </el-button>
                </el-tooltip>
                <el-tooltip content="收藏" placement="top">
                    <el-button class="action-button" type="success" @click="handleCollect" plain>
                        <el-icon>
                            <Star />
                        </el-icon> {{ collectsCount }}
                    </el-button>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top">
                    <el-button id="editArticle" v-if="this.$store.state.user && this.$store.state.user.id == author.id" class="action-button"
                        type="warning" icon="Edit" @click="editArticle" circle>
                    </el-button>
                </el-tooltip>
            </div>
            <div class="article-content-border">
                <div class="article-content" v-html="parsedContent"></div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
import MarkdownIt from 'markdown-it';

export default {
    name: "ArticleDetail",
    data() {
        return {
            message: '',            // 操作提示信息
            likesCount: 0,          // 点赞数量（默认为0）
            collectsCount: 0,       // 收藏数量（默认为0）
            article: {},            // 存储博文数据
            author: {},             // 博文作者
            parsedContent: '',      // 存储由 Markdown 格式转换为 html 格式的内容
        };
    },
    methods: {
        async fetchArticleDetail() {
            await axios
                .post("/api/article/getArticleDetail", {
                    articleId: this.$route.params.id
                })
                .then((res) => {
                    console.log(res.data.data);
                    this.article = res.data.data;
                    this.author = this.article.author;
                    const md = new MarkdownIt();
                    this.parsedContent = md.render(this.article.content);
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "博文详情资源初始化失败",
                        type: "error",
                    });
                });
        },
        async fetchLikes() {
            await axios
                .post('/api/article/getLikedUsersById', {
                    articleId: this.$route.params.id
                })
                .then((res) => {
                    console.log(res.data.message);
                    console.log(res.data.data.length);
                    this.message = res.data.message;
                    this.likesCount = res.data.data.length;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "初始化点赞资源失败",
                        type: "error",
                    });
                });
        },
        async fetchCollectes() {
            await axios
                .post('/api/article/getCollectedUsersById', {
                    articleId: this.$route.params.id
                })
                .then((res) => {
                    console.log(res.data.message);
                    console.log(res.data.data.length);
                    this.message = res.data.message
                    this.collectsCount = res.data.data.length;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "初始化收藏资源失败",
                        type: "error",
                    });
                });
        },
        formatDate(dateTime) {
            const date = new Date(dateTime);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const seconds = date.getSeconds().toString().padStart(2, "0");
            return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
        },
        async handleLike() {
            await axios
                .put('/api/article/likeArticle', {
                    articleId: this.article.id
                })
                .then((res) => {
                    console.log(res.data.message);
                    this.message = res.data.message
                    if (this.message == '点赞成功' || this.message == '取消点赞成功') {
                        console.log(res.data.data.length);
                        this.likesCount = res.data.data.length;
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
                        if (this.$store.state.user == null) {
                            this.$store.dispatch('updateDefaultActive', 'login');
                            this.$router.push('/login');
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "点赞出错",
                        type: "error",
                    });
                });
        },
        async handleCollect() {
            await axios
                .put('/api/article/collectArticle', {
                    articleId: this.article.id
                })
                .then((res) => {
                    console.log(res.data.message);
                    this.message = res.data.message
                    if (this.message == '收藏成功' || this.message == '取消收藏成功') {
                        console.log(res.data.data.length);
                        this.collectsCount = res.data.data.length;
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
                        if (this.$store.state.user == null) {
                            this.$store.dispatch('updateDefaultActive', 'login');
                            this.$router.push('/login');
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "收藏出错",
                        type: "error",
                    });
                });
        },
        toUserInfo() {
            if (this.$store.state.user !== null) {
                if (this.author.id !== this.$store.state.user.id) {
                    this.$router.push('/userInfo/' + this.author.id);
                } else {
                    this.$store.dispatch('updateDefaultActive', 'user');
                    this.$router.push('/user');
                }
            } else {
                this.$router.push('/userInfo/' + this.author.id);
            }
        },
        editArticle() {
            this.$router.push('/editArticle/' + this.article.id);
        },
    },
    created() {
        this.fetchArticleDetail();
        this.fetchLikes();
        this.fetchCollectes();
    },
}
</script>

<style scoped>
.article-container {
    padding: 20px;
    display: flex;
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

.main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.article-title {
    font-size: 24px;
    font-weight: bold;
}

.article-top {
    display: flex;
    align-items: center;
}

.article-author,
.article-publishDate,
.article-updateDate {
    color: #999;
    font-size: small;
}

.action-button {
    margin-bottom: 5px;
}

.article-content-border {
    border: 2px solid #e1e1e1;
    padding: 10px;
    overflow-y: auto;
    width: 1000px;
    height: 400px;
}

.article-content {
    color: #333;
    text-align: left;
}
</style>