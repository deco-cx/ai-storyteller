const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: window.IndexPage },
        { path: '/login', component: window.LoginPage },
        { path: '/create', component: window.CreatePage }
    ]
});

const app = createApp({});
app.use(router);
app.mount('#app'); 