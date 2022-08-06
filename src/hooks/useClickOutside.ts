import { ref, onMounted, onUnmounted, Ref } from 'vue'
const useClickOutside = (domRef:Ref<HTMLElement | null>):Ref<boolean> => {
  const isClickOutside = ref(false)
  const handler = (e:MouseEvent) => {
    if (domRef.value) {
      if (!domRef.value.contains(e.target as HTMLElement)) {
        // 不包含
        isClickOutside.value = true
      } else {
        // 包含
        isClickOutside.value = false
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}
export default useClickOutside
