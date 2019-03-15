/**
 * URIHandler: Factory taking care of caching of the current app state using the query params
 */
const URIHandler = (() => { 
    
    let urlState = getItems(); // Private Local state containing the state of query params

    function hasItems()  {
        return Object.keys(urlState).length > 0;
    }

    function updateURI () {
        if (!hasItems()) {
            window.location.hash = '';
            return;
        }
        const encodedURI = encodeURI(JSON.stringify(urlState));
        window.location.hash = encodedURI;
    }

    function setItem (key, val) {
        urlState[key] = val;
        updateURI();
    };

    function removeItem (key) {
        delete urlState[key];
        updateURI();
    }

    function getItems() {
        try {
            const decodedURI = decodeURI(window.location.hash).split('#')[1];
            return JSON.parse(decodedURI);
        }
        catch(e) {
            return {};
        }
    }

    return {
        setItem,
        getItems,
        hasItems,
        removeItem
    }

})();