/*
  name:         (string) input[name]
  placeholder:  (string)
  value:        (string/number) default value;
  onChange:     (fnc) callback function. Return name, value;
*/

import React, {Component} from 'react';

export default class UISearch extends React.Component {
  constructor(props) {
    super(props);

    this.timer = null;
    this.last = null;
    this.delay = 300;

    this.name = this.props.name || 'query';
    this.placeholder = this.props.placeholder || '';
    this.callback = this.props.callback || function(q) { console.log(q); };

    this.state = {
      value: this.props.value || ''
    };
  }

  changeHandler(value) {
    if(this.timer) window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      let q = value.trim();
      if(q !== this.last) {
        this.last = q;
        this.callback(this.name, q);
      }
    }, this.delay);
    this.setState({value});
  }

  renderClearButton() {
    if(this.state.value) {
      return (
        <span className="ui-search-remove" onClick={() => this.changeHandler('') }>
          <i className="glyphicon glyphicon-remove"></i>
        </span>
      );
    }
  }

  render() {
    return (
      <div className={this.state.value? 'search-box clear-btn' : 'search-box'}>
        <input
          type="text"
          className="form-control input-sm"
          name={this.name}
          placeholder={this.placeholder}
          value={this.state.value}
          onChange={e => this.changeHandler(e.target.value)}
        />
      {this.renderClearButton()}
      </div>
    );
  }
}
