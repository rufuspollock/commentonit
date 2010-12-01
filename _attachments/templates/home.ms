<h1>Welcome to Comment on It</h1>

<p>This site allows you comment on and annotate texts <strong>inline</strong>. To get started just create a document by pasting in some text and then share it with your colleagues.</p>

<p>There are {{count}} documents.</p>

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

