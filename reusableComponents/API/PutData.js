import Globals from "../../Globals"

export default PutData = (url, jsonObj) => {
    let h = new Headers();
    h.append(
        'Authorization',
        Globals.AUTH_TOKEN,
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