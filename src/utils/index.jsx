const u = {
  mergeObjects(...args) {
    let obj = {};
    for (let i = 0, l = args.length; i < l; i++) {
      for (let k in args[i]) obj[k] = args[i][k];
    }
    return obj;
  },

  cloneObject(obj) {
    let copy;
    if (null === obj || undefined === obj || 'object' !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, l = obj.length; i < l; i++) {
        copy[i] = this.cloneObject(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.cloneObject(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  },

  getUrlParams(str) {
    const arr = str.split('?');
    const decoded = {};
    let params = {};
    let tmp, obj, key;

    if (arr.length > 2) throw new Error('Malformed URL');

    decoded.url = arr[0];

    // get params
    if (arr.length === 2) {
      params = {};
      tmp = arr[1].split('&');
      for (let i = 0, l = tmp.length; i < l; i++) {
        obj = tmp[i].split('=');
        key = obj[0];

        if (!params[key]) {
          params[key] = obj[1] ? obj[1].split(',') : undefined;
        } else if (obj[1]) {
          params[key] = params[key].concat(obj[1].split(','));
        }
      }
    }

    decoded.params = params;
    return decoded;
  },

  mapStringWithObjectValues(str, obj) {
    const reg = /\{.*?\}/g;
    return str.replace(reg, (key) => {
      key = key.replace(/\{|\}/g, '');
      return key.split('.').reduce((o, n) => {
        return (typeof o === 'object')? o[n] : undefined;
      }, obj);
    });
  },

  checkValidity(form) {
    const a = form.querySelectorAll('*[name]');
    let btn;
    for (let i = 0, l = a.length; i < l; i++) {
      if (!a[i].checkValidity()) {
        btn = form.querySelector('input.dummy-submit[type="submit"]');
        if (!btn) {
          btn = document.createElement('input');
          btn.type = 'submit';
          btn.className = 'dummy-submit';
          btn.style.display = 'none';
          form.appendChild(btn);
        }
        btn.click();
        return false;
      }
    }
    return true;
  },

  serializeForm(form) {
    const a = form.querySelectorAll('*[name]');
    let o = {};
    let item;

    for (let i = 0, l = a.length; i < l; i++) {
      item = a[i];
      if (o[item.name] !== undefined) {
        if (!o[item.name].push) o[item.name] = [o[item.name]];
        o[item.name].push(item.value || '');
      } else {
        o[item.name] = item.value || '';
      }
    }
    return o;
  }
};

export default u;
