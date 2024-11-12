<template>
    <div class="article-container">
        <el-image :src="article.featuredImage" :title="article.title" :zoom-rate="1.2"
            :preview-src-list="[article.featuredImage]" fit="cover">
            <template #error>
                <div class="image-slot">
                    <el-icon>
                        <PictureFilled />
                    </el-icon>
                </div>
            </template>
        </el-image>
        <div class="article-detail">
            <h2 class="article-title">
                <router-link :to="'/article/' + article.id" class="article-title-link">{{ article.title }}</router-link>
            </h2>
            <p class="article-description">{{ article.description }}</p>
            <div class="article-footer">
                <p class="article-author">作者：{{ article.author.nickname }}</p>
                <span class="article-date">{{ formatDate(article.updateDate) }}</span>
            </div>
        </div>
        <div class="article-actions">
            <el-button id="like" class="action-button" type="primary" @click="handleLike" plain>
                <el-icon><Pointer /></el-icon> {{ likesCount }}
            </el-button>
            <el-button id="collect" class="action-button" type="success" @click="handleCollect" plain>
                <el-icon><Star /></el-icon> {{ collectsCount }}
            </el-button>
        </div>
    </div>
</template>
  
<script>
import axios from "axios";
import { ElMessage } from "element-plus";

export default {
    name: "ArticleItem",
    props: {
        article: {}, // 从父组件传递的博文对象
    },
    data() {
        return {
            message: '',                  // 操作提示信息
            likesCount: 0,                // 点赞数量（默认为0）
            collectsCount: 0,             // 收藏数量（默认为0）
        };
    },
    methods: {
        async fetchLikes() {
            await axios
                .post('/api/article/getLikedUsersById', {
                    articleId: this.article.id
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
                    articleId: this.article.id
                })
                .then((res) => {
                    console.log(res.data.message);
                    console.log(res.data.data.length);
                    this.message = res.data.message;
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
    },
    created() {
        this.fetchLikes();
        this.fetchCollectes();
    },
};
</script>
  
<style scoped>
.article-container {
    display: flex;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    margin-bottom: 20px;
    overflow: hidden;
}

.article-container .el-image {
    width: 128px;
    height: 128px;
    object-fit: cover;
    margin: 4px;
    border-radius: 8px;
}

.article-container .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}

.article-container .image-slot .el-icon {
    font-size: 30px;
}

.article-detail {
    margin-top: 8px;
    margin-left: 6px;
    text-align: left;
}

.article-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.article-title-link {
    position: relative;
    color: #007bff;
    text-decoration: none;
    transition: color 0.2s;
}

.article-title-link:hover {
    color: #0056b3;
    text-decoration: underline;
}

.article-description {
    font-size: 14px;
    margin-bottom: 5px;
    margin-top: 10px;
    color: #555;
}

.article-footer {
    display: flex;
    align-items: center;
}

.article-author {
    font-size: 12px;
    color: #999;
    margin-right: 20px;
}

.article-date {
    font-size: 12px;
    color: #999;
}

.article-actions {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 8px;
}

.article-container {
    position: relative;
    display: flex;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    margin-bottom: 20px;
    overflow: hidden;
}

.article-actions {
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
}

.action-button {
    font-size: 13px;
    margin-left: 8px;
}
</style>  