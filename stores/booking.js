import { defineStore } from "pinia";
const apiUrl = `${process.env.API_URL}/api/v1`;
export const useBookingStore = defineStore("bookingStore", () => {

  const isLoading = ref(false);
  const bookingInfo = ref({});
  const bookingPeople = ref(1);

  const goBookingPage = (data) => {
    bookingInfo.value = data;
  };

  const orderInfo = ref(null);

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
    bookingInfo,
    bookingPeople,
    goBookingPage,
    orderOncoming,
    orders,
    orderData,
    getOrderInfo,
    getOrders,
    createOrder,
    deleteOrder,
  };

})