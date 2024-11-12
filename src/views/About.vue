<template>
    <el-container class="about-container">
        <el-aside class="about-aside">
            <div class="card-client">
                <el-avatar class="avatar" :size="100" :fit="cover">
                    <div class="avatar-image-container">
                        <img class="avatar-image" :src="authorAvatar" alt="Avatar" />
                    </div>
                </el-avatar>
                <p class="name-client">
                    汪忠毅<span>The developer of Hackers Note</span>
                </p>
                <div class="social-media">
                    <el-image v-for="(contact, index) in contacts" :key="index" :src="contact.icon"
                        style="width: 25px; height: 25px" :fit="cover" @mouseenter="showQRCode(contact)"
                        @mouseleave="hideQRCode()">
                    </el-image>
                    <div v-if="showTooltip" class="tooltip">
                        <img :src="currentQRCode" alt="二维码">
                        <p>{{ currentContactInfo }}</p>
                    </div>
                </div>
            </div>
            <div class="skill-card">
                <div class="header">Languages</div>
                <div class="body">
                    <div class="skill">
                        <div class="skill-name">Vue</div>
                        <div class="skill-level">
                            <div class="skill-percent" style="width: 25.6%"></div>
                        </div>
                        <div class="skill-percent-number">25.6%</div>
                    </div>
                    <div class="skill">
                        <div class="skill-name">CSS</div>
                        <div class="skill-level">
                            <div class="skill-percent" style="width: 20.4%"></div>
                        </div>
                        <div class="skill-percent-number">20.4%</div>
                    </div>
                    <div class="skill">
                        <div class="skill-name">JavaScript</div>
                        <div class="skill-level">
                            <div class="skill-percent" style="width: 10.2%"></div>
                        </div>
                        <div class="skill-percent-number">10.2%</div>
                    </div>
                    <div class="skill">
                        <div class="skill-name">Java</div>
                        <div class="skill-level">
                            <div class="skill-percent" style="width: 43.8%"></div>
                        </div>
                        <div class="skill-percent-number">43.8%</div>
                    </div>
                </div>
            </div>
        </el-aside>
        <el-main class="about-main">
            <div class="main-content">
                <h1>欢迎来到 Hackers Note！</h1>
                <p>Hackers Note 是一个充满创意和技术的个人博客网站。我们致力于分享有趣的技术见解、创意灵感和实用的教程，以及探讨各种有趣的话题。</p>
                <p>无论你是技术爱好者、创意探索者还是寻找灵感的人，我们都欢迎你加入我们的社区。</p>
                <el-row class="about-statistic" :gutter="16" style="width: 60%; margin: 0 auto;">
                    <el-col :span="6" class="col-centered">
                        <div class="statistic-card">
                            <el-statistic :value="usersCount">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center">
                                        <span>用户总数</span>
                                        <el-tooltip effect="dark" content="已注册用户数量" placement="top">
                                            <el-icon style="margin-left: 4px" :size="12">
                                                <Warning />
                                            </el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </el-statistic>
                        </div>
                    </el-col>
                    <el-col :span="6" class="col-centered">
                        <div class="statistic-card">
                            <el-statistic :value="articlesCount">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center">
                                        <span>博文总数</span>
                                        <el-tooltip effect="dark" content="已发布博文数量" placement="top">
                                            <el-icon style="margin-left: 4px" :size="12">
                                                <Warning />
                                            </el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </el-statistic>
                        </div>
                    </el-col>
                    <el-col :span="6" class="col-centered">
                        <div class="statistic-card">
                            <el-statistic :value="likesCount">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center">
                                        <span>点赞总数</span>
                                        <el-tooltip effect="dark" content="所有博文点赞数量总和" placement="top">
                                            <el-icon style="margin-left: 4px" :size="12">
                                                <Warning />
                                            </el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </el-statistic>
                        </div>
                    </el-col>
                    <el-col :span="6" class="col-centered">
                        <div class="statistic-card">
                            <el-statistic :value="collectsCount">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center">
                                        <span>收藏总数</span>
                                        <el-tooltip effect="dark" content="所有博文收藏数量总和" placement="top">
                                            <el-icon style="margin-left: 4px" :size="12">
                                                <Warning />
                                            </el-icon>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </el-statistic>
                        </div>
                    </el-col>
                </el-row>
                <el-collapse class="about-collapse">
                    <el-collapse-item name="mission" title="我们的使命">
                        <p>我们的使命是在这个数字化时代连接创意和技术，通过博客文章、教程和讨论，让人们发现更多的可能性。我们相信每个人都有独特的见解和技能，我们希望通过 Hackers Note
                            为大家提供一个平台，分享知识、创意和经验。
                        </p>
                    </el-collapse-item>
                    <el-collapse-item name="domain" title="内容领域">
                        <ul>
                            <li>编程和开发</li>
                            <li>设计和创意</li>
                            <li>科技趋势和前沿</li>
                            <li>实用教程和指南</li>
                            <li>创业和职业发展</li>
                            <li>人工智能和数据科学</li>
                            <li>数字艺术和媒体创作</li>
                            <li>生活方式和心灵成长</li>
                            <li>…………</li>
                        </ul>
                    </el-collapse-item>
                    <el-collapse-item name="connection" title="联系我们">
                        <p>如果你有任何问题、建议或合作意向，欢迎随时联系开发者：</p>
                        <ul>
                            <li>邮箱：1583952973@qq.com</li>
                            <li>手机：13871941390</li>
                            <li>QQ：1583952973</li>
                            <li>微信：wzylb201911</li>
                        </ul>
                    </el-collapse-item>
                    <el-collapse-item name="join" title="加入我们">
                        <p>无论你是技术大牛、创意达人，还是初学者，Hackers Note 都欢迎你加入我们的行列。一起分享、学习、成长，让创意和技术在这里发光发热！</p>
                        <p>感谢你的支持和参与，让我们一起创造更美好的数字世界！</p>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'About',
    data() {
        return {
            message: '',                                      // 操作提示信息
            authorAvatar: require('@/assets/images/WZY.jpg'), // 开发者头像
            contacts: [                                       // 开发者联系方式
                { icon: require('@/assets/images/Phone.png'), info: '手机号: 13871941390', qrCode: require('@/assets/images/Phone-code.jpg') },
                { icon: require('@/assets/images/QQ.png'), info: 'QQ: 1583952973', qrCode: require('@/assets/images/QQ-code.jpg') },
                { icon: require('@/assets/images/WeChat.png'), info: '微信: wzylb201911', qrCode: require('@/assets/images/WeChat-code.png') }
            ],
            showTooltip: false,                               // 是否展示联系方式二维码
            currentQRCode: '',                                // 鼠标悬浮选中的二维码
            currentContactInfo: '',                           // 当前选中的二维码信息
            usersCount: 0,                                    // 用户总数
            articlesCount: 0,                                 // 网站博文总数
            likesCount: 0,                                    // 点赞总数
            collectsCount: 0,                                 // 收藏总数
        };
    },
    methods: {
        async fetchLikes() {
            await axios
                .get('/api/article/getTotalLikesCount')
                .then((res) => {
                    console.log(res.data.message);
                    console.log(res.data.data);
                    this.message = res.data.message;
                    this.likesCount = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "初始化点赞总数失败",
                        type: "error",
                    });
                });
        },
        async fetchCollectes() {
            await axios
                .get('/api/article/getTotalCollectsCount')
                .then((res) => {
                    console.log(res.data.message);
                    console.log(res.data.data);
                    this.message = res.data.message;
                    this.collectsCount = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "初始化收藏总数失败",
                        type: "error",
                    });
                });
        },
        async fetchStatistic() {
            await axios
                .get('/api/user/getUsersCount')
                .then((res) => {
                    console.log(res.data.message);
                    console.log(res.data.data);
                    this.message = res.data.message;
                    this.usersCount = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "初始化用户总数失败",
                        type: "error",
                    });
                });
            await axios
                .get('/api/article/getArticlesCount')
                .then((res) => {
                    console.log(res.data.message);
                    console.log(res.data.data);
                    this.message = res.data.message;
                    this.articlesCount = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage({
                        showClose: true,
                        message: "初始化博文总数失败",
                        type: "error",
                    });
                });
            this.fetchLikes();
            this.fetchCollectes();
        },
        showQRCode(contact) {
            this.showTooltip = true;
            this.currentQRCode = contact.qrCode;
            this.currentContactInfo = contact.info;
        },
        hideQRCode() {
            this.showTooltip = false;
            this.currentQRCode = '';
            this.currentContactInfo = '';
        }
    },
    created() {
        this.$store.dispatch('updateDefaultActive', 'about');
        this.fetchStatistic();
    },
}
</script>

