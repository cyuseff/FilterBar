import React from 'react';

export default class UIDataTableFooter extends React.Component {
  renderBulk() {
    if(this.props.bulks && this.props.isData && this.props.showBulk) {
      return (
        <UIDataTableBulks
          bulks={this.props.bulks}
          getFilters={this.props.getFilters}
          getForm={this.props.getForm}
        />
      );
    }
  }

  render() {
    return (
      <div className="data-table-footer">
        <div className="data-table-footer-paginator">
          <UIPaginate {...this.props.paginate} callback={(page, per_page) => this.props.onPaginate(page, per_page)} />
        </div>
        <div className="data-table-footer-bulks">
          {this.renderBulk()}
        </div>
      </div>
    );
  }
}
