import Globals from "../../Globals"

export default PostData = (url, jsonObj, paypalOrder = null) => {
    // console.log(jsonObj)

    let h = new Headers();
    if (paypalOrder) {
        h.append(
            'Authorization',
            'Bearer ' + paypalOrder
        );
    }
    else {
        h.append(
            'Authorization',
            Globals.AUTH_TOKEN,
        );
    }

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