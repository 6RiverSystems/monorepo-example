import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceClass, FaultState, FaultResolution } from '@sixriver/mfp_lib_js/browser';

import { TestModule } from '../../test.module';
import { MfpDisplayDetailComponent } from '../../detail/mfp-display-detail/mfp-display-detail.component';
import { Mfp, MotionState, Phase, WorkState } from '../../interfaces/mfp';
import { MfpDisplay } from '../../class/mapstack/MfpDisplay';

const mfp: Mfp = new Mfp({
	id: '00:04:4b:8c:98:c6',
	updated: new Date(),
	fieldUpdated: {
		pose: 1567005504315,
		faults: 1567005412950,
	},
	pose: { x: 1, y: 12, orientation: 0 },
	deviceClass: DeviceClass.MFP,
	faults: {},
	motionState: MotionState.PAUSED,
	name: 'nail',
	currentPose: null,
	jobSlotAssignments: [],
	phase: Phase.PICKING,
	state: WorkState.OFFLINE,
	taskBatches: [],
	aisleMask: [],
	takeoffDestination: 'start',
	userId: 'julio',
	workspaceReservations: [],
	workspaces: [],
	availableWorkspaces: null,
});

describe('MfpDisplayDetailComponent', () => {
	let component: MfpDisplayDetailComponent;
	let fixture: ComponentFixture<MfpDisplayDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MfpDisplayDetailComponent);
		component = fixture.componentInstance;
		component.mfp = mfp;
		component.layer = new MfpDisplay(new Mfp({ pose: { orientation: 0, x: 0, y: 0 } }), -1, {});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show faults', () => {
		component.mfp = new Mfp({
			...mfp,
			availableWorkspaces: null,
			faults: {
				BATTERY_COMMUNICATION_FAILURE: {
					code: FaultState.BATTERY_COMMUNICATION_FAILURE,
					resolution: FaultResolution.REBOOT,
					timestamp: new Date(),
					id: 'c82d4542-d818-45bc-94e1-7257f7ea89de',
				},
			},
		});
		expect(component).toBeTruthy();
	});
});
