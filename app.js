const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: window.IndexPage },
        { path: '/login', component: window.LoginPage },
        { path: '/create', component: window.CreatePage },
        { path: '/story', component: window.StoryPage },
        { path: '/my-stories', component: window.MyStoriesPage }
    ]
});

const app = createApp({});
app.use(router);
app.mount('#app'); 