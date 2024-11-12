<template>
    <div class="follow-container">
        <div class="follow-info">
            <el-avatar class="avatar" title="头像" :size="100" :fit="cover">
                <div class="avatar-image-container">
                    <img class="avatar-image" v-if="follow.avatar" :src="follow.avatar" alt="Avatar" />
                    <div v-else class="default-avatar">
                        <el-icon class="avatar-icon">
                            <Avatar />
                        </el-icon>
                    </div>
                </div>
            </el-avatar>
            <h4>{{ follow.nickname }}</h4>
        </div>
    </div>
</template>

<script>
export default {
    name: "FollowItem",
    props: {
        follow: {}, // 从父组件传递的粉丝（用户）对象
    },
}
</script>

<style scoped>
.follow-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.avatar {
    margin: 0 auto;
    width: 65px;
    height: 65px;
}

.avatar-image-container {
    width: 65px;
    height: 65px;
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
    width: 100px;
    height: 100px;
    transition: transform 0.3s;
}

.default-avatar:hover {
    transform: scale(1.1);
}

.follow-info {
    display: flex;
    align-items: center;
}

h4 {
    margin-left: 16px;
}
</style>