declare module 'fastclick' {
  export function attach(ele: any):any
}
declare module 'better-scroll' {
  export default class BScroll {
    constructor (ele: any, options?: any)
  }
}
declare module 'lyric-parser' {
  export default class Lyric {
    constructor (ele: any, handler: any)
  }
}
declare module 'good-storage' {
  export function get(el: any, ar: any): any
  export function set(el: any, ar: any): any
  export function remove(el: any): any
}