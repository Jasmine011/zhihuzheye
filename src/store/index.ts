import { useUserStore } from '@/store/column'

export interface IAppStore {
  useUserStore: ReturnType<typeof useUserStore>;
}

const appStore: IAppStore = {} as IAppStore

/**
 * 注册app状态库
 */
export const registerStore = ():void => {
  appStore.useUserStore = useUserStore()
}

export default appStore
