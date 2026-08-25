interface ImpressionBinding {
  id: string | number
  name: string
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('impression', {
    mounted(el: HTMLElement, binding: { value: ImpressionBinding }) {
      const { public: { gaMeasurementId } } = useRuntimeConfig()
      if (!import.meta.env.PROD || !gaMeasurementId) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            window.gtag?.('event', 'location_impression', {
              item_id: binding.value.id,
              item_name: binding.value.name
            })
            observer.disconnect()
          }
        },
        { threshold: 0.5 }
      )

      observer.observe(el)
    }
  })
})
