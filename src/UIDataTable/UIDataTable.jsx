import React from 'react';

class UIDataTable extends React.Component {
  constructor(props) {
    super(props);
    this.PAGINATION = {per_page: 30};
    this.xhr = null;

    const {params} = u.getUrlParams(window.location.href);
    this.sort = (params.order && params.asc)? {order: params.order[0], asc: params.asc[0]} : {};

    this.state = {
      data: [],
      meta: null,
      columns: this.mapcolumns(this.props.columns),
      loading: true,
      showBulk: false
    };
  }

  componentDidMount() {
    this.dataChange(null, null, this.PAGINATION);
  }

  mapcolumns(columns) {
    return columns.map((col) => {
      col.sorted = col.key === this.sort.order;
      col.asc = this.sort.asc;
      return col;
    });
  }

  getData(data) {
    // abort current xhr request
    if(this.xhr) {
      this.xhr.abort('aborted!!!!');
      this.xhr = null;
    }

    this.setState({
      data: [],
      meta: null,
      loading: true,
      showBulk: false
    });

    data = Fetch.cleanData(data);

    this.xhr = Fetch.fetch('GET', this.props.url, data);
    this.xhr
      .then(Fetch.checkStatus)
      .then(Fetch.parseJSON)
      .then((data) => {
        this.setState({
          data: data[this.props.data],
          meta: data.meta,
          columns: this.mapcolumns(this.props.columns),
          loading: false
        });
      })
      .catch(e => console.log(e));
  }

  dataChange(filters, sort, pagination) {
    let opts;
    if(filters) {
      this.sort = {};
      opts = u.mergeObjects(filters, this.PAGINATION);
    }

    if(sort) {
      this.sort = sort;
      filters = this.getFilters();
      opts = u.mergeObjects(filters, sort, this.PAGINATION);
    }

    if(pagination) {
      filters = this.getFilters();
      sort = this.sort;
      opts = u.mergeObjects(filters, sort, pagination);
    }

    this.getData(opts);
  }

  getFilters() {
    return Fetch.cleanData(this.refs['filterBar'].getValues());
  }

  getForm() {
    return this.refs.table.getForm();
  }

  formChange(form) {
    const showBulk = !!form.querySelector('input:checked');
    this.setState({showBulk});
  }

  renderTable() {
    let render;
    if(this.state.loading) {
      render = (
        <div className="padding-all">
          <i className="mdi mdi-refresh mdi-spin"></i> {`${window.I18n.t('admin.commons.loading')}...`}
        </div>
      );
    } else {
      render = (
        <UITable
          data={this.state.data}
          columns={this.state.columns}
          bulks={this.props.bulks}
          per_page={this.state.meta.per_page}
          total={this.state.meta.total_entries}
          sortCallback={(sort) => this.dataChange(null, sort)}
          formCallback={(form) => this.formChange(form)}
          ref="table"
        />
      );
    }
    return render;
  }

  render() {
    return (
      <div className={`data-table ${this.props.filters.length? 'show-filters' : ''}`}>
        <div className="data-table-filters">
          <UIFilterBar
            filters={this.props.filters}
            callback={(filters, obj) => this.dataChange(filters)}
            ref='filterBar'
          />
        </div>
        <div className="data-table-table">
          {this.renderTable()}
        </div>
        <UIDataTableFooter
          paginate={this.state.meta}
          onPaginate={(page, per_page) => this.dataChange(null, null, {page, per_page})}
          bulks={this.props.bulks}
          getForm={() => this.getForm()}
          getFilters={() => this.getFilters()}
          isData={this.state.data.length}
          showBulk={this.state.showBulk}
          ref='footer'
        />
      </div>
    );
  }
}
