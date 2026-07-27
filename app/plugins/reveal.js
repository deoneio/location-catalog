export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el) {
      el.classList.add('reveal')

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('reveal--visible')
            observer.disconnect()
          }
        },
        { threshold: 0.15 }
      )

      observer.observe(el)
    }
  })
})
