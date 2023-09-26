import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  // ...
  imports: [BrowserModule],
  // @hl-start
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // @hl-end
})
export class AppModule {}
