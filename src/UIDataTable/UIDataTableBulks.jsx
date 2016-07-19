class UIDataTableBulks extends React.Component {
  constructor(props) {
    super(props);
    this.btns = null;
  }

  componentDidMount() {
    this.btns = this.refs['list'].getElementsByTagName('button');
  }

  disableBtns(disabled) {
    for(var i=0, l=this.btns.length; i < l; i++) this.btns[i].disabled = disabled;
  }

  clickHandler(url, method, enable) {
    let formData = u.serializeForm( this.props.getForm() );
    formData.filters = this.props.getFilters();

    this.disableBtns(true);

    Fetch[method](url, formData)
      .then((data) => {
        enable();
        this.disableBtns(false);
      })
      .catch((err) => {
        enable();
        this.disableBtns(false);
        throw err;
      });
  }

  render() {
    return (
      <ul className="list-inline" ref="list">
        {this.props.bulks.actions.map((bulk, idx) => {
          return (
            <li key={`bulk-${idx}`}>
              <UIButton
                classes="btn btn-sm btn-default"
                text={bulk.text}
                disabledText={bulk.disabledText}
                disabledOnClick
                clickHandler={(enable) => this.clickHandler(bulk.url, bulk.method, enable)}
              />
            </li>
          );
        })}
      </ul>
    );
  }
}
