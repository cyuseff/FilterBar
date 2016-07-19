/*
  title:            (string) button text
  name:             (string) input[name]
  multiple:         (boolean) allow multiple selected values, default false
  dropup:           (boolean) default false.
  callback:         (fnc) executed when a element is clicked. Retuns name, value, opts.
  useIcon:          (str) if setted, the button will only show the icon passed. Ex: useIcon="mdi mdi-settings"
  opts:             (array) array of options:
                        Ex:
                          [{
                              label: 'First opt',
                              value: 1,
                              checked: true
                            }, {
                              label: 'Second opt',
                              value: 2,
                              checked: false
                          }]
*/

import React, {Component} from 'react';

export default class UIFilterDropdown extends Component {
  constructor(props) {
    super(props);
    const opts = this.props.opts || [];
    const selected = this.getSelected(opts);
    this.usePrompt = (this.props.usePrompt !== undefined)? this.props.usePrompt : true;
    this.state = {opts, selected};
  }

  updateState(notify) {
    const selected = this.getSelected(this.state.opts);
    this.setState({opts: this.state.opts, selected});

    if(notify && this.props.callback) this.props.callback(this.props.name, this.getValues(this.state.opts), this);
  }

  getValues(opts) {
    let selected = opts.reduce((str, opt) => {
      return opt.checked? str + `,${opt.value}` : str;
    }, '');
    return selected.replace(/^,/, '');
  }

  getSelected(opts) {
    let selected = opts.reduce((str, opt) => {
      return opt.checked? str + `, ${opt.label}` : str;
    }, '');
    return selected? selected.replace(/^, /, '') : window.I18n.t('admin.commons.all');
  }

  setSelected(value) {
    const opt = this.state.opts.find(opt => opt.value === value);
    if(opt) {
      this.changeHandler(opt, false);
    } else {
      this.resetOptsHandler(false);
    }
  }

  changeHandler(opt, notify=true) {
    let opts;
    opt.checked = !opt.checked;

    if(!this.props.multiple) {
      opts = this.state.opts;
      for(let i=0, l=opts.length; i < l; i++) {
        if(opts[i] === opt) continue;
        opts[i].checked = false;
      }
    }
    this.updateState(notify);
  }

  resetOptsHandler(notify=true) {
    const opts = this.state.opts;
    for(let i=0, l=opts.length; i < l; i++) opts[i].checked = false;
    this.updateState(notify);
  }

  renderButton() {
    const dropType = this.props.dropup? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down';
    let button;

    if(this.props.useIcon) {
      button = (
        <button className="btn btn-default btn-sm" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className={this.props.useIcon}></i> <i className={dropType}></i>
        </button>
      );
    } else {
      button = (
        <button className="btn btn-default btn-sm" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {this.props.title}: <strong>{this.state.selected}</strong> <i className={dropType}></i>
        </button>
      );
    };
    return button;
  }

  renderList() {
    return this.state.opts.map((opt) => {
      const checked = (opt.checked)? <span className="pull-right"><i className="glyphicon glyphicon-ok"></i></span> : '';
      return (
        <li key={opt.value}>
          <label>
            {checked}
            {opt.label}
            <input
              name={this.props.name}
              type={this.props.multiple? 'checkbox' : 'radio'}
              checked={opt.checked}
              value={opt.value}
              onChange={(e) => {
                e.preventDefault();
                this.changeHandler(opt);
              }}
            />
          </label>
        </li>
      );
    });
  }

  renderPrompt() {
    let render;
    if(this.usePrompt) {
      render = (
        <li key="all" onClick={e => this.resetOptsHandler()}>
          <label>{window.I18n.t('admin.commons.all')}</label>
        </li>
      );
    }
    return render;
  }

  render() {
    const dropType = this.props.dropup? 'dropdown dropup' : 'dropdown';
    return (
      <div className={dropType}>
        {this.renderButton()}
        <ul className="dropdown-menu" aria-labelledby="dLabel">
          {this.renderPrompt()}
          {this.renderList()}
        </ul>
      </div>
    );
  }
}
