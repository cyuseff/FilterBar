const FakeData = {
  tags: [
    {id: '1', text: 'Tag001'},
    {id: '2', text: 'Tag002'},
    {id: '3', text: 'Tag003'},
    {id: '4', text: 'Tag004'},
    {id: '5', text: 'Tag005'}
  ]
};

const Fetch = {
  timer: null,

  get(url) {
    const promise = new Promise((resolve, reject) => {
      console.log(url);
      this.timer = window.setTimeout(() => {
        this.timer = null;
        resolve(FakeData);
      }, 2000);
    });

    promise.abort = () => {
      if(this.timer) {
        console.log('aborted!');
        window.clearTimeout(this.timer);
        this.timer = null;
      }
    };
    return promise;
  }
};

export default Fetch;
