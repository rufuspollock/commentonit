There are {{count}} documents.

{{#texts}}
<div class="text-item"
  <h3><a href="#/text/{{_id}}">{{title}}</a></h3>
	<div class="tags">
	  {{#tags}}
		<a href="{{link}}">{{tag}}</a>
	  {{/tags}}
	</div>
  <div class="by">
	<span class="date">{{created_at}}</span> 
	by {{author}}
  </div>
</div>
{{/texts}}

