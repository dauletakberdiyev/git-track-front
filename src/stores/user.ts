import userService from "@/services/userService";
import type { User } from "@/types/user";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useUserStore = defineStore('user', () => {
    const user: Ref<User | null> = ref(null);

    const userInfo = async() => {
        user.value = null;
        
        user.value = await userService().getUserInfo();
    }

    return {
        user,
        userInfo
    }
})