import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/from';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';

import { Action, Store } from "@ngrx/store";
import { Effect, Actions, toPayload } from '@ngrx/effects';

import * as booking from './../actions/booking';
import { CinemaService } from "../../core/cinema.service";

import * as fromRoot from './../reducers';

@Injectable()
export class BookingEffects {

    @Effect()
    hallLoad$: Observable<Action> = this.actions$
        .ofType(booking.ActionTypes.SELECT_SHOWTIME)
        .map(toPayload)
        .filter(payload => payload != null)
        .do((payload) => this.store.dispatch(new booking.HallLoadAction(null)))
        .switchMap(payload => {

            const nextSelect$ = this.actions$.ofType(booking.ActionTypes.SELECT_SHOWTIME);

            return this.cinemaService.getHall(payload)
                .takeUntil(nextSelect$)
                .map(hall => new booking.HallLoadSuccessAction(hall))
                .catch(() => of(new booking.HallLoadFailAction([])));
        });

    constructor(
        private actions$: Actions,
        private cinemaService: CinemaService,
        private store: Store<fromRoot.State>) { }
}