/* 
 * @Author: zhangyi
 * @Date:   2017-08-21 15:35:04
 * @Last Modified by:   zhangyi
 * @Last Modified time: 2017-08-22 10:49:04
 */
export function saveToLocal(id, key, value) {
    let _seller = window.localStorage.__seller__;
    if (!_seller) {
        _seller = {};
        _seller[id] = {};
    } else {
        _seller = JSON.parse(_seller);
        if (!_seller[id]) {
            _seller[id] = {};
        }
    }
    _seller[id][key] = value;
    window.localStorage.__seller__ = JSON.stringify(_seller);
};

export function loadFromLocal(id, key, def) {
    let _seller = window.localStorage.__seller__;
    if( !_seller ){
        return def;
    }
    _seller = JSON.parse(_seller)[id];
    if( !_seller ){
        return def;
    }

    let ret = _seller[key];
    return ret || def;
}
