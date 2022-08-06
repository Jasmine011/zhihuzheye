import { onUnmounted } from 'vue'
function useDOMCreate(nodeId:string):void {
  // 在body创建一个节点挂载这个loading
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  // 卸载（loading结束）的时候删除节点
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}
export default useDOMCreate
