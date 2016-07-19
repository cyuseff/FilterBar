import React from 'react';
import ReactDOM from 'react-dom';
import UIFilterBar from './UIFilterBar/UIFilterBar';

const props = {
  filters: [
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
     filterType: 'UIFilterDropdownAsync',
     title: 'Tags',
     name: 'tags',
     multiple: true,
     url: '/fake-url',
     data: 'tags',
     map: {label: 'text', value: 'id'}
   },
   {
     filterType: 'UISearch',
     name: 'query',
     placeholder: 'Search...'
   }
 ],
 lockOnChange: false,
 callback: function(filters, obj) {
   let html = '<ul>';
   Object.keys(filters).forEach(k => {
     if(filters[k]) html += '<li>'+k+': '+filters[k]+'</li>';
   });
   html += '</ul>';
   document.getElementById('filters').innerHTML = html;

   html = obj.name+' => '+obj.value;
   document.getElementById('last').innerHTML = html;
 }
};

ReactDOM.render(<UIFilterBar {...props}/>, document.getElementById('root'));
