<h1>{{{pageHeading}}}</h1>

<form id="new-text" action="" method="post" class="doc-edit">
  <dl>
	<dt>
	  <label>Title</label>
	</dt>
	<dd>
	  <input type="text" name="title" value="{{title}}" class="doc-title" />
	</dd>
	<dt>
	  <label for="body">Body</label>
    (You can use <a target="_new" href="http://warpedvisions.org/projects/markdown-cheat-sheet/">Markdown</a>)
	</dt>
	<dd>
	  <textarea name="body" class="doc-body">{{body}}</textarea></p>
	</dd>
	<dt>
	<label for="tags">Click tags to add them. (split by ',')</label>
	</dt>
	<dd>
	<input type="text" name="tags" value="{{tags}}">
	</dd>
  </dl>
  <input id="preview" type="button" value="Preview"/>
  <input type="submit" value="Save &rarr;"/> 
  <span id="saved" style="display:none;">Saved</span>
</form>
<div id="show-preview"></div>

