<script setup>
import { ZipCodeMap, cityList } from "~/utils/zipcodes";
import { useUserStore } from '~/stores/user.js'
const userStore = useUserStore()
const { isLogin, userInfo } = storeToRefs(userStore)
const { getUser, updateUser } = userStore;
const isEditPassword = ref(false);
const isEditProfile = ref(false);
const isLoading = ref(true)

const route = useRoute();
const userId = route.params.userId
getUser()

const isAlphanumeric = (string = "") => {
  return string.match(/(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z)]/)
    ? true
    : "至少 8 個字元，至少一個英文(大寫或小寫) + 一個數字";
};

const city = ref("臺北市");
const zipcodeList = ref([]);
const countyList = (city) => ZipCodeMap.filter((value) => value.name == city);

watch(
  city,
  () => {
    const list = countyList(city.value);
    zipcodeList.value = list[0].districts;
  },
  { immediate: true }
);

const form1 = ref(null);
const form2 = ref(null);

const userData = ref({
  email:'',
  name: '',
  phone: '',
  year: '',
  month: '',
  day: '',
  city: '',
  district: '',
  zipcode: '',
  address: '',
});

const getUserInfo = () => {
  if (!userInfo.value) return;
  const getCity = (zipcode) =>
    ZipCodeMap.find((value) => {
      return value.districts.find((item) => item.zip == zipcode);
    });
  const cityObj = getCity(userInfo?.value.address.zipcode);
  const district = cityObj.districts.find(
    (item) => item.zip == userInfo?.value.address.zipcode
  );
  const year = new Date(userInfo?.value.birthday).getFullYear();
  const month = new Date(userInfo?.value.birthday).getMonth()+1;
  const day = new Date(userInfo?.value.birthday).getDate();
  const form = {
    email:userInfo?.value.email,
    name: userInfo?.value.name,
    phone: userInfo?.value.phone,
    year: year,
    month: month,
    day: day,
    city: cityObj.name,
    district: district.name,
    zipcode: userInfo?.value.address.zipcode,
    address: userInfo?.value.address.detail,
  };
  userData.value = form;
  form2.value.setValues(form);
  isLoading.value = false
};

watch(userInfo, () => {
  getUserInfo();
});


