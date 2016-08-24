import Ember from 'ember';
import models from '../../../utils/model';
import NotifierMixin from '../../../mixins/notifier';

export default Ember.Controller.extend(NotifierMixin, {
	documentService: Ember.inject.service('document'),

	actions: {
		onCancel() {
			this.transitionToRoute('document');
		},

		onAddSection(section) {
			let self = this;
			debugger;

			console.log(section.get('contentType'));

			this.audit.record("added-section");
			this.audit.record("added-section-" + section.get('contentType'));

			let page = {
				documentId: this.get('model.document.id'),
				title: `${section.get('contentType')} Section`,
				level: 1,
				sequence: 2048,
				body: "",
				contentType: section.get('contentType')
			};

			let data = this.get('store').normalize('page', page);
			let pageData = this.get('store').push({ data: data });

			let meta = {
				documentId: this.get('model.document.id'),
				rawBody: "",
				config: ""
			};

			let metaData = this.get('store').normalize('page-meta', meta);
			let pageMetaData = this.get('store').push({ data: metaData });

			let model = {
				page: pageData,
				meta: pageMetaData
			};

			this.get('documentService').addPage(this.get('model.document.id'), model).then((newPage) => {
				this.transitionToRoute('document.edit',
					this.get('model.folder.id'),
					this.get('model.folder.slug'),
					this.get('model.document.id'),
					this.get('model.document.slug'),
					newPage.id);
			});
		}
	}
});
