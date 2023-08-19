/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const request = new XMLHttpRequest();
    request.withCredentials = true;
    request.responseType = options.responseType;
  
    const { method = 'GET', url, data, callback } = options;
  
    let requestData = null;
  
    if (method === 'GET') {
      const queryString = new URLSearchParams(data).toString();
      requestData = `${url}${queryString ? `?${queryString}` : ''}`;
  
      try {
        if (requestData) {
          request.open(method, requestData, true);
          request.send();
        }
      } catch (e) {
        callback(e);
      }
    } else {
      const formData = new FormData();
  
      for (const key in data) {
        formData.append(key, data[key]);
      }
  
      try {
        request.open(method, url, true);
        request.send(formData);
      } catch (e) {
        callback(e);
      }
    }
  
    request.addEventListener('readystatechange', () => {
      if (request.readyState === request.DONE && request.status === 200) {
        const err = null;
        const response = request.response;
        callback(err, response);
      }
    });
  
    return request;
  };