export default PutData = (url,jsonObj) => {
    console.log("PUT DATA", jsonObj);
    console.log("URL", url)
    let h = new Headers();
    h.append(
        'Authorization',
        'Basic: emF5YW50aGFyYW5pQGdtYWlsLmNvbTo3bjE3N0JFRTc5OXYyazRIeThkNVdKNDBIOXoxdzBvMw==',
    );
    h.append('Accept', 'application/json');
    h.append('Content-Type', 'application/json')

    let req = new Request(url, {
        headers: h,
        method: 'PUT',
        body: JSON.stringify(jsonObj)
    });

    return fetch(req)

}