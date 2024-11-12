import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import User from '../views/User.vue';
import UserInfo from '../views/UserInfo.vue';
import ArticleDetail from '../views/ArticleDetail.vue';
import EditArticle from '../views/EditArticle.vue';
import PublishArticle from '../views/PublishArticle.vue';
import EditUser from '../views/EditUser.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
            meta: {
                title: '首页'
            }
        },
        {
            path: '/article/:id',
            component: ArticleDetail,
            meta: {
                title: '博文详情'
            }
        },
        {
            path: '/editArticle/:id',
            component: EditArticle,
            meta: {
                title: '编辑博文'
            }
        },
        {
            path: '/publishArticle',
            component: PublishArticle,
            meta: {
                title: '发布博文'
            }
        },
        {
            path: '/about',
            component: About,
            meta: {
                title: '关于'
            }
        },
        {
            path: '/register',
            component: Register,
            meta: {
                title: '注册'
            }
        },
        {
            path: '/login',
            component: Login,
            meta: {
                title: '登录'
            }
        },
        {
            path: '/user',
            component: User,
            meta: {
                title: '个人中心'
            }
        },
        {
            path: '/userInfo/:id',
            component: UserInfo,
            meta: {
                title: '博主主页'
            }
        },
        {
            path: '/editUser',
            component: EditUser,
            meta: {
                title: '编辑个人信息'
            }
        },
    ]
});

export default router;