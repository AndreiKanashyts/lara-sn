<template>
    <div class="w-96 mx-auto">
        <div v-if="users">
            <div
                class="flex justify-between items-center mp-6 pb-6 border-b border-gray-400"
                v-for="user in users"
                :key="user.id"
            >
                <router-link
                    :to="{ name: 'user.show', params: { id: user.id } }"
                >
                    <p>{{ user.id }}</p>
                    <p>{{ user.name }}</p>
                    <p>{{ user.email }}</p>
                </router-link>
                <div>
                    <a
                        :class="[
                            'block p-2 w-32 text-center rounded-3xl',
                            user.is_followed
                                ? 'bg-white text-sky-400 border border-sky-400'
                                : 'bg-sky-400 text-white',
                        ]"
                        href="#"
                        @click.prevent="toggleFollowing(user)"
                        >{{ user.is_followed ? "Un followed" : "Follow" }}</a
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Index",

    data() {
        return {
            users: [],
        };
    },

    mounted() {
        this.getUsers();
    },

    methods: {
        getUsers() {
            axios.get("/api/users/").then((res) => {
                this.users = res.data.data;
            });
        },

        toggleFollowing(user) {
            axios.post(`/api/users/${user.id}/toggle_following`).then((res) => {
                user.is_followed = res.data.is_followed;
            });
        },
    },
};
</script>

<style scoped></style>
