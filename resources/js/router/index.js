import {createRouter, createWebHistory} from 'vue-router';
import Login from '../views/user/Login.vue';
import Registration from '../views/user/Registration.vue';
import Personal from '../views/user/Personal.vue';
import Index from '../views/user/Index.vue';
import Show from '../views/user/Show.vue';
import Feed from '../views/user/Feed.vue';


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/users/index',
            name: 'user.index',
            component: Index,
        },
        {
            path: '/users/:id/show',
            name: 'user.show',
            component: Show,
        },
        {
            path: '/users/feed',
            name: 'user.feed',
            component: Feed,
        },
        {
            path: '/users/login',
            name: 'user.login',
            component: Login,
        },
        {
            path: '/users/registration',
            name: 'user.registration',
            component: Registration,
        },
        {
            path: '/users/personal',
            name: 'user.personal',
            component: Personal,
        },
    ]
})


router.beforeEach((to, from, next) => {

    axios.get('/api/user')
        .catch(e => {
            if (e.response.status === 401) {
                localStorage.key('x_xsrf_token') ? localStorage.removeItem('x_xsrf_token') : ''
            }
        })

    const token = localStorage.getItem('x_xsrf_token')

    if (!token) {
        if (to.name === 'user.login' || to.name === 'user.registration') {
            return next()
        } else {
            return next({
                name: 'user.login'
            })
        }
    }

    if (to.name === 'user.login' || to.name === 'user.registration' && token) {
        return next({
            name: 'user.personal'
        })
    }

    next()

})

export default router
