import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-client-preview';

import styles from './JQueryTabs.module.scss';
import * as strings from 'jQueryTabsStrings';
import { IJQueryTabsWebPartProps } from './IJQueryTabsWebPartProps';
import importableModuleLoader from '@microsoft/sp-module-loader';
import { EnvironmentType } from '@microsoft/sp-client-base';
/* jQuery stuff*/
import TabsTemplate from './TabsTemplate';
import * as jQuery from 'jquery';
require('jqueryui');

/* Mock HTTP Client */
import MockHttpClient from './MockHttpClient';

/* REST Data */
import { ISPListItems, ISPListItem } from './ISPList';

export default class JQueryTabsWebPart extends BaseClientSideWebPart<IJQueryTabsWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
    importableModuleLoader.loadCss('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
  }

  public render(): void {

    const tabsOptions: JQueryUI.TabsOptions = {
      active: 1,
      collapsible: true
    };

    //this.domElement.innerHTML = TabsTemplate.templateHtml;

    this.domElement.innerHTML = `
      <div class="${styles.container}">
        <div class="${styles.container}">
            <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
                <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                    <h1 class="ms-font-l ms-fontColor-white">${this.properties.heading}</h1>
                    <p class="ms-font-l ms-fontColor-white">${this.properties.description}</p>
                </div>
            </div>
            <br/><br/>
            <div id="spListContainer" />
        </div>
      </div>`;

    this.__renderListAsync(tabsOptions);
    //jQuery(this.domElement).children('#tabs').tabs(tabsOptions);
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('heading', {
                  label: strings.HeadingFieldLabel
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true
                })
              ]
            },
            {
                groupName: strings.AdvancedGroupName,
                groupFields: [
                  PropertyPaneDropdown('listName', {
                    label: strings.ListFieldLabel,
                    options: [
                      {key:'Shared Documents', text: 'Documents'},
                      {key:'Tabs', text:'Tabs'}
                    ]
                  })
                ]
            }
          ]
        }
      ]
    };
  }

  private _getMockListData(): Promise<ISPListItems> {
    return MockHttpClient.get(this.context.pageContext.web.absoluteUrl)
            .then((data: ISPListItem[]) => {
                    var listData: ISPListItems = { value: data};
                    return listData;
            }) as Promise<ISPListItems>;
  }

  private _getListData(): Promise<ISPListItems> {
    return this.context.httpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('${this.properties.listName}')/items?$select=Id,Title,Summary`)
              .then((response: Response) => {
                return response.json();
              });
  };

  private __renderListAsync(tabOptions: JQueryUI.TabsOptions): void {
    // Local environment
    if(this.context.environment.type === EnvironmentType.Local) {
      this._getMockListData()
            .then((response) => {
              this._renderList(response.value);
            });
    }
    else {
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        })
        .then(() => {
          jQuery('#spListContainer').children('#tabs').tabs(tabOptions);
        });
    }
  }

  private _renderList(items: ISPListItem[]): void {
    let html: string = '';
    html += `<div id="tabs">`;
    html += '<ul>';
    items.forEach((item: ISPListItem) => {
      html += `<li><a href="#tabs-${item.Id}">${item.Title}</a></li>`;
    });
    html += `</ul>`;
    items.forEach((item: ISPListItem) => {
      html += `<div id="tabs-${item.Id}">`;
      html += `<p>${item.Summary}</p>`;
      html +=  `</div>`;
    });
    html +=  `</div>`;
    const listContainer = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;
  }
}
