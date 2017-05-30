import { NgSelect2WrapperExamplePage } from './app.po';

describe('ng-select2-wrapper-example App', () => {
  let page: NgSelect2WrapperExamplePage;

  beforeEach(() => {
    page = new NgSelect2WrapperExamplePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
