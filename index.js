document.addEventListener('DOMContentLoaded', () => {

  const getData = (url) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const buffer = new TextEncoder('utf-8').encode(data.content);      
        crypto.subtle.digest('SHA-256', buffer)
      .then(digest => {
        const hashArray = Array.from(new Uint8Array(digest));
        const sha = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        let res = {
          content: data.content,
          sha256: sha
        };
        console.log(res);
        postRes('https://test-hermes.profisms.cz/work-tests/test1a.php', res);
        return res;})
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const postRes = (url, res) => {
    fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(res),
    })
    .then(response => {
      response.json();
      console.log('status', response.status);
      document.getElementById('data').innerHTML = res.content;
      document.getElementById('sha').innerHTML = res.sha256;
      document.getElementById('status').innerHTML = response.status = 200 ? '"OK" (HTTP 200)' : '"error" (HTTP 500)';
    })
    .catch((error) => {
      console.log(error)
    });
  }

  getData('https://test-hermes.profisms.cz/work-tests/test1.php');

});