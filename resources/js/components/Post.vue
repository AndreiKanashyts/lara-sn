<template>
    <div class="mb-8 pb-8 border-t border-gray-400">
        <h1 class="text-xl">{{ post.title }}</h1>
        <router-link
            class="text-sm text-gray-700"
            :to="{ name: 'user.show', params: { id: post.user.id } }"
            >{{ post.user.name }}</router-link
        >
        <img
            class="my-3 mx-auto"
            v-if="post.image_url"
            :src="post.image_url"
            :alt="post.title"
            width="400"
        />
        <p>{{ post.content }}</p>
        <div
            v-if="post.reposted_post"
            class="bg-gray-100 p-4 my-4 border border-gray-200"
        >
            <h1 class="text-xl">{{ post.reposted_post.title }}</h1>
            <router-link
                class="text-sm text-gray-700"
                :to="{
                    name: 'user.show',
                    params: { id: post.reposted_post.user.id },
                }"
                >{{ post.reposted_post.user.name }}</router-link
            >
            <img
                class="my-3 mx-auto"
                v-if="post.reposted_post.image_url"
                :src="post.reposted_post.image_url"
                :alt="post.reposted_post.title"
                width="400"
            />
            <p>{{ post.reposted_post.content }}</p>
        </div>

        <div class="flex justify-between mt-2 items-center">
            <div class="flex">
                <div class="flex mr-3">
                    <svg
                        @click.prevent="toggleLike(post)"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        :class="[
                            'mr-2 stroke-sky-400 cursor-pointer hover:fill-sky-400 w-6 h-6',
                            post.is_liked ? 'fill-sky-400' : 'fill-white',
                        ]"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>
                    <p>{{ post.likes_count }}</p>
                </div>
                <div class="flex">
                    <svg
                        @click.prevent="openRepost()"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        :class="[
                            'mr-2 stroke-sky-400 cursor-pointer hover:fill-sky-400 w-6 h-6',
                            'fill-white',
                        ]"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                        />
                    </svg>
                    <p>{{ post.reposted_by_posts_count }}</p>
                </div>
            </div>

            <p class="text-right text-slate-500 text-sm">
                {{ post.date }}
            </p>
        </div>
        <div v-if="isRepost" class="mt-4">
            <div class="mb-4">
                <div class="mb-3">
                    <input
                        v-model="title"
                        type="text"
                        class="w-96 rounded-3xl border p-2 border-slate-300"
                        placeholder="title"
                    />
                    <div v-if="errors.title">
                        <p
                            v-for="error in errors.title"
                            :key="error.id"
                            class="text-sm mt-2 text-red-500"
                        >
                            {{ error }}
                        </p>
                    </div>
                </div>
                <div class="mb-3">
                    <textarea
                        v-model="content"
                        rows="3"
                        class="w-96 rounded-3xl border p-2 border-slate-300"
                        placeholder="content"
                    />
                    <div v-if="errors.content">
                        <p
                            v-for="error in errors.content"
                            :key="error.id"
                            class="text-sm mb-2 text-red-500"
                        >
                            {{ error }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click.prevent="repost(post)"
                    type="submit"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Publish
                </button>
            </div>
        </div>

        <div v-if="post.comments_count" class="mt-4">
            <p
                class="cursor-pointer"
                v-if="!isShowed"
                @click="getComments(post)"
            >
                Show {{ post.comments_count }} comments
            </p>
            <p class="cursor-pointer" v-if="isShowed" @click="isShowed = false">
                Close
            </p>
            <div v-if="comments && isShowed">
                <div
                    v-for="comment in comments"
                    :key="comment.id"
                    class="mt-4 pt-4 border-t border-gray-300"
                >
                    <div class="flex mb-2">
                        <p class="text-sm mr-2">{{ comment.user.name }}</p>
                        <p
                            @click="setParentId(comment)"
                            class="text-sm text-sky-500 cursor-pointer"
                        >
                            Answer
                        </p>
                    </div>
                    <p>
                        <span
                            v-if="comment.answered_for_user"
                            class="text-sky-400"
                            >{{ comment.answered_for_user }},</span
                        >{{ comment.body }}
                    </p>
                    <p class="text-right text-sm">{{ comment.date }}</p>
                </div>
            </div>
        </div>

        <div class="mt-4">
            <div class="mb-3">
                <div class="flex items-center">
                    <p v-if="comment" class="mr-2">
                        Answered for {{ comment.user.name }}
                    </p>
                    <p
                        v-if="comment"
                        @click="comment = null"
                        class="cursor-pointer text-sky-400 text-sm"
                    >
                        Cancel
                    </p>
                </div>
                <input
                    v-model="body"
                    type="text"
                    class="w-96 mb-3 rounded-3xl border p-2 border-slate-300"
                    placeholder="title"
                />
                <div v-if="errors.body">
                    <p
                        v-for="error in errors.body"
                        :key="error.id"
                        class="text-sm mb-2 text-red-500"
                    >
                        {{ error }}
                    </p>
                </div>
            </div>
            <div class="px-4 py-3 text-right sm:px-6">
                <button
                    @click.prevent="storeComment(post)"
                    type="submit"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Comment
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Post",

    props: ["post"],

    data() {
        return {
            title: "",
            content: "",
            body: "",
            isRepost: false,
            isShowed: false,
            repostedId: null,
            comment: null,
            errors: [],
            comments: [],
        };
    },

    methods: {
        toggleLike(post) {
            axios.post(`/api/posts/${post.id}/toggle_like`).then((res) => {
                post.is_liked = res.data.is_liked;
                post.likes_count = res.data.likes_count;
            });
        },

        setParentId(comment) {
            this.comment = comment;
        },

        storeComment(post) {
            const commentId = this.comment ? this.comment.id : null;
            axios
                .post(`/api/posts/${post.id}/comment`, {
                    body: this.body,
                    parent_id: commentId,
                })
                .then((res) => {
                    this.body = "";
                    this.comments.unshift(res.data.data);
                    this.comment = null;
                    post.comments_count++;
                    this.isShowed = true;
                })
                .catch((e) => {
                    this.errors = e.response.data.errors;
                });
        },

        getComments(post) {
            axios
                .get(`/api/posts/${post.id}/comment`)
                .then((res) => {
                    this.comments = res.data.data;
                    this.isShowed = true;
                })
                .catch((e) => {
                    this.errors = e.response.data.errors;
                });
        },

        openRepost() {
            if (this.$route.name === "user.personal") return;
            this.isRepost = !this.isRepost;
        },

        repost(post) {
            if (this.$route.name === "user.personal") return;
            axios
                .post(`/api/posts/${post.id}/repost`, {
                    title: this.title,
                    content: this.content,
                })
                .then(() => {
                    this.title = "";
                    this.content = "";
                })
                .catch((e) => {
                    this.errors = e.response.data.errors;
                });
        },
    },
};
</script>

<style scoped></style>
