<template>
    <div class="w-96 mx-auto">
        <Stat :stats="stats"></Stat>
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
            <div class="flex mb-3 items-center">
                <div>
                    <input
                        @change="storeImage"
                        ref="file"
                        type="file"
                        class="hidden"
                    />
                    <a
                        href="#"
                        class="w-32 p-2 bg-sky-400 text-white rounded-lg"
                        @click.prevent="selectFile()"
                        >Image</a
                    >
                </div>
                <div>
                    <a
                        v-if="image"
                        @click.prevent="image = null"
                        class="ml-3"
                        href="#"
                        >Cancel</a
                    >
                </div>
            </div>
            <div v-if="image">
                <img :src="image.url" alt="preview" />
            </div>
        </div>
        <div class="px-4 py-3 text-right sm:px-6">
            <button
                @click.prevent="store"
                type="submit"
                class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Publish
            </button>
        </div>
        <div v-if="posts">
            <h1 class="mb-8 pb-8 border-gray-400">Posts</h1>
            <Post v-for="post in posts" :key="post.id" :post="post"></Post>
        </div>
    </div>
</template>

<script>
import Post from "../../components/Post.vue";
import Stat from "../../components/Stat.vue";

export default {
    name: "Personal",

    components: {
        Post,
        Stat,
    },

    data() {
        return {
            title: "",
            content: "",
            image: null,
            posts: [],
            errors: [],
            stats: [],
        };
    },

    mounted() {
        this.getPosts();
        this.getStats();
    },

    methods: {
        getStats() {
            axios.post("/api/users/stats", { user_id: null }).then((res) => {
                this.stats = res.data.data;
            });
        },

        getPosts() {
            axios.get("/api/posts").then((res) => {
                this.posts = res.data.data;
            });
        },

        store() {
            const id = this.image ? this.image.id : null;
            axios
                .post("/api/posts", {
                    title: this.title,
                    content: this.content,
                    image_id: id,
                })
                .then((res) => {
                    this.title = "";
                    this.content = "";
                    this.image = null;
                    this.posts.unshift(res.data.data);
                })
                .catch((e) => {
                    this.errors = e.response.data.errors;
                });
        },

        selectFile() {
            this.fileInput = this.$refs.file;
            this.fileInput.click();
        },
        storeImage(e) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("image", file);

            axios
                .post("/api/post_images", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    this.image = res.data.data;
                })
                .catch((error) => {
                    console.log(error.res);
                });
        },
    },
};
</script>

<style scoped></style>
