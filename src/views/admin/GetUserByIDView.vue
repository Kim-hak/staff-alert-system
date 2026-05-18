<template>
    <UserViewDetail v-if="store.userDetail" :employee="store.userDetail" @back="router.back()"></UserViewDetail>
</template>
<script setup>
import UserViewDetail from '../profile/UserViewDetail.vue';
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { useArcticleStore } from "@/stores/useArcticleStore";

const route = useRoute();
const router = useRouter();
const store = useArcticleStore();

onMounted(() => {
    store.fetchUserDetailById(route.params.id);
});

</script>