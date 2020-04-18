export default DeleteData = (url,id) => {
    let h = new Headers();
    h.append(
        'Authorization',
        'Basic: emF5YW50aGFyYW5pQGdtYWlsLmNvbTo3bjE3N0JFRTc5OXYyazRIeThkNVdKNDBIOXoxdzBvMw==',
    );
    h.append('Accept', 'application/json');

    let req = new Request(url+"/"+id, {
        headers: h,
        method: 'DELETE',
    });

    return fetch(req)

}