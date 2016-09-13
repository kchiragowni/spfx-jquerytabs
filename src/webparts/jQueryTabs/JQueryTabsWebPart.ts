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

export default class JQueryTabsWebPart extends BaseClientSideWebPart<IJQueryTabsWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.jQueryTabs}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
              <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p class="ms-font-l ms-fontColor-white">${this.properties.description}</p>
              <a href="https://github.com/SharePoint/sp-dev-docs/wiki" class="ms-Button ${styles.button}">
                <span class="ms-Button-label">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
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
}
