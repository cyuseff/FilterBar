/*
  filters: array
   ex: [
    {
      filterType: 'UIFilterDropdown',
      title: 'Status',
      name: 'active',
      multiple: false,
      opts: [
        {
          label: 'Active',
          value: 1
        }, {
          label: 'Inactive',
          value: 0
        }
      ]
    },
    {
      filterType: 'UISearch',
      name: 'query',
      placeholder: 'look!'
    }
  ]

  lockOnChange: boolean
  callback: function return {filters, {filter, value}, this, unlockFnc}
*/
import React, {Component} from 'react';
import u from '../utils'
import UIFilterDropdown from './UIFilterDropdown';
import UIFilterDropdownAsync from './UIFilterDropdownAsync';
import UISearch from '../UISearch/UISearch';

export default class UIFilterBar extends Component {
  constructor(props) {
    super(props);
    const {params} = u.getUrlParams(window.location.href);

    this.values = {};
    this.prevValue = null;
    this.filters = this.mergeFiltersWithParams(params, this.values);
  }

  mergeFiltersWithParams(params, values) {
    const arr = [];
    const filters = u.cloneObject(this.props.filters);

    let filter, key, vals, reg, selected;

    for(let i=0, l=filters.length; i < l; i++) {
      filter = filters[i];
      key = filter.name;
      if(params[key]) {
        if(filter.opts && filter.opts.length) {
          vals = `,${params[key].join(',')},`;
          filter.opts.map((opt) => {
            reg = new RegExp(`,${opt.value},`);
            opt.checked = reg.test(vals);
          });

          // for Async filters
          filter.selected = vals;
        } else {
          filter.value = params[key][0];
        }
      }

      // get initial selected values
      if(filter.opts) {
        selected = filter.opts.reduce((str, opt) => {
          return opt.checked? str + `,${opt.value}` : str;
        }, '');
        values[filter.name] = selected.replace(/^,/, '');
      } else {
        values[filter.name] = filter.value;
      }

      arr.push(filter);
    }
    return arr;
  }

  getValues() {
    return this.values;
  }

  filterChangeHandler(name, value, filter) {
    const prevs = this.getValues();
    let unlock;
    this.prevValue = {
      name,
      filter,
      value: prevs[name],
    };

    this.values[name] = value;
    if(this.props.callback) {
      if(this.props.lockOnChange) {
        this.lockFilters(true);
        unlock = (err) => {
          if(err) this.cancelChange();
          this.lockFilters(false);
        }
      }
      this.props.callback(this.getValues(), {name, value}, unlock);
    }
  }

  cancelChange() {
    const {name, filter, value} = this.prevValue;
    this.values[name] = value;
    filter.setSelected(value);
  }

  lockFilters(lock) {
    let btns = this.refs['list'].querySelectorAll('button, input[type="text"]');
    for(let i=0, l=btns.length; i < l; i++) {
      btns[i].disabled = lock;
    }
  }

  renderFilters() {
    return this.filters.map((filter) => {
      filter.callback = (name, value, filter) => {this.filterChangeHandler(name, value, filter)};
      let component;
      switch(filter.filterType) {
        case 'UIFilterDropdown':
          component = <UIFilterDropdown {...filter} />
          break;
        case 'UIFilterDropdownAsync':
          component = <UIFilterDropdownAsync {...filter} />
          break;
        case 'UISearch':
          component = <UISearch {...filter} />
          break;
      }
      return (
        <li key={`filter-${filter.name}`} className={`filter-list-item filter-${filter.filterType.toLowerCase()}`}>
          {component}
        </li>
      );
    })
  }

  render() {
    return (
      <ul className="filter-list" ref="list">
        {this.renderFilters()}
      </ul>
    );
  }
}
