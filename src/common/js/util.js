/* 
* @Author: zhangyi
* @Date:   2017-08-21 12:00:09
* @Last Modified by:   zhangyi
* @Last Modified time: 2017-08-21 14:58:53
* @example ?id=1&a=b
* @return Object {id:1,a:b}
*/
export function urlParse(){
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    if( arr ){
        arr.forEach((item) => {
            let tempArr = item.substring(1).split("=");
            let key = decodeURIComponent(tempArr[0]);
            let value = decodeURIComponent(tempArr[1]);
            obj[key] = value;
        })
    }
    return obj;
}