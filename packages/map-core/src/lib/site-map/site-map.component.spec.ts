import { Chance } from 'chance';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { LatLngBounds, LatLng } from 'leaflet';
import { EffectsModule } from '@ngrx/effects';

import { SiteMapComponent } from './site-map.component';
import { TestModule } from '../test.module';
import { LeafletDirective } from '../directives/leaflet.directive';
import { MapStackEditorDirective } from '../directives/map-stack-editor.directive';
import { SelectionService } from '../services/selection.service';
import { getRandomLatLngBounds } from '../test/lat-lng-bounds-factory';
import { QueueArea } from '../class/mapstack/QueueArea';
import { KeepOutArea } from '../class/mapstack/KeepOutArea';
import { SetMapStack, ValidateMapStack } from '../map-stack/map-stack.actions';
import { MapStack } from '../class/mapstack/MapStack';
import { DisplayOptionsService } from '../services/display-options.service';
import { MapStackEffects } from '../map-stack/map-stack.effects';
import { WorkflowPoint } from '../class/mapstack/WorkflowPoint';
import { Pose } from '../interfaces/pose';
import { ConnectivityMatrixService } from '../services/connectivity-matrix.service';
import { SimulatedObjectService } from '../services/simulated-object.service';

describe('SiteMapComponent', () => {
	const chance = new Chance();
	let component: SiteMapComponent;
	let selection: SelectionService;
	let fixture: ComponentFixture<SiteMapComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule, EffectsModule.forRoot([MapStackEffects])],
			providers: [ConnectivityMatrixService, DisplayOptionsService,
				SelectionService, SimulatedObjectService],
			declarations: [LeafletDirective, MapStackEditorDirective, SiteMapComponent],
		}).compileComponents();
	}));

	describe('EditorOptions', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(SiteMapComponent);
			const displayOptionsService = TestBed.get(DisplayOptionsService);
			displayOptionsService.selectPreset('editorOptions');
			selection = TestBed.get(SelectionService);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should show a spinner when the map is loading ', () => {
			let input = fixture.debugElement.query(By.css('.loading-container'));
			expect(input).toBeTruthy();

			component.loadingMessage = '';
			fixture.detectChanges();
			input = fixture.debugElement.query(By.css('.loading-container'));
			expect(input).toBeFalsy();

			component.loadingMessage = "I can't get no";
			fixture.detectChanges();
			input = fixture.debugElement.query(By.css('.loading-container'));
			expect(input).toBeTruthy();

			component.loadingMessage = 'Satisfaction';
			fixture.detectChanges();
			input = fixture.debugElement.query(By.css('.loading-container'));
			expect(input).toBeTruthy();
		});

		it('should open detail component', done => {
			const store = fixture.debugElement.injector.get(Store);

			spyOn(store, 'dispatch');

			// this should not result in a dispatch
			component.showDetail(undefined);

			// this should result in a dispatch
			const layer = new QueueArea(getRandomLatLngBounds());
			component.showDetail([layer]);

			setTimeout(() => {
				expect(store.dispatch).toHaveBeenCalledTimes(1);
				done();
			}, 500);
		});

		it('should add a new object and select it', () => {
			const latLngBounds = new LatLngBounds(
				new LatLng(chance.integer(), chance.integer()),
				new LatLng(chance.integer(), chance.integer()),
			);

			const store = fixture.debugElement.injector.get(Store);
			store.dispatch(new SetMapStack(new MapStack({ name: 'testMap' })));

			const layer = new KeepOutArea(latLngBounds, {}, 'my-layer', 'my-layer-id');
			component.addNewObject(layer);
			expect(component.findLayer('my-layer-id')).toEqual(layer);

			selection.select('my-layer-id');
			expect(layer.classNameUpdater.classes.includes('selected')).toBeTruthy();
			selection.deselect('my-layer-id');
			expect(layer.classNameUpdater.classes.includes('selected')).toBeFalsy();

			store.dispatch(new SetMapStack(new MapStack({ name: 'clear' })));
			expect(component.findLayer('my-layer-id')).toBeFalsy();
		});

		it('should show errors on objects that fail validation', done => {
			const store = fixture.debugElement.injector.get(Store);
			const mapStack = new MapStack({ name: 'testMap' });
			store.dispatch(new SetMapStack(mapStack));

			const layer = new WorkflowPoint(new Pose(0, 0, 90), { opacity: 0 }, 'my-layer-id');
			component.addNewObject(layer);
			expect(component.findLayer('my-layer-id')).toEqual(layer);

			store.dispatch(new ValidateMapStack(mapStack));

			setTimeout(() => {
				expect(layer.classNameUpdater.classes.includes('error')).toBeTruthy();
				store.dispatch(new SetMapStack(new MapStack({ name: 'clear' })));
				done();
			}, 500);
		});
	});

	describe('powerUserOptions', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(SiteMapComponent);
			component = fixture.componentInstance;
			const displayOptionsService = TestBed.get(DisplayOptionsService);
			displayOptionsService.selectPreset('liveViewOptions');
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});
	});

	describe('liveViewOptions', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(SiteMapComponent);
			const displayOptionsService = TestBed.get(DisplayOptionsService);
			displayOptionsService.selectPreset('liveViewOptions');
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			const store = fixture.debugElement.injector.get(Store);
			store.dispatch(new SetMapStack(new MapStack({ name: 'testMap' })));
			expect(component.mfpsRenderer).toBeTruthy();
		});
	});
});
