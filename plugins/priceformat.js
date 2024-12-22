export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("priceformat", {
        mounted(el,  binding) {
            const price = parseInt(binding.value)
            if(isNaN(price)) return
          if(binding.arg ==='TWD') el.innerText = 'NT$ '+price.toLocaleString()
          return price.toLocaleString()
        },
    })
});