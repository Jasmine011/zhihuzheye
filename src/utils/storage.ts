export const setItem = (key:string, val:string):void => {
  window.localStorage.setItem(key, val)
}
export const getItem = (key:string):string|null => {
  return window.localStorage.getItem(key)
}
export const delItem = (key:string):void => {
  window.localStorage.removeItem(key)
}
