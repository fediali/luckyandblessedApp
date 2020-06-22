import Globals from "../../Globals"

export default DeleteData = (url, id) => {
    let h = new Headers();
    h.append(
        'Authorization',
        Globals.AUTH_TOKEN,
    );
    h.append('Accept', 'application/json');

    let req = new Request(url + "/" + id, {
        headers: h,
        method: 'DELETE',
    });

    return fetch(req)

}