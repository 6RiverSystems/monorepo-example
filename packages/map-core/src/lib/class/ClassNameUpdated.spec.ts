import { TestBed } from '@angular/core/testing';

import { TestModule } from '../test.module';
import { ClassNameUpdater } from './ClassNameUpdater';

describe('ClassNameUpdater', () => {
	const fixture = document.createElement('div');
	document.body.appendChild(fixture);

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestModule],
		});
	});

	afterEach(() => {
		fixture.className = '';
	});

	it('should initialize with classes', () => {
		const classes = ['class1', 'class2', 'class3'];
		const updater = new ClassNameUpdater(() => fixture, 'foo_id', classes);
		expect(updater.classes).toEqual(classes);
	});

	it('should add classes', () => {
		const classes = ['class1'];
		const updater = new ClassNameUpdater(() => fixture, 'foo_id', classes);
		updater.syncClasses();
		updater.addClass('class2');
		expect(updater.classes).toEqual(['class1', 'class2']);
		expect(fixture.classList.contains('class1')).toBe(true);
		expect(fixture.classList.contains('class2')).toBe(true);
	});

	it('should remove classes', () => {
		const classes = ['class1', 'class2'];
		const updater = new ClassNameUpdater(() => fixture, 'foo_id', classes);
		updater.syncClasses();
		updater.removeClass('class1');
		expect(updater.classes).toEqual(['class2']);
		expect(fixture.classList.contains('class1')).toBe(false);
		expect(fixture.classList.contains('class2')).toBe(true);
	});

	it('should sync classes', () => {
		const updater = new ClassNameUpdater(() => fixture, 'foo_id', ['class1', 'class2']);
		expect(fixture.classList.contains('class1')).toBe(false);
		expect(fixture.classList.contains('class2')).toBe(false);
		updater.syncClasses();
		expect(fixture.classList.contains('class1')).toBe(true);
		expect(fixture.classList.contains('class2')).toBe(true);
	});
});
