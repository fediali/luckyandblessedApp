export default class RestApi {
  getData(url) {
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

    fetch(req)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          images: data.home.not_logged.sliders,
          loaded: true,
        });
      })
      .catch(this.badStuff);
  }
}
