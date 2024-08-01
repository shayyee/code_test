if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }
  
  let db;
  const request = indexedDB.open('myDatabase', 1);
  
  request.onupgradeneeded = event => {
    db = event.target.result;
    const objectStore = db.createObjectStore('myStore', { keyPath: 'id' });
    objectStore.createIndex('name', 'name', { unique: false });
  };
  
  request.onsuccess = event => {
    db = event.target.result;
  };
  
  request.onerror = event => {
    console.error('Database error:', event.target.errorCode);
  };
  
  function addData(data) {
    const transaction = db.transaction(['myStore'], 'readwrite');
    const objectStore = transaction.objectStore('myStore');
    const request = objectStore.add(data);
    request.onsuccess = () => {
      console.log('Data added to the store', data);
    };
    request.onerror = () => {
      console.error('Error adding data', request.error);
    };
  }
  
  function getData(id) {
    const transaction = db.transaction(['myStore']);
    const objectStore = transaction.objectStore('myStore');
    const request = objectStore.get(id);
    request.onsuccess = () => {
      console.log('Data retrieved:', request.result);
    };
    request.onerror = () => {
      console.error('Error retrieving data', request.error);
    };
  }
  
  window.addEventListener('online', () => {
    console.log('You are online');
    document.getElementById('status').textContent = 'You are online';
    syncData();
  });
  
  window.addEventListener('offline', () => {
    console.log('You are offline');
    document.getElementById('status').textContent = 'You are offline';
  });
  
  if (!navigator.onLine) {
    console.log('Currently offline');
    document.getElementById('status').textContent = 'Currently offline';
  }
  
  function syncData() {
    const transaction = db.transaction(['myStore']);
    const objectStore = transaction.objectStore('myStore');
    const request = objectStore.getAll();
    request.onsuccess = () => {
      const data = request.result;
      fetch('/sync', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(result => {
        console.log('Data synchronized', result);
        const deleteTransaction = db.transaction(['myStore'], 'readwrite');
        const deleteObjectStore = deleteTransaction.objectStore('myStore');
        deleteObjectStore.clear();
      })
      .catch(error => {
        console.error('Error synchronizing data', error);
      });
    };
  }
  