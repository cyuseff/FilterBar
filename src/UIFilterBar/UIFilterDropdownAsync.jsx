/*
  url: string,
  data: string
  map: {label: 'name', value: 'key'},
  selected: string => 1,2,3,4
*/

import React, {Component} from 'react';
import Fetch from '../Fetch';
import u from '../utils';
import UIFilterDropdown from './UIFilterDropdown';

export default class UIFilterDropdownAsync extends Component {
  constructor(props) {
    super(props);
    this.state = {data: [], loading: true, error: false};
  }

  componentDidMount() {
    let test = '';
    let mapped;
    let reg;

    if(this.props.selected) {
      test = `,${this.props.selected.replace(/\s/g, '')},`;
    };

    Fetch.get(this.props.url)
      .then((data) => {
        mapped = data[this.props.data].map((item) => {
          reg = new RegExp(`,${item[this.props.map.value]},`);
          return {
            label: item[this.props.map.label],
            value: item[this.props.map.value],
            checked: reg.test(test)
          };
        });

        this.setState({
          data: mapped,
          loading: false
        });
      })
      .catch((e) => {
        console.log('error', e);
        this.setState({error: true});
      });
  }

  render() {
    let render;
    let props;

    if(this.state.error) {
      render = (
        <div className="dropdown">
          <button className="btn btn-default btn-sm" disabled>
            <i className="mdi mdi-close"></i> {`${window.I18n.t('admin.commons.error')}`}
          </button>
        </div>
      );
    } else {
      if(this.state.loading) {
        render = (
          <div className="dropdown">
            <button className="btn btn-default btn-sm" disabled>
              <i className="mdi mdi-refresh mdi-spin"></i> {`${window.I18n.t('admin.commons.loading')}...`}
            </button>
          </div>
        );
      } else {
        props = u.cloneObject(this.props);
        props.opts = props.opts? props.opts.concat(this.state.data) : this.state.data;

        render = (<UIFilterDropdown  {...props}/>);
      }
    }

    return render;
  }
}
