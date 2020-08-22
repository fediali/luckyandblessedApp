import Globals from "../../Globals"
export default GetData = (url, devToken = false) => {
    let h = new Headers();
    if (!devToken) {
        h.append(
            'Authorization',
            Globals.AUTH_TOKEN,
        );
    }else{
        h.append(
            'Authorization',
            'Basic emF5YW50aGFyYW5pQGdtYWlsLmNvbTpHYTVNTXI4cnVzbDIzOVIxaGQ2M2dwVzMya0ZBTU0yWg==',
        );
    }
    h.append('Accept', 'application/json');

    let req = new Request(url, {
        headers: h,
        method: 'GET',
    });

    return fetch(req)

}