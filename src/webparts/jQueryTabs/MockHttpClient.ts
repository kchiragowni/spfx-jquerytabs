import { ISPListItem } from './ISPList';

export default class MockHttpClient {
  private static _items: ISPListItem[] = [
      {
        Id: 1,
        Title: 'Group 1',
        Summary: 'Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit amet mauris. Nam elementum quam ullamcorper ante.'
      },
      {
        Id: 2,
        Title: 'Group 2',
        Summary: 'Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis.'
      }
  ];

  public static get(restUrl: string, options?: any): Promise<ISPListItem[]> {
    return new Promise<ISPListItem[]>((resolve) => {
      resolve(MockHttpClient._items);
    });
  }
}