const updateUserData = (data, type = "password") => {
  let user = {};
  if(type === "password"){
    user = {
      userId:userId,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
  }
  if (type === "info") {
    user = {
      userId:userId,
      name: data.name,
      phone: data.phone,
      birthday: `${data.year}/${data.month}/${data.day}`,
      address: {
        zipcode: data.zipcode,
        detail: data.address,
      },
    };
  }
  updateUser(user);
  if(type === "password"){
    isEditPassword.value = false
    form1.value.resetForm()
  }
  if (type === "info") isEditProfile.value = false
};

const cancelUpdateForm1 = () => {
  form1.value.resetForm()
  isEditPassword.value = false
};
const cancelUpdateForm2 = () => {
  getUserInfo()
  isEditProfile.value = false
};
</script>

<template>
  <div class="">
    <NuxtLayout name="user">
      <div class="row gap-6 gap-md-0">
        <div class="col-12 col-md-5">
          <section
            class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
          >
            <h2 class="fs-6 fs-md-5 fw-bold">修改密碼</h2>
            <div class="d-flex flex-column gap-4 gap-md-6">
              <div class="fs-8 fs-md-7">
                <p class="mb-2 text-neutral-80 fw-medium">電子信箱</p>
                <span
                  class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                  >{{ userData.email }}</span
                >
              </div>

              <div
                class="d-flex justify-content-between align-items-center"
                :class="{ 'd-none': isEditPassword }"
              >
                <div>
                  <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                    密碼
                  </label>
                  <input
                    class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                    type="password"
                    value="**********"
                  />
                </div>

                <button
                  class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
                  type="button"
                  @click="isEditPassword = !isEditPassword"
                >
                  重設
                </button>
              </div>

              <VeeForm
                ref="form1"
                @submit="updateUserData(form1.values,'password')"
                v-slot="{ meta }"
                :class="{ 'd-none': !isEditPassword }"
              >
              <div class="d-flex flex-column gap-4 gap-md-6">

                <div>
                  <label for="oldPassword" class="form-label fs-8 fs-md-7 fw-bold"
                    >舊密碼</label
                  >
                  <VeeField
                    name="oldPassword"
                    id="oldPassword"
                    type="password"
                    class="form-control p-4 fs-7 rounded-3"
                    placeholder="請輸入舊密碼"
                    :rules="isAlphanumeric"
                  />
                  <VeeErrorMessage class="text-danger" name="oldPassword" />
                </div>

                <div>
                  <label for="newPassword" class="form-label fs-8 fs-md-7 fw-bold"
                    >新密碼</label
                  >
                  <VeeField
                    name="newPassword"
                    id="newPassword"
                    type="password"
                    class="form-control p-4 fs-7 rounded-3"
                    placeholder="請輸入新密碼"
                    :rules="isAlphanumeric"
                  />
                  <VeeErrorMessage class="text-danger" name="newPassword" />
                </div>

                <div>
                  <label
                    for="confirmPassword"
                    class="form-label fs-8 fs-md-7 fw-bold"
                    >確認新密碼</label
                  >
                  <VeeField
                    name="confirmPassword"
                    id="confirmPassword"
                    type="password"
                    class="form-control p-4 fs-7 rounded-3"
                    placeholder="請再輸入一次新密碼"
                    rules="required|confirmed:@newPassword"
                  />
                  <VeeErrorMessage class="text-danger" name="confirmPassword" />
                </div>
                <div class="d-flex justify-content-between">
                  <button
                    :class="{ 'd-none': !isEditPassword ,'btn-neutral-40 text-neutral-60':!meta.valid ,'btn-primary-100 text-white':meta.valid}"
                    class="btn align-self-md-start px-8 py-4 rounded-3"
                    type="submit"
                    :disabled="!meta.valid"
                  >
                    儲存設定
                  </button>

                  <button
                    :class="{ 'd-none': !isEditPassword }"
                    class="btn btn-outline-dark align-self-md-end px-8 py-4 rounded-3"
                    type="button"
                    @click="cancelUpdateForm1"
                  >
                    取消
                  </button>
                </div>
              </div>
              </VeeForm>
            </div>
          </section>
        </div>

        <div class="col-12 col-md-7 position-relative">
          
          <VeeForm
            ref="form2"
            v-slot="{ meta }"
            @submit="updateUserData(form2.values,'info')"
            class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
          >
            <h2 class="fs-6 fs-md-5 fw-bold">基本資料</h2>
            <div class="d-flex flex-column gap-4 gap-md-6">
              <div class="fs-8 fs-md-7">
                <label
                  class="form-label"
                  :class="{
                    'fw-bold text-neutral-100': isEditProfile,
                    'fw-medium text-neutral-80': !isEditProfile,
                  }"
                  for="name"
                >
                  姓名
                </label>
                <VeeField
                  id="name"
                  name="name"
                  class="form-control text-neutral-100 fw-bold"
                  :class="{
                    'pe-none p-0 border-0': !isEditProfile,
                    'p-4': isEditProfile,
                  }"
                  type="text"
                  :value="userData.name"
                  rules="required"
                />
                <VeeErrorMessage class="text-danger" name="name" />
              </div>

              <div class="fs-8 fs-md-7">
                <label
                  class="form-label"
                  :class="{
                    'fw-bold text-neutral-100': isEditProfile,
                    'fw-medium text-neutral-80': !isEditProfile,
                  }"
                  for="phone"
                >
                  手機號碼
                </label>
                <VeeField
                  id="phone"
                  name="phone"
                  class="form-control text-neutral-100 fw-bold"
                  :class="{
                    'pe-none p-0 border-0': !isEditProfile,
                    'p-4': isEditProfile,
                  }"
                  type="tel"
                  :value="userData.phone"
                  :rules="{ required: true, regex: /^09[0-9]{8}$/ }"
                />
                <VeeErrorMessage class="text-danger" name="phone" />
              </div>

              <div class="fs-8 fs-md-7" >
                <label
                  class="form-label"
                  :class="{
                    'fw-bold text-neutral-100': isEditProfile,
                    'fw-medium text-neutral-80': !isEditProfile,
                  }"
                  for="year"
                >
                  生日
                </label>
                <span
                  class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                  :class="{ 'd-none': isEditProfile }"
                  >{{ userData.year }} 年 {{ userData.month }} 月
                  {{ userData.day }} 日</span
                >
                <div :class="{ 'd-none': !isEditProfile }">
                  <div class="d-flex gap-2">

                    <VeeField
                      name="year"
                      as="select"
                      id="year"
                      class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                      rules="required"
                    >
                      <option
                        v-for="year in 66"
                        :key="year"
                        :value="year+1958"
                      >
                        {{ year + 1958 }} 年
                      </option>
                    </VeeField>
                    <VeeField
                      name="month"
                      as="select"
                      id="month"
                      class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                      rules="required"
                    >
                      <option v-for="month in 12" :key="month" :value="month">
                        {{ month }} 月
                      </option>
                    </VeeField>
                    <VeeField
                      name="day"
                      as="select"
                      id="day"
                      class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                      rules="required"
                    >
                      <option v-for="day in 30" :key="day" :value="day">
                        {{ day }} 日
                      </option>
                    </VeeField>
                  </div>
                </div>
              </div>

              <div class="fs-8 fs-md-7">
                <label
                  class="form-label"
                  :class="{
                    'fw-bold text-neutral-100': isEditProfile,
                    'fw-medium text-neutral-80': !isEditProfile,
                  }"
                  for="address"
                >
                  地址
                </label>
                <span
                  class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                  :class="{ 'd-none': isEditProfile }"
                >
                  {{ userData.city + userData.district + userData.address }}
                </span>
                <div :class="{ 'd-none': !isEditProfile }">
                  <div class="d-flex gap-2 mb-2">
                    <VeeField
                      v-model="city"
                      name="city"
                      as="select"
                      class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                      rules="required"
                    >
                      <option
                        v-for="item in cityList"
                        :key="item"
                        :value="item"
                        :selected="item == '臺北市'"
                      >
                        {{ item }}
                      </option>
                    </VeeField>
                    <VeeField
                      name="zipcode"
                      as="select"
                      class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                      rules="required"
                    >
                      <option v-for="item in zipcodeList" :value="item.zip">
                        {{ item.name }}
                      </option>
                    </VeeField>
                  </div>
                  <VeeField
                    name="address"
                    id="address"
                    type="text"
                    class="form-control p-4 rounded-3"
                    placeholder="請輸入詳細地址"
                    rules="required"
                  />
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <button
                :class="{ 'd-none': isEditProfile }"
                class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
                type="button"
                @click="isEditProfile = !isEditProfile"
              >
                編輯
              </button>

              <button
                :class="{ 'd-none': !isEditProfile,'btn-neutral-40 text-neutral-60':!meta.valid ,'btn-primary-100 text-white':meta.valid }"
                class="btn align-self-md-start px-8 py-4 rounded-3"
                type="submit"
                :disabled="!meta.valid"
              >
                儲存設定
              </button>
              <button
                :class="{ 'd-none': !isEditProfile }"
                class="btn btn-outline-dark align-self-md-end px-8 py-4 rounded-3"
                type="button"
                @click="cancelUpdateForm2"
              >
                取消
              </button>
            </div>
          </VeeForm>
          <div v-if="isLoading" class="d-flex align-items-center rounded-3xl gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0 position-absolute w-100 h-100 top-0">
            <strong>Loading...</strong>
            <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type="password"] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>
