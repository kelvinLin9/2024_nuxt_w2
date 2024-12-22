import { defineStore } from 'pinia';
const apiUrl = `${process.env.API_URL}/api/v1`;

export const useUserStore = defineStore("userStore", () => {

  const { $swal } = useNuxtApp();
  const router = useRouter();
  const route = useRoute();
  const cookie = useCookie("auth");
  const error_message = ref({
    username: "",
    password: "",
  });

  const loginData = ref({email: '', password: ''})
  const isLogin = ref(false);
  const isLoading = ref(false);
  const userInfo = ref({});
  const userInfoTemp = ref({
    name: '',
    phone: '',
    email: ''
  });
  const rememberMe =  ref(false);

  const login = async ({ email, password }) => {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
    // https://vue-lessons-api.vercel.app
    const res = await $fetch("/user/login", {
      baseURL: apiUrl,
      method: "POST",
      body: { email, password },
    });

    console.log(123, res)
    // save token
    cookie.value = { token: res.token };
   
    userInfo.value = res.result;
    isLogin.value = true;
    if (route.query.isOpen) {
      window.open("", "_self").close();
    }
    await $swal.fire({
      position: "center",
      icon: "success",
      title: "登入成功",
      showConfirmButton: false,
      timer: 1500,
    });
    navigateTo("/");
    } catch (error) {
    error_message.value = error.response._data.message;
    await $swal.fire({
      position: "center",
      icon: "error",
      title: "登入失敗，請檢查您的帳號密碼",
      text: error_message.value,
      showConfirmButton: false,
      timer: 1500,
    });
    } finally {
    isLoading.value = false;
    }
  };

  const logout = () => {
    cookie.value = null;
    isLogin.value = false;
    userInfo.value = {};
    navigateTo("/");
  };

  const checkAuth = async () => {
    console.log(123, cookie.value, apiUrl);
    // if (!cookie.value) return;
    console.log(1233)
    try {
      isLoading.value = true;
      const res = await $fetch("/user/check", {
        baseURL: apiUrl,
        method: "GET",
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      isLogin.value = true;
    } catch (error) {
      cookie.value = null;
      isLogin.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  const signup = async (userData) => {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
      // https://vue-lessons-api.vercel.app
      const res = await $fetch("/user/signup", {
        baseURL: apiUrl,
        method: "POST",
        body: { ...userData },
      });

      // save token
      cookie.value = { token: res.token };
      userInfo.value = res.result;
      isLogin.value = true;
      router.replace("/");
      await $swal.fire({
        position: "center",
        icon: "success",
        title: "註冊成功",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      error_message.value = error.response._data.message;

      await $swal.fire({
        position: "center",
        icon: "error",
        title: "註冊失敗",
        text: error_message.value,
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.reload();
    } finally {
      isLoading.value = false;
    }
  };

  const getUser = async () => {
    if (!cookie.value) return;
    try {
      const res = await $fetch("/user/", {
        baseURL: apiUrl,
        method: "GET",
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      userInfo.value = res.result;
      if (res.result.role === "admin") isAdmin.value = true;
    } catch (error) {
      error_message.value = error.response._data.message;
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "用戶資料取得失敗",
        text: error_message.value,
        showConfirmButton: false,
        timer: 1500,
      });
      // router.replace({path:'/login'})
      // cookie.value = null
      // isLogin.value = false
    } finally {
      isLoading.value = false;
    }
  };

  const updateUser = async (data) => {
    // https://vue-lessons-api.vercel.app
    if (!cookie.value) return;
    try {
      const res = await $fetch("/user/", {
        baseURL: apiUrl,
        method: "PUT",
        headers: {
          Authorization: cookie.value?.token,
        },
        body: data,
      });
      getUser();

      await $swal.fire({
        position: "center",
        icon: "success",
        title: "修改成功",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      error_message.value = error.response._data.message;
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "修改失敗",
        text: error_message.value,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };


  return {
    loginData,
    isLogin,
    isLoading,
    userInfo,
    userInfoTemp,
    rememberMe,

    login,
    logout,
    checkAuth,
    signup,
    getUser,
    updateUser

  }
})
