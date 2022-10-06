import { Component } from '@angular/core';

// Object copy values by reference.
// To keep reject function of each promise.
class RejectObject {
  public reject: (reason?: any) => void;
  public name: string;

  public constructor(reject: any, name: string) {
    this.reject = reject;
    this.name = name;
  }
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public rejectObj: RejectObject;

  public queryString = '';
  public output = 'Input query';

  public genereateRandomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public rejectLastPromise(): void {
    if (this.rejectObj) {
      this.rejectObj.reject('Promise for ' + this.rejectObj.name + ' is rejected!');
    }
  }

  public doPromise = (queryStr: string) => {
    const promiseFunction = new Promise((resolve, reject) => {
      this.rejectObj = new RejectObject(reject, queryStr);

      setTimeout(() => {
        // Mocking up OK.
        resolve('RESULT: ' + queryStr);
      }, this.genereateRandomInRange(500, 5000));
    });

    return promiseFunction;
  };

  public doWait = async (queryStr: string) => {
    console.log('Promise fetched for: ' + queryStr);
    this.rejectLastPromise();
    const promiseFunction = this.doPromise(queryStr);
    const promiseReturn = await promiseFunction.catch((reason) =>
      console.log(reason)
    );
    if (promiseReturn) {
      this.output = promiseReturn as string;
    }
  };

  public onKeyEvent(e: KeyboardEvent): void {
    this.doWait(this.queryString);
  }
}
