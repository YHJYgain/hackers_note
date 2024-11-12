<template>
    <el-container>
        <el-header>
            <div class="input-container">
                <div class="centered-content">
                    <input type="text" id="searchArticle" name="text" class="input" placeholder="关键词查询博文" v-model="searchQuery"
                        @keyup.enter="searchArticles">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" class="icon">
                        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                        <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
                        <g id="SVGRepo_iconCarrier">
                            <rect fill="white" height="24" width="24"></rect>
                            <path fill=""
                                d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z"
                                clip-rule="evenodd" fill-rule="evenodd"></path>
                        </g>
                    </svg>
                </div>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-tabs class="demo-tabs" tab-position="left" @tab-click="handleTabClick"
                    v-model="activeTab">
                    <el-tab-pane v-for="category in categories" :label="category.name" :name="category.name"
                        :key="category.id"></el-tab-pane>
                </el-tabs>
            </el-aside>
            <el-main :class="{ 'animate': animate }">
                <div class="article-list" v-if="articles && articles.length > 0">
                    <div class="article-item" v-for="article in articles" :key="article.id">
                        <ArticleItem :article="article" />
                    </div>
                </div>
                <el-empty class="article-empty" description="No Data" :image-size="220" v-else />
            </el-main>
        </el-container>
        <el-pagination class="pagination" background v-model:current-page="currentPage" v-model:page-size="pageSize"
            layout="prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange" />
    </el-container>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
import ArticleItem from '../components/ArticleItem.vue'

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Home',
    components: {
        ArticleItem,
    },
    data() {
        return {
            activeTab: '',      // 默认不选中任何分类标签
            animate: false,     // 添加 animate 状态
            searchQuery: '',    // 用户输入的查询关键词
            currentPage: 1,     // 当前页数
            pageSize: 3,        // 一页的博文数量
            total: 0,           // 博文总数
            articles: [],       // 博文
            categories: [],     // 分类
            categoryId: null,   // 分类 ID
        };
    },
    methods: {
        async fetchArticles() {
            this.animate = false;
            await axios
                .post("/api/article/getArticlesByPage", {
                    page: this.currentPage - 1,
                    size: this.pageSize,
                })
                .then((res) => {
                    console.log(res.data.data.content);
                    console.log(res.data.data.totalElements);
                    this.articles = res.data.data.content;
                    this.total = res.data.data.totalElements;
                    this.$nextTick(() => {
                        this.animate = true;
                    });
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "首页博文资源初始化失败",
                        type: "error",
                    });
                });
        },
        async fetchCategories() {
            await axios
                .get("/api/category/getAllCategories")
                .then((res) => {
                    console.log(res.data.data);
                    this.categories = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "首页分类资源初始化失败",
                        type: "error",
                    });
                });
        },
        async searchArticles() {
            this.animate = false;
            if (this.searchQuery !== '') {
                await axios
                    .post("/api/article/searchArticles", {
                        query: this.searchQuery
                    })
                    .then((res) => {
                        console.log(res.data.data);
                        console.log(res.data.data.length);
                        this.articles = res.data.data;
                        this.total = res.data.data.length;
                        this.$nextTick(() => {
                            this.animate = true;
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        ElMessage({
                            showClose: true,
                            message: "搜索出错",
                            type: "error",
                        });
                    });
            } else {
                this.articles = [];
                this.total = 0;
                ElMessage({
                    showClose: true,
                    message: "请输入关键词进行查询",
                    type: "warning",
                });
            }
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            console.log(newPage);
            this.fetchArticles();
        },
        async handleTabClick(tab) {
            this.activeTab = tab.name; // 更新当前活动的标签名
            this.animate = false;
            this.categoryId = this.categories.find(category => category.name === tab.props.name)?.id; // 获取对应分类 ID
            await axios
                .post("/api/article/getArticlesByCategoryId", {
                    categoryId: this.categoryId
                })
                .then((res) => {
                    console.log(res.data.data);
                    console.log(res.data.data.length);
                    if (res.data.data.length>=3) {
                        this.articles = [res.data.data[0], res.data.data[1], res.data.data[2]];
                    } else {
                        this.articles = res.data.data;
                    }
                    this.total = res.data.data.length;
                    this.$nextTick(() => {
                        this.animate = true;
                    });
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "获取分类下的博文失败",
                        type: "error",
                    });
                });
        },
    },
    created() {
        this.$store.dispatch('updateDefaultActive', 'home');
        this.fetchArticles();
        this.fetchCategories();
    },
}
</script>

<style scoped>
.input-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1.5%;
}

.centered-content {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.input {
    width: 10px;
    height: 10px;
    border-radius: 20px;
    border: none;
    outline: none;
    padding: 18px 16px;
    background-color: transparent;
    cursor: pointer;
    transition: all .5s ease-in-out;
}

.input::placeholder {
    color: transparent;
}

.input:focus::placeholder {
    color: rgb(131, 128, 128);
}

.input:focus,
.input:not(:placeholder-shown) {
    background-color: #fff;
    border: 1px solid rgb(91, 107, 255);
    width: 290px;
    cursor: text;
    padding: 18px 16px 18px 45px;
}

.icon {
    position: absolute;
    left: 0;
    height: 45px;
    width: 45px;
    background-color: #fff;
    border-radius: 99px;
    z-index: -1;
    fill: rgb(91, 107, 255);
    border: 1px solid rgb(91, 107, 255);
}

.input:focus+.icon,
.input:not(:placeholder-shown)+.icon {
    z-index: 0;
    background-color: transparent;
    border: none;
}

.article-list {
    margin-top: 1%;
}

.article-empty {
    margin-right: 14%;
}

.animate {
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

.demo-tabs {
    padding: 20px;
    margin-top: 8%;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 10%;
    width: 100%;
}
</style>