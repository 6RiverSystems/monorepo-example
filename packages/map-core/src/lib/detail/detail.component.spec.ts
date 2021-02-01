import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { fireEvent } from '@testing-library/dom';
import uuid from 'uuid';

import { DetailComponent } from './detail.component';
import { TestModule } from '../test.module';
import { DisplayOptionsService } from '../services/display-options.service';
import { Aisle } from '../class/mapstack/Aisle';
import { getRandomLatLng } from '../test/lat-lng-factory';
import { MapCoreState } from '../reducers';
import { MapStackStateService } from '../services/map-stack-state.service';
import { MapStack } from '../class/mapstack/MapStack';
import { FetchMapStackComplete } from '../map-stack/map-stack.actions';
import { DetailOpen } from './detail.actions';

describe('DetailComponent', () => {
	let component: DetailComponent;
	let fixture: ComponentFixture<DetailComponent>;
	let service: MapStackStateService;
	let store: Store<MapCoreState>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
			providers: [MapStackStateService, DisplayOptionsService],
		}).compileComponents();

		store = TestBed.get(Store);
		service = TestBed.get(MapStackStateService);

		spyOn(service, 'edit');
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should edit map-inspector', async () => {
		const layer = new Aisle([getRandomLatLng(), getRandomLatLng()], {}, 'myTest', uuid());
		component.nextMode = true;
		const expectedResult = new MapStack({});
		store.dispatch(new FetchMapStackComplete(expectedResult));
		store.dispatch(new DetailOpen([layer]));
		fixture.detectChanges();
		expect(component.features.length).toEqual(1);

		const mapInspectorShadow = fixture.debugElement.query(By.css('map-inspector')).nativeElement
			.shadowRoot;
		const submit = mapInspectorShadow.querySelector('[type="submit"]');

		fireEvent.click(submit);
		expect(service.edit).toHaveBeenCalledTimes(1);
	});
});
