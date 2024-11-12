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
    </div>
</template>
  
<script>
export default {
    name: "CollectedArticleItem",
    props: {
        article: {}, // 从父组件传递的博文对象
    },
    data() {
        return {
            message: '',                  // 操作提示信息
        };
    },
    methods: {
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
</style>  