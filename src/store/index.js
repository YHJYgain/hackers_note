import { createStore } from 'vuex';

export default createStore({
    state: {
        user: null,            // 初始值为 null，表示未登录
        defaultActive: 'home', // 导航栏默认激活菜单项：首页
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        clearUser(state) {
            state.user = null;
        },
        setDefaultActive(state, payload) {
            state.defaultActive = payload;
        },
    },
    actions: {
        login({ commit }, user) {
            commit('setUser', user);
        },
        logout({ commit }) {
            commit('clearUser');
        },
        updateDefaultActive({ commit }, value) {
            commit('setDefaultActive', value);
        },
    },
});