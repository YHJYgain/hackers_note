<template>
    <el-container>
        <el-header>
            <h1>个人中心</h1>
        </el-header>
        <el-main>
            <div class="user-profile">
                <div class="user-info">
                    <el-avatar class="avatar" title="头像" :size="100" :fit="cover">
                        <div class="avatar-image-container">
                            <img class="avatar-image" v-if="user.avatar" :src="user.avatar" alt="Avatar" />
                            <div v-else class="default-avatar">
                                <el-icon class="avatar-icon">
                                    <Avatar />
                                </el-icon>
                            </div>
                        </div>
                    </el-avatar>
                    <p>{{ user.nickname }}</p>
                    <div class="user-top">
                        <el-button type="info" link disabled><el-icon>
                                <Clock />
                            </el-icon>加入时间： {{ formatDate(user.createDate) }}</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="info" link disabled><el-icon>
                                <Management />
                            </el-icon>原创博文 {{ acticlesCount }}</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip content="查看粉丝列表" placement="top">
                            <el-button type="warning" @click="openFansList" link>
                                <el-icon>
                                    <UserFilled />
                                </el-icon>粉丝 {{ followUserCount }}
                            </el-button>
                        </el-tooltip>
                        <el-drawer v-model="fansList" title="粉丝列表" direction="rtl" size="30%" @close="closeFansList">
                            <template #default>
                                <div class="follows-list" v-if="follows && follows.length > 0">
                                    <div class="follows-item" v-for="follow in follows" :key="follow.id">
                                        <FollowItem :follow="follow" />
                                    </div>
                                </div>
                                <el-empty v-else class="follow-empty" description="No Data" :image-size="220" />
                            </template>
                        </el-drawer>
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip content="查看收藏博文列表" placement="top">
                            <el-button type="success" @click="openFavorites" link>
                                <el-icon>
                                    <Collection />
                                </el-icon>收藏夹
                            </el-button>
                        </el-tooltip>
                        <el-drawer v-model="favorites" title="收藏夹" direction="rtl" size="30%" @close="closeFavorites">
                            <template #default>
                                <div class="collectedArticle-list" v-if="collectedArticles && collectedArticles.length > 0">
                                    <div class="collectedArticle-item" v-for="collectedArticle in collectedArticles"
                                        :key="collectedArticle.id">
                                        <CollectedArticleItem :article="collectedArticle" />
                                    </div>
                                </div>
                                <el-empty v-else class="article-empty" description="No Data" :image-size="220" />
                            </template>
                        </el-drawer>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="primary" @click="toEditUser" link>
                            <el-icon>
                                <Edit />
                            </el-icon>编辑信息
                        </el-button>
                    </div>
                </div>
                <div class="article-list" v-if="sortedArticles && sortedArticles.length > 0">
                    <el-timeline>
                        <el-timeline-item class="article-item" v-for="article in sortedArticles" :key="article.id"
                            placement="top" center>
                            <ArticleItem :article="article" />
                        </el-timeline-item>
                    </el-timeline>
                </div>
                <el-empty class="article-empty" description="No Data" :image-size="220" v-else />
            </div>
        </el-main>
    </el-container>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
import ArticleItem from '../components/ArticleItem.vue'
import FollowItem from '../components/FollowItem.vue'
import CollectedArticleItem from '../components/CollectedArticleItem.vue'

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'User',
    components: {
        ArticleItem,
        FollowItem,
        CollectedArticleItem,
    },
    data() {
        return {
            user: this.$store.state.user, // 当前用户
            articles: [],                 // 用户发布的博文
            follows: [],                  // 用户粉丝
            collectedArticles: [],        // 用户收藏的博文
            favorites: false,             // 是否打开收藏夹
            fansList: false,              // 是否打开粉丝列表
            acticlesCount: 0,             // 用户发布的博文数
            followUserCount: 0,           // 粉丝数量
        };
    },
    computed: {
        sortedArticles() {
            /* 使用 JavaScript 的 sort 方法对文章按更新时间进行排序 */
            return this.articles.slice().sort((a, b) => {
                const dateA = new Date(a.updateDate);
                const dateB = new Date(b.updateDate);
                return dateB - dateA; // 根据更新时间降序排序
            });
        },
    },
    methods: {
        async fetchFollowUserCount() {
            await axios
                .post("/api/user/getFollowersCountForUserId", {
                    userId: this.user.id
                })
                .then((res) => {
                    console.log(res.data.data);
                    this.followUserCount = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "用户粉丝数量资源初始化失败",
                        type: "error",
                    });
                });
        },
        async fetchUserArticles() {
            await axios
                .post("/api/article/getArticlesByUserId", {
                    userId: this.user.id
                })
                .then((res) => {
                    console.log(res.data.data);
                    console.log(res.data.data.length);
                    this.articles = res.data.data;
                    this.acticlesCount = res.data.data.length;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "用户发布的博文资源初始化失败",
                        type: "error",
                    });
                });
        },
        formatDate(dateTime) {
            const date = new Date(dateTime);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            return `${year}年${month}月${day}日`;
        },
        async fetchFollows() {
            await axios
                .post("/api/user/getFollowersForUserId", {
                    userId: this.user.id
                })
                .then((res) => {
                    console.log(res.data.data);
                    this.follows = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "用户粉丝列表资源初始化失败",
                        type: "error",
                    });
                });
        },
        async fetchCollectedArticles() {
            await axios
                .post("/api/article/getCollectedArticlesByUserId", {
                    userId: this.user.id
                })
                .then((res) => {
                    console.log(res.data.data);
                    this.collectedArticles = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "用户收藏的博文资源初始化失败",
                        type: "error",
                    });
                });
        },
        openFansList() {
            this.fetchFollows();
            this.fansList = true;
        },
        closeFansList() {
            this.fansList = false;
        },
        toEditUser() {
            this.$router.push('/editUser');
        },
        openFavorites() {
            this.fetchCollectedArticles();
            this.favorites = true;
        },
        closeFavorites() {
            this.favorites = false;
        },
    },
    watch: {
        '$store.state.user': {
            immediate: true,
            handler(newValue) {
                this.user = newValue;
            },
        },
    },
    created() {
        this.$store.dispatch('updateDefaultActive', 'user');
        this.fetchFollowUserCount();
        this.fetchUserArticles();
    },
}
</script>

<style scoped>
.user-info {
    display: flex;
    flex-direction: column;
    padding: 20px;
    position: relative;
}

.avatar {
    margin: 0 auto;
    width: 128px;
    height: 128px;
}

.avatar-image-container {
    width: 128px;
    height: 128px;
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
    width: 128px;
    height: 128px;
    transition: transform 0.3s;
}

.default-avatar:hover {
    transform: scale(1.1);
}

.user-top .el-button {
    font-size: 14px;
}

.user-top> :nth-child(-n+4) {
    color: #999;
}

.article-list {
    margin-left: 8%;
    margin-right: 8%;
    animation: scale-in-center .5s cubic-bezier(.25, .46, .45, .94) both
}

@keyframes scale-in-center {
    0% {
        transform: scale(0.8);
        opacity: 1
    }

    100% {
        transform: scale(1);
        opacity: 1
    }
}
</style>