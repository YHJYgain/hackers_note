<template>
    <el-container>
        <el-footer class="footer">
            <p>Copyright 2023 &copy; WZY. All rights reserved.</p>
            <p>For any inquiries, contact us at <span class="qq">管理员QQ：1583952973</span></p>
        </el-footer>
    </el-container>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Footer',
}
</script>

<style scoped>
.footer {
    padding: 7px;
    background-color: #f5f5f5;
    position: fixed;
    bottom: 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
}

.footer p {
    font-size: smaller;
}

.footer p:nth-child(2) {
    margin-left: 20px;
}

.qq {
    font-weight: bold;
    color: #2da7f9;
}
</style>