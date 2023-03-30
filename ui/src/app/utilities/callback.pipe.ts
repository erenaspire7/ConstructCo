import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'callback'
})
export class CallbackPipe implements PipeTransform {

  transform(value: any, tableHeadings: any): any {
    let convertDate = ['lastUpdated', 'hireDate', 'assignDate']
    let tableKeys = tableHeadings.map((el: any) => el.key)

    value = value.filter((el: any) => tableKeys.includes(el['key']))


    value = value.map((el: any) => {
      if (convertDate.includes(el['key'])) {
        let date = new Date(el['value'])

        const dateOptions: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        
        el['value'] = date.toLocaleDateString('en-US', dateOptions);

        return el
      } else {
        return el;
      }
    })



    return value;
  }
}
