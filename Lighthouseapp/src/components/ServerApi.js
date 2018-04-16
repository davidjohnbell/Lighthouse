function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

export default class ServerAPI {
    baseUrl;

    constructor(baseURL) {
        this.baseUrl = baseURL + '/api';
    }

    async login(username, password) {
        let promise = new Promise(function(resolve, reject) {
            let data = JSON.stringify({
                "username": username,
                "password": password
            });
              
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = (e) => {
                if(xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }

            xhr.ontimeout = () => {
                reject('timeout');
            }

            
            xhr.open("POST", "https://lightengineapp.azurewebsites.net/api/users/login");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send(data);
        });
        return promise;
    }

    async register(username, password) {
        let promise = new Promise(function(resolve, reject) {
            let data = JSON.stringify({
                "username": username,
                "password": password
            });
              
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = (e) => {
                if(xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            
            xhr.ontimeout = () => {
                reject('timeout');
            }

            
            xhr.open("POST", "https://lightengineapp.azurewebsites.net/api/users/register");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send(data);
        });
        return promise;
    }

    async createLighthouse(bearerToken, settingsJSON, texture, thumbnail, obj) {
        let promise = new Promise(function (resolve, reject) {
            let form = new FormData();
            form.append('settings', settingsJSON);
            form.append('texture', dataURItoBlob(texture), uuidv4());
            form.append('thumbnail', dataURItoBlob(thumbnail), uuidv4());
            form.append('obj', new Blob([obj], {type: 'text/plain', endings: 'transparent'}), uuidv4());
            
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.onreadystatechange = (e) => {
                if(xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            
            xhr.ontimeout = () => {
                reject('timeout');
            }

            xhr.open("POST", "https://lightengineapp.azurewebsites.net/api/lighthouses/");
            xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send(form);
        });
        return promise;
    }

    async getFavorites(bearerToken) {
        let promise = new Promise(function(resolve, reject) {
            var data = null;

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = (e) => {
                if(xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            
            xhr.ontimeout = () => {
                reject('timeout');
            }

            
            xhr.open("GET", "https://lightengineapp.azurewebsites.net/api/users/");
            xhr.setRequestHeader("Authorization", bearerToken);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send(data);
        });
        return promise;
    }

    async getAllLighthouses(bearerToken) {
        let promise = new Promise(function(resolve, reject) {
            var data = null;

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = (e) => {
                if(xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            
            xhr.ontimeout = () => {
                reject('timeout');
            }

            xhr.open("GET", "https://lightengineapp.azurewebsites.net/api/lighthouses");
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send(data);
        });
        return promise;
    }

    async updateLighthouse(bearerToken, id, settingsJSON, texture, thumbnail, obj) {
        let promise = new Promise(function (resolve, reject) {
            let form = new FormData();
            form.append('settings', settingsJSON);
            form.append('texture', dataURItoBlob(texture));
            form.append('thumbnail', dataURItoBlob(thumbnail));
            form.append('obj', new Blob([obj], {type: 'plain/text', endings: 'native'}));
            
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.onreadystatechange = (e) => {
                if(xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            
            xhr.ontimeout = () => {
                reject('timeout');
            }

            xhr.open("PUT", `https://lightengineapp.azurewebsites.net/api/lighthouses/${id}`);
            xhr.setRequestHeader("Authorization", bearerToken);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send(data);
        });
        return promise;
    }

    addToFavorites(bearerToken, lighthouseId) {
        let promise = new Promise(function(resolve, reject) {
            var data = null;

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = (e) => {
                if(xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            
            xhr.ontimeout = () => {
                reject('timeout');
            }

            xhr.open("PUT", `https://lightengineapp.azurewebsites.net/api/users/favorites/${lighthouseId}`);
            xhr.setRequestHeader("Authorization", bearerToken);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send(data);
        });
        return promise;
    }

    deleteLighthouse(bearerToken, lighthouseId) {
        let promise = new Promise(function(resolve, reject) {
            var data = null;

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = (e) => {
                if(xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            
            xhr.ontimeout = () => {
                reject('timeout');
            }

            xhr.open("DELETE", `https://lightengineapp.azurewebsites.net/api/lighthouses/${lighthouseId}`);
            xhr.setRequestHeader("Authorization", bearerToken);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send(data);
        });
        return promise;
    }

    deleteUser(bearerToken, userId) {
        let promise = new Promise(function(resolve, reject) {
            var data = null;

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = (e) => {
                if(xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            
            xhr.ontimeout = () => {
                reject('timeout');
            }

            xhr.open("DELETE", `https://lightengineapp.azurewebsites.net/api/users/${userId}`);
            xhr.setRequestHeader("Authorization", bearerToken);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send(data);
        });
        return promise;
    }

    getResource(imagePath) {
        let promise = new Promise(function(resolve, reject) {
            var data = null;

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onreadystatechange = (e) => {
                if(xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }
            
            xhr.ontimeout = () => {
                reject('timeout');
            }

            xhr.open("GET", `https://lightengineapp.azurewebsites.net/uploads/${imagePath}`);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send(data);
        });
        return promise;
    }
}