import { h, render } from 'vue'
import Message from '@/components/Message.vue'
export type MessageType = 'success' | 'error' | 'default'
const createMessage = (message:string, type:MessageType, timeout = 2000):void => {
  // h函数的参数和createApp一样
  const messageVnode = h(Message, {
    message,
    type
  })
  // 创建一个节点，并把组件实例挂载到这个节点
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  // 利用render把vnode挂载到对应的dom节点
  // render（vNode，要挂载的DOM节点）
  render(messageVnode, mountNode)
  // 卸载、删除创建的节点的函数
  const destory = () => {
    // 从节点卸载组件
    render(null, mountNode)
    // 同时把创建的节点也删除
    document.body.removeChild(mountNode)
  }
  if (timeout) {
    setTimeout(() => {
      destory()
    }, timeout)
  }
  // 把这个函数返回出去，这样我们再外部就可以手动地控制这个组件的关闭
  // return { destory }
}
export default createMessage
