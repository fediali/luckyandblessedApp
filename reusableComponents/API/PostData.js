export default PostData = (url,jsonObj) => {
    // console.log(jsonObj)
    
    let h = new Headers();
    h.append(
        'Authorization',
        'Basic: emF5YW50aGFyYW5pQGdtYWlsLmNvbTo3bjE3N0JFRTc5OXYyazRIeThkNVdKNDBIOXoxdzBvMw==',
    );
    h.append('Accept', 'application/json');
    h.append('Content-Type', 'application/json')
    // const formData = new FormData();
    // formData.append('first_name', profile.firstName);
    // formData.append('last_name', profile.lastName);
    // formData.append('email', profile.email);

    let req = new Request(url, {
        headers: h,
        method: 'POST',
        body: JSON.stringify(jsonObj)

    });

    return fetch(req)

}