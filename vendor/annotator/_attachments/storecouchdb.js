;(function($){

Annotator.Plugins.StoreCouchdb = DelegatorClass.extend({
	events: {
		'annotationCreated': 'annotationCreated',
		'annotationDeleted': 'annotationDeleted',
		'annotationUpdated': 'annotationUpdated'
	},

	options: {
		prefix: '/store',

		annotationData: {},

		loadFromSearch: {
			'limit': 0,
			'all_fields': 1,
			'uri': 'http://this/document/only'
		}
	},

	init: function (options, element) {
		this.options = $.extend(this.options, options)

		this.options.annotator = $(element).data('annotator')

		this.element = element
		this.annotations = []
		var dbname = 'annotations'
		this.db = $.couch.db(dbname)

		this.loadAnnotationsFromSearch(this.options.loadFromSearch)

		this._super()
	},

	annotationCreated: function (e, annotation) {
		var self = this

		// Pre-register the annotation so as to save the list of highlight
		// elements.
		if (this.annotations.indexOf(annotation) === -1) {
			this.registerAnnotation(annotation)

			this.db.saveDoc(this._dataFor(annotation), {
				success: function(resp) {
					self.updateAnnotation(annotation, resp)
				}
			})
		} else {
			// This is called to update annotations created at load time with
			// the highlight elements created by Annotator.
			this.updateAnnotation(annotation, {})
		}
	},

	annotationDeleted: function (e, annotation) {
		var self = this

		if ($.inArray(annotation, this.annotations) !== -1) {
			self.db.removeDoc(annotation, {
				success: function () {
					self.unregisterAnnotation(annotation) }
				}
			)
		}
	},

	annotationUpdated: function (e, annotation) {
		var self = this

		if ($.inArray(annotation, this.annotations) !== -1) {
			this.db.saveDoc(this._dataFor(annotation), {
				success: function () {
					self.updateAnnotation(annotation)
				}
			})
		}
	},

	// NB: registerAnnotation and unregisterAnnotation do no error-checking/
	// duplication avoidance of their own. Use with care.
	registerAnnotation: function (annotation) {
		this.annotations.push(annotation)
	},

	unregisterAnnotation: function (annotation) {
		this.annotations.splice(this.annotations.indexOf(annotation), 1)
	},

	updateAnnotation: function (annotation, data) {
		if ($.inArray(annotation, this.annotations) === -1) {
			console.error("Trying to update unregistered annotation!")
		} else {
			$.extend(annotation, data)
		}

		// Update the elements with our copies of the annotation objects (e.g.
		// with ids from the server).
		$(annotation.highlights).data('annotation', annotation)
	},

	loadAnnotationsFromSearch: function (searchOptions) {
		var self = this
		this.db.view('annotator/byuri?include_docs=true', {
			success: function (resp) {
				self.annotations = $.map(resp.rows, function(row, idx) {
					var out = row.doc;
					out.id = out._id;
					return out
				})
				self.options.annotator.loadAnnotations(self.annotations)
			}
		})
	},

	_dataFor: function (annotation) {
		// Store a reference to the highlights array. We can't serialize
		// a list of HTML Element objects.
		var highlights = annotation.highlights

		delete annotation.highlights

		// Preload with extra data.
		$.extend(annotation, this.options.annotationData)
		annotation.type = 'annotation'
		// deep copy
		var data = JSON.parse(JSON.stringify(annotation))

		// Restore the highlights array.
		annotation.highlights = highlights

		return data
	}
})

})(jQuery)
