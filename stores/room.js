import { defineStore } from "pinia";
const apiUrl = `${process.env.API_URL}/api/v1`;
export const useRoomStore = defineStore("roomStore", () => {
  const { $swal } = useNuxtApp();
  const cookie = useCookie("auth");
  const router = useRouter();
  const roomsData = ref([]);
  const roomData = ref({});
  const roomLayout = ref([
    {
      title: '市景',
      isProvide: true,
    },
    {
      title: '獨立衛浴',
      isProvide: true,
    },
    {
      title: '客廳',
      isProvide: true,
    },
    {
      title: '書房',
      isProvide: true,
    },
    {
      title: '樓層電梯',
      isProvide: true,
    },
  ])
  const isLoading = ref(false);

  const getRoomsData = async (id) => {
    try {
      const res = await $fetch(`/rooms`, {
        baseURL: apiUrl,
      });

      roomsData.value = res.result;
      console.log(roomsData.value);
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得房型資料...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const getRoomData = async (id) => {
    try {
      const res = await $fetch(`/rooms/${id}`, {
        baseURL: apiUrl,
      });

      roomData.value = res.result;
      console.log(roomData.value);
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得房型資料...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      router.push("/rooms");
    }
  };

  const bookingInfo = ref({});

  const goBookingPage = (data) => {
    bookingInfo.value = data;
  };

  const orderInfo = ref({});

  const orderOncoming = ref([]);
  const orders = ref([]);
  const getOrders = async () => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/orders`, {
        baseURL: apiUrl,
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      const oncoming = res.result.filter(
        (order) => (new Date(order.checkInDate) >= new Date() || new Date(order.checkOutDate) >= new Date() )&& order.status !== -1
      );
      oncoming.sort(
        (a, b) =>
          new Date(a.checkInDate) - new Date(b.checkInDate) ||
          new Date(a.checkOutDate) - new Date(b.checkOutDate)
      );
      orderOncoming.value = oncoming;

      // const historyOrders = res.result.filter(
      //   (order) => new Date(order.checkInDate) <= new Date() && new Date(order.checkOutDate) < new Date()
      // );
      // historyOrders.sort(
      //   (a, b) =>
      //     new Date(a.checkInDate) - new Date(b.checkInDate) ||
      //     new Date(a.checkOutDate) - new Date(b.checkOutDate)
      // );
      orders.value = res.result;
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得訂單資料...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const createOrder = async (data) => {
    isLoading.value = true;
    console.log('create Order')
    try {
      const res = await $fetch(`/orders`, {
        baseURL: apiUrl,
        method: "POST",
        headers: {
          Authorization: cookie.value?.token,
        },
        body: data,
      });
      orderInfo.value = res.result;
      navigateTo(`/booking/confirmation/${res.result._id}`);
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法建立訂單...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      isLoading.value = false;
    } 
  };

  const orderData = ref({});
  const getOrderInfo = async (id) => {
    try {
      const res = await $fetch(`/orders/${id}`, {
        baseURL: apiUrl,
        method: "GET",
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      orderData.value = res.result;
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得訂單資料...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      navigateTo("/rooms");
    } finally {
      isLoading.value = false;
    }
  };

  const deleteOrder = async (id) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/orders/${id}`, {
        baseURL: apiUrl,
        method: "DELETE",
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      getOrders();
      await $swal.fire({
        position: "center",
        icon: "success",
        title: "刪除成功",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "刪除失敗",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    roomsData,
    roomData,
    roomLayout,
    getRoomsData,
    getRoomData,
    bookingInfo,
    goBookingPage,
    orderOncoming,
    orders,
    orderData,
    getOrderInfo,
    getOrders,
    createOrder,
    deleteOrder,
  };
});
