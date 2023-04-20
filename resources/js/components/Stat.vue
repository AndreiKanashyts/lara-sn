<template>
    <div class="flex justify-between mb-8 text-sm text-center">
        <div>
            Subscribers
            <div class="rounded-full bg-sky-400 text-white">
                {{ stats.subscribers_count }}
            </div>
        </div>
        <div>
            Likes
            <div class="rounded-full bg-sky-400 text-white">
                {{ stats.likes_count }}
            </div>
        </div>
        <div>
            Posts
            <div class="rounded-full bg-sky-400 text-white">
                {{ stats.post_count }}
            </div>
        </div>
        <div>
            Follows
            <div class="rounded-full bg-sky-400 text-white">
                {{ stats.followings_count }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Stat",

    props: ["stats"],
};
</script>
