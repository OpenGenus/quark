$( document ).ready(function() {

    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

    if (IDBTransaction){
        IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
        IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
    }

    var request = indexedDB.open('pages');
    request.onsuccess = function(e) {
        idb = e.target.result;
        var transaction = idb.transaction('page', IDBTransaction.READ_ONLY);
        var objectStore = transaction.objectStore('page');

        objectStore.openCursor().onsuccess = function(event){
            var cursor = event.target.result;
            if (cursor){
                console.log('Cursor data', cursor.value);
                cursor.continue();
            }else{
                console.log('Entries all displayed.');
            }
        };
    };
});