import Globals from "../../Globals"
export default GetData = (url) => {
    let h = new Headers();
    h.append(
        'Authorization',
        Globals.AUTH_TOKEN,
    );
    h.append('Accept', 'application/json');

    let req = new Request(url, {
        headers: h,
        method: 'GET',
    });

    return fetch(req)

}