<style scoped>
.about-container {
    overflow: auto;
    height: 88vh;
}

.about-aside {
    margin-top: 1%;
    width: 21%;
    animation: tilt-in-top-1 .6s cubic-bezier(.25, .46, .45, .94) both
}


@keyframes tilt-in-top-1 {
    0% {
        transform: rotateY(30deg) translateY(-300px) skewY(-30deg);
        opacity: 0
    }

    100% {
        transform: rotateY(0deg) translateY(0) skewY(0deg);
        opacity: 1
    }
}

@keyframes tilt-in-top-1 {
    0% {
        transform: rotateY(30deg) translateY(-300px) skewY(-30deg);
        opacity: 0
    }

    100% {
        transform: rotateY(0deg) translateY(0) skewY(0deg);
        opacity: 1
    }
}

.card-client {
    background: #555;
    width: 250px;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 20px;
    border: 4px solid #fff;
    box-shadow: 0 6px 10px #212121;
    border-radius: 10px;
    text-align: center;
    color: #fff;
    font-family: "Poppins", sans-serif;
    transition: all 0.3s ease;
}

.avatar {
    margin: 0 auto;
    width: 110px;
    height: 110px;
}

.avatar-image-container {
    width: 110px;
    height: 110px;
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

.avatar-icon {
    font-size: 40px;
}

.name-client {
    margin: 0;
    margin-top: 20px;
    font-weight: 600;
    font-size: 18px;
}

.name-client span {
    display: block;
    font-weight: 200;
    font-size: 16px;
}

.social-media {
    position: relative;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.social-media .el-image {
    margin-left: 16px;
    margin-right: 16px;
    margin-bottom: 5px;
}

.social-media:before {
    content: " ";
    display: block;
    width: 100%;
    height: 2px;
    margin: 20px 0;
    background: #fff;
}

.tooltip {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border: 1px solid #ccc;
    padding: 10px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    z-index: 1;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
}

.tooltip img {
    width: 200px;
    height: auto;
}

.tooltip p {
    color: black;
}

.skill-card {
    width: 298px;
    background-color: #fff;
    border: 1px solid black;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
}

.header {
    background-color: #333;
    color: #fff;
    padding: 20px;
    text-align: center;
    font-size: 18px;
}

.body {
    padding: 20px;
}

.skill {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.skill-name {
    width: 120px;
    font-size: 16px;
}

.skill-level {
    width: 160px;
    height: 10px;
    background-color: #eee;
    border-radius: 10px;
    overflow: hidden;
    margin-left: 20px;
}

.skill-percent {
    background-color: #333;
    height: 100%;
}

.skill-percent-number {
    margin-left: 20px;
    font-size: 16px;
}

.about-main {
    margin-top: -2%;
    animation: fade-in 1.2s cubic-bezier(.39, .575, .565, 1.000) both
}

@keyframes fade-in {
    0% {
        opacity: 0
    }

    100% {
        opacity: 1
    }
}

.main-content {
    font-size: 16px;
    line-height: 1.6;
}

.about-statistic {
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid black;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.col-centered {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

:global(h2#card-usage ~ .example .example-showcase) {
    background-color: var(--el-fill-color) !important;
}

.el-statistic {
    --el-statistic-content-font-size: 28px;
}

.statistic-card {
    padding: 20px;
    border-radius: 4px;
    background-color: var(--el-bg-color-overlay);
}

.statistic-card span {
    font-size: 14px;
}

.about-collapse {
    margin-top: 2%;
}

ul {
    list-style-type: disc;
    padding-left: 20px;
}
</style>