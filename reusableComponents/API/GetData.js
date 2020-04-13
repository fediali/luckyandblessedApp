export default GetData = (url) => {
    let h = new Headers();
    h.append(
        'Authorization',
        'Basic: emF5YW50aGFyYW5pQGdtYWlsLmNvbTo3bjE3N0JFRTc5OXYyazRIeThkNVdKNDBIOXoxdzBvMw==',
    );
    h.append('Accept', 'application/json');

    let req = new Request(url, {
        headers: h,
        method: 'GET',
    });

    return fetch(req)

